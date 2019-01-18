const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');
const request = require('request');
const { rootDir } = require('../../next.config');

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
      default:
        break;
    }
  } catch (e) {
    next(e);
  }
};

module.exports = downloadHandler;
