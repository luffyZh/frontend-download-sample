const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');
const request = require('request');
const JSZip = require('jszip');
const { rootDir } = require('../../next.config');

const zip = new JSZip();

//读取目录及文件
function readDir(obj, nowPath) {
  let files = fs.readdirSync(nowPath);//读取目录中的所有文件及文件夹（同步操作）
  files.forEach(function (fileName, index) { //遍历检测目录中的文件
    console.log(fileName, index);//打印当前读取的文件名
    let fillPath = nowPath + "/" + fileName;
    let file = fs.statSync(fillPath);//获取一个文件的属性
    if (file.isDirectory()) { //如果是目录的话，继续查询
      let dirlist = zip.folder(fileName);//压缩对象中生成该目录
      readDir(dirlist, fillPath);//重新检索目录文件
    } else {
      obj.file(fileName, fs.readFileSync(fillPath));//压缩目录添加文件
    }
  });
}

//开始压缩文件
function startZIP() {
  const targetDir = path.join(__dirname, "../../static/download");
  readDir(zip, targetDir);
  zip.generateAsync({//设置压缩格式，开始打包
    type: "nodebuffer", //nodejs用
    compression: "DEFLATE", //压缩算法
    compressionOptions: {//压缩级别
      level: 9
    }
  }).then(function (content) {
    fs.writeFileSync(path.join(__dirname, "../../static/out.zip"), content, "utf-8");//将打包的内容写入 当前目录下的 result.zip中
  });
}

const downloadHandler = async (req, res, next) => {
  try {
    const {
      params: {
        type
      }
    } = req;
    switch (type) {
      case 'fsExcel': {
        const data = [
          [1, 2, 3],
          [true, false, null, 'sheetjs'],
          ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
          ['baz', null, 'qux'],
        ];
      
        const buffer = xlsx.build([{ name: 'mySheetName', data }]);

        // Write file to the response
        const tmpExcel = `filename.xlsx`;

        fs.writeFileSync(
          tmpExcel,
          buffer,
          {
            encoding: 'utf8',
          },
          err => {
            if (err) throw new Error(err);
          },
        );
      
        res.setHeader('Content-disposition', `attachment; filename="${tmpExcel}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        // pipe generated file to the response
        fs.createReadStream(tmpExcel).pipe(res);
        // delete file after sending to client
        fs.unlinkSync(tmpExcel);
        break;
      }
      case 'requestPackage': {
        res.setHeader('Content-disposition', 'attachment; filename=node-v8.14.0-linux-x64.tar.gz');
        request('https://npm.taobao.org/mirrors/node/v8.14.0/node-v8.14.0-linux-x64.tar.gz')
          .pipe(res);
        break;
      }
      case 'pipeExcel': {
        const data = [
          [1, 2, 3],
          [true, false, null, 'sheetjs'],
          ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
          ['baz', null, 'qux'],
        ];
      
        const buffer = xlsx.build([{ name: 'mySheetName', data }]);
        res.status(200)
          .attachment('bufferExcel.xlsx')
          .send(buffer);
        break;
      }  
      case 'pipePackage': {
        try {
          const packagePath = 'static/download/iTerm2-3_2_5.zip';
          res.download(path.join(rootDir, packagePath));

          // res.setHeader('Content-disposition', `attachment; filename="download-package.zip"`);
          // res.setHeader('Content-Type', 'application/octet-stream');
          // fs.createReadStream(path.join(rootDir, packagePath), 'utf-8').pipe(res);
        } catch (e) {
          console.error(e);
        }
        break;
      }
      case 'zipFile': {
        startZIP();
        break;
      }
      default:
        break;
    }
  } catch (e) {
    next(e);
  }
};

module.exports = downloadHandler;
