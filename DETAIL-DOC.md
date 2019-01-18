# [frontend-download-sample](https://github.com/luffyZh/frontend-download-sample)
自己整理的一些项目中遇到过的关于上传和下载的一些Demo，大前端系列（也就是纯前端 + node端完成的下载，只要获取到数据下载工作全是前端来做），仅供给位看官参考，避免踩坑，即插即用，欢迎fork和star🌟，为这个仓库添砖加瓦～(P.S. 个人认为如果没写过上传下载其实还是挺麻烦的，这个基本能覆盖大部分场景了～)

#### 包括内容
 - 纯前端下载
    - 基于a标签
    - location && iframe
    - FileSaver ---> **[推荐]**
 - node端下载
    - 先下载到本地，再下载到浏览器
    - 直接流向浏览器下载 **[推荐]**

 =======>  **[frontend-download-sample](https://github.com/luffyZh/frontend-download-sample)**
 
 **在这里怕大家没有耐心看下去，放一个强烈推荐的filesaver的Demo动态图**
 
![](https://user-gold-cdn.xitu.io/2019/1/18/1685f6aa32c3339f?w=1966&h=1732&f=gif&s=1732235)
 

## 写在前面
上传和下载个人认为在前端开发时稍微复杂一丢丢，需要额外处理一些事情而不是直接获取数据渲染页面，所以想着把平时遇到过的一些场景整理一下分享出来，大牛绕过，不喜勿喷～我平时在项目中接触的也就是一些上传图片，上传安装包，下载图片，下载安装包以及整理数据生成excel文件下载下来。暂时还没有接触过其他类型的，所以本项目可能有一定的局限性，只是给大家提供一种思路或者方案，有其他想法欢迎评论～

## 纯前端下载形式
顾名思义，纯前端实现，也就是不依赖于任何后端。不过这种方式有一定的局限性，比如下载类型，写法，数据形式等等。但是既然不依赖与后端，在可接受范围之内还是很推荐使用的，毕竟简单啊～

### 基于a标签下载
说到简单，那么最简单的就是这个了。那就是基于`<a>`标签的下载文件方式，真的是超级简单。使用方法如下：
```
href: 文件的绝对/相对地址
download: 文件名（可省略，省略后浏览器自动识别源文件名）
<a href='xxx.jpg' download='file.jpg'>下载jpg图片</a>
```
那么既然这么简单，那肯定是存在问题的。

![](https://user-gold-cdn.xitu.io/2019/1/14/1684b941622ed06e?w=1670&h=866&f=png&s=147872)
上面这张图片是官方提供的兼容性，目前只有FireFox和Chrome支持download属性。至少这两个对于开发者来说不陌生，占有量也很大，所以也还可以吧，但是接下来我又尝试了一下这两个浏览器的兼容性情况。
![](https://user-gold-cdn.xitu.io/2019/1/14/1684b92dcf00e087?w=2198&h=1244&f=png&s=262890)
上面这张，是FireFox浏览器最新版，可以看到点击下载文件会弹出一个对话框，之后点击保存文件才可以进行下载，同时只能下载不能被浏览器打开的文件类型，如图片、文本文件、html文件这种可以被打开的文件，是无法被下载的直接在浏览器进行预览。
![](https://user-gold-cdn.xitu.io/2019/1/14/1684b93a7cbcf337?w=1270&h=968&f=png&s=53725)
上面这张，是Chrome最新版，与FireFox相同，对于图片文件和文本文件这种可以被浏览器打开的文件不会被下载，而excel和安装包这种文件是可以被直接下载的，无需进行任何二次确认操作。

#### 那么能不能不让浏览器预览图片(或pdf或txt文件)？
肯定能啊～为什么呢？其实a标签的href属性还可以接受除了相对和绝对路径之外的其他形式Url，比如下面我们要用到的DataUrl和BlobUrl。我们使用这种形式，就可以让浏览器不预览而直接下载图片了，当然了操作起来更麻烦一些了就。
- DataUrl
```
 // 首先，图片转base64
 // ./util.js
 
 // html页面，将a标签href属性动态赋值为dataUrl
 <a id='downloadDataUrl' class="button is-dark">下载data:Url图片</a>
 ...
 <script>
  const image = new Image();
  image.setAttribute("crossOrigin",'Anonymous');
  image.src = '../files/test-download.png' + '?' + new Date().getTime();
  image.onload = function() {  
    const imageDataUrl = image2base64(image);  
    const downloadDataUrlDom = document.getElementById('downloadDataUrl');
    downloadDataUrlDom.setAttribute('href', imageDataUrl);
    downloadDataUrlDom.setAttribute('download', 'download-data-url.png');
    downloadDataUrlDom.addEventListener('click', () => {
      console.log('下载文件');
    });
  }  
</script>
```
如下图，可以看到不再是预览文件，而是直接下载文件了。这里面有一些坑，比如[canvas.toDataUrl的一些问题以及解决办法](https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror)，我就不多说了，大家自己去看看。
![](https://user-gold-cdn.xitu.io/2019/1/14/1684bbc3b88a4884?w=1327&h=947&f=png&s=76231)

- BlobUrl
整体逻辑更复杂了，首先 文件 -> base64(dataUrl) -> blob -> blobUrl
```
 // 第一步：首先需要将文件转换成base64，方法上面一样
 // 第二步：将base64转换成blob数据
 // DataUrl 转 Blob数据
    function dataUrl2Blob(dataUrl) {
      var arr = dataUrl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bStr = atob(arr[1]),
          n = bStr.length,
          unit8Array = new Uint8Array(n);
      while (n--) {
        unit8Array[n] = bStr.charCodeAt(n);
      }
      return new Blob([unit8Array], { type: mime });
    } 
 // 第三步： 将blob数据转换成BlobUrl
 URL.createObjectURL(imageBlobData);
 
 // 完整代码
  <a id='downloadBlobUrl' class="button is-danger">下载blobUrl图片</a>
  ...
  const image2 = new Image();  
  image2.setAttribute("crossOrigin",'Anonymous');
  image2.src = '../files/test-download.png' + '?' + new Date().getTime();
  image2.onload = function() {  
    const imageDataUrl = image2base64(image2);
    const imageBlobData = dataUrl2Blob(imageDataUrl);
    const downloadDataUrlDom = document.getElementById('downloadBlobUrl');
    downloadDataUrlDom.setAttribute('href', URL.createObjectURL(imageBlobData));
    downloadDataUrlDom.setAttribute('download', 'download-data-url.png');
    downloadDataUrlDom.addEventListener('click', () => {
      console.log('下载文件');
    });
  }
```

> 【总结】: Chrome在兼容性上更胜一筹，但是二者总体来说都存在一些问题，不能直接下载图片和文本文件，但是毕竟这么简洁，你没进行任何多余的操作，存在问题合情合理。同时，上面的几种方式也看到了，dataUrl适合图片的下载，而blobUrl虽然要麻烦一些，但是对于文本文件的下载还是非常有用的，**你可以直接把要下载的内容转换成blob数据，然后转换成blobUrl进行下载，适用于.txt，.json等文件类型**。

> 【建议】: 如果下载的需求是特殊文件类型，如安装包，excel文件，并且可以存放在CDN又一个可访问的url链接。那么这种方式非常完美，当然，如果你可以接受上面所说的兼容性问题。**同时如果你采用dataUrl或者blobUrl的时候，由于存在很多问题，比如cors之类的事情，建议可以使用这种方法，但是需要配合后端，也就是后端帮你转换好，你直接拿转换好的url来下载就行了。**

### location.href 和 iframe下载
上面这两种非常好理解，就是在另一个窗口或者当前地址栏地址指向下载链接，下载链接要求是dataUrl或者blobUrl。只不过，iframe是更高级一些，也就是可以帮助我们做到无闪下载，作为开发者大家应该都懂，我就不多BB了。

![](https://user-gold-cdn.xitu.io/2019/1/15/1684febe41f58243?w=2072&h=1264&f=gif&s=1062233)
从上面这个动图，可以看出来，这个方法其实还不如`<a>`标签下载，为什么这么说呢，会因为a标签方法虽然会预览浏览器可以预览的文件，但是如果进行适当转化，还是能进行下载的。但是location这种方法无论是dataUrl还是blobUrl，只要是图片、文本文件以及pdf等所有浏览器可以打开的文件，都会直接给你预览，只能下载那些浏览器不支持预览的那些文件。所以Just so so了。

#### iframe封装无闪现下载方法
本质很简单，就是不让当前浏览器窗口执行下载操作，而是另开一个iframe进行文件的下载。但是这个iframe是用户不可见的～  
**这里需要注意，如果是纯前端，建议不要进行图片等浏览器可打开的文件下载，因为隐藏iframe里打开你也看不到，也就是他的问题还是上面那些。可以进行excel、zip以及各种资源文件的下载。**
```
// 无闪现下载excel
function download(url) {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  function iframeLoad() {
    console.log('iframe onload');
    const win = iframe.contentWindow;
    const doc = win.document;
    if (win.location.href === url) {
      if (doc.body.childNodes.length > 0) {
        // response is error
      }
      iframe.parentNode.removeChild(iframe);
    }
  }
  if ('onload' in iframe) {
    iframe.onload = iframeLoad;
  } else if (iframe.attachEvent) {
    iframe.attachEvent('onload', iframeLoad);
  } else {
    iframe.onreadystatechange = function onreadystatechange() {
      if (iframe.readyState === 'complete') {
        iframeLoad;
      }
    };
  }
  iframe.src = '';
  document.body.appendChild(iframe);

  setTimeout(function loadUrl() {
    iframe.contentWindow.location.href = url;
  }, 50);
}
```

> 如果你在项目里需要进行无闪现下载，什么都不用做，只需要调用 `download(url)`，即可进行无闪现下载～亲测可用

### 使用[FileSaver](https://github.com/eligrey/FileSaver.js)强大的前端下载插件 -> 【强烈推荐】

FileSaver的下载方式完全是前端(Client-Side)的下载方式，它是基于Blob进行下载的，当然因为是基于前端下载，所以浏览器下载会有一定的限制，也就是Blob数据的大小不能过大，看看官网给的相关参数：

![](https://user-gold-cdn.xitu.io/2019/1/16/1685593ba39d000e?w=1362&h=902&f=png&s=162367)
> 可以看到，基本对于支持的浏览器来说，大小可以达到 500MB+，应该已经可以满足大部分需求了。如果文件确实很大，官网给出了替代方案[StreamSaver](https://github.com/jimmywarting/StreamSaver.js)，没去研究过这个，不过作者既然推荐可能也很好，感兴趣的可以去看看。

前面讲到了，FileSaver是基于Blob的，其实并不准确，可以看一下官网：

![](https://user-gold-cdn.xitu.io/2019/1/16/16855a6905776cee?w=1846&h=366&f=png&s=66370)
其实它支持Blob、File和Url进行下载，但是如果基于url了我也没必要用FileSaver了，那个`<a>`标签也挺好的是不？然后基于File一般都是特定场景，比如上传的时候，才会用到FileReader之类的API，说实话我也没怎么用过，都是封装的，所以这里也不做介绍。**开头也说过了，希望小伙伴可以给这个仓库添加东西啊，可以增加自己的下载Demo到这里，非常欢迎**  

所以我这篇文章讨论的下载，就是基于Blob。首要工作就是将文件转换成Blob数据。下面几个例子都是这样：

#### FileSaver ---- 下载canvas
 - 依赖 - [canvas-to-blob](https://github.com/blueimp/JavaScript-Canvas-to-Blob)  

这个Demo简单点的话其实可以直接用canvas画一个image在页面上，然后再进行下载，但是那样还不如直接下载图片了，所以麻烦一些，写一个canvas白板，然后下载我们自己绘制的内容并且起名字进行下载。

![](https://user-gold-cdn.xitu.io/2019/1/16/168559d0d96d8859?w=1618&h=1162&f=gif&s=771910)

```
 // 生成下载的文件名 
 function generateFilename(id, mime) {
    const filename = document.getElementById(id).value || document.getElementById(id).placeholder;
    return filename + mime;
  }
  const canvasDownloadDom = document.getElementById('download-canvas');
  canvasDownloadDom.addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    const filename = generateFilename('canvasName', '.png');
    if (canvas.toBlob) {
      // 调用方法将canvas转换成blob数据
      canvas.toBlob(
          function (blob) {
            // 调用FileSaver方法下载
            saveAs(blob, filename);
          },
          'image/png'
      );
    }   
  });
```
> 代码非常简单，感兴趣的小伙伴可以去看看每个插件内部的代码。我这里就是应用级别的示例了。

#### FileSaver ---- 直接下载图片
直接下载图片就是将图片转换成Blob数据，然后进行下载。

![](https://user-gold-cdn.xitu.io/2019/1/16/16855ced390079b7?w=1558&h=1114&f=gif&s=356937)
```
// FileSaver 下载文件
  const image = new Image();  
  image.setAttribute("crossOrigin",'Anonymous');
  image.src = '../files/test-download.png' + '?' + new Date().getTime();
  image.onload = function() {  
    const imageDataUrl = image2base64(image);
    const imageBlobData = dataUrl2Blob(imageDataUrl);
    const downloadImageDom = document.getElementById('download-image');
    downloadImageDom.addEventListener('click', () => {
      saveAs(imageBlobData, 'test-download.png');
    });
  }
```
> 这代码就更简单了，就是前面`<a>`标签下载Blob数据的代码，数据转换是一样的，只不过下载使用的是FileSaver。

#### FileSaver ---- 下载文本文件

下载文本文件就更容易了，因为JavaScript支持直接将字符串构造成Blob对象。
```
const textBlob = new Blob(["your target string"], {type: "text/plain;charset=utf-8"});
```

![](https://user-gold-cdn.xitu.io/2019/1/16/16855e0eeb8d2fbf?w=1594&h=1030&f=gif&s=295268)
下载下来的txt文件长这样：
![](https://user-gold-cdn.xitu.io/2019/1/16/16855e1005db7b6e?w=1280&h=824&f=png&s=152490)

```
 // FileSaver 下载文本文件
  const txtDownloadDom = document.getElementById('download-txt');
  txtDownloadDom.addEventListener('click', () => {
    const textarea = document.getElementById('textarea');
    const filename = generateFilename('textareaName', '.txt');
    const textBlob = new Blob([textarea.value], {type: "text/plain;charset=utf-8"});
    saveAs(textBlob, filename);
  });
```

#### FileSaver ---- 下载Excel文件(搭配js-xlsx)
前面的都相对简单一些，但是其实除了下载图片，可能平时也没什么业务场景需要到。接下来要说的可是所有商务系统几乎都能遇到的了，那就是 —— 下载报表，也就是Excel文件。这里面就使用FileSaver配合js-xlsx来进行excel的纯前端下载工作～

![](https://user-gold-cdn.xitu.io/2019/1/16/16855ff9fc47d65b?w=1678&h=842&f=gif&s=256785)
下载下来的文件长这样：

![](https://user-gold-cdn.xitu.io/2019/1/16/168560037de46741?w=758&h=592&f=png&s=136699)
```
// 下载excel文件
  const excelDownloadDom = document.getElementById('download-excel');
  excelDownloadDom.addEventListener('click', () => {
    // 找到table节点调用方法转化数据
    const wb = XLSX.utils.table_to_book(document.querySelector('#table-excel'));
    // 生成excel数据
    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
    try {
      // 下载excel文件
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table-excel.xlsx');
    } catch (e) {
      if (typeof console !== 'undefined') console.log(e, wbout)
    }
  });
```
> 这里面我只是介绍如何用FileSaver在前端下载excel文件，至于`js-xlsx`如何将数据转化成excel的这里不做介绍。我只是简单的调用了`js-xlsx`的将table转成excel的方法， `js-xlsx`还有很多高级功能，有这方面需求的去看看官方文档[js-xlsx](https://sheetjs.com/)就好了～

## node端配合下载（大前端）
带后端支持的下载就要轻松很多了，为什么呢，因为上面所有纯前端下载都可以与后端进行配合使用，也就是后端生成对应的下载链接下载数据返回给前端，前端根据设计方案按需使用上面几种方式下载，肯定能下载成功。  
那么node端配合下载肯定是要下载点不一样的东西了——那就是**文件流**。
> 有很多场景，那就是大文件不是存在于CDN，而是以文件流的形式存放在内存。那么就没有对应的下载链接，下载对应文件的时候，后端返回的就是文件流。而node里为我们提供`Stream`支持各种流操纵。所以我们可以在node端直接进行文件的下载。

### 先下载到本地在从浏览器下载
- fs下载Excel
![](https://user-gold-cdn.xitu.io/2019/1/17/1685ba34e5a397a0?w=1908&h=906&f=gif&s=315686)
下载下来的Excel文件:
![](https://user-gold-cdn.xitu.io/2019/1/17/1685badb0df8f6d6?w=660&h=484&f=png&s=120776)
```
// 第一步：构造数据
const data = [
  [1, 2, 3],
  [true, false, null, 'sheetjs'],
  ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
  ['baz', null, 'qux'],
];
// 第二步：生成excel的Buffer数据
const buffer = xlsx.build([{ name: 'mySheetName', data }]);

// 第三步：写文件到本地
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
// 第四步：从本地读取文件下载到浏览器
res.setHeader('Content-disposition', `attachment; filename="${tmpExcel}"`);
res.setHeader('Content-Type', 'application/octet-stream');
// pipe generated file to the response
fs.createReadStream(tmpExcel).pipe(res);
// 下载完成后删除文件
fs.unlinkSync(tmpExcel);
```
> 下载excel在node端我使用的不是`js-xlsx`而是[node-xlsx](https://github.com/mgcrea/node-xlsx)，因为它构造数据非常简单，功能也很强大，十分推荐大家使用～

- fs下载文件

这里场景不是很容易描述，因为Demo我都是将文件放到本地目录的，所以我读取本地文件再下载到本地再下载到浏览器，我这不是有病吗。。。一般场景是文件以文件流的形式存在内存里，然后我们通过接口下载到本地再从本地下载到浏览器。或者是上传文件保存到本地，然后在从本地进行相关操作，这里就不写示例代码了。


### node端直接流向浏览器下载【推荐】

node端，我使用的是express框架（其他的框架也都一样），如果你是文件流直接过来的，那么直接调用`res.attachment()`下载文件流，如果是文件path，那么可以直接`res.download(filepath)`。具体见demo

- 直接下载Excel

上面过程其实多经历了一步，为什么呢？因为拿到buffer之后我们其实就可以直接将buffer流向浏览器下载了～这里我用的是Express框架，直接使用`res.attachment()`方法就可以了。
![](https://user-gold-cdn.xitu.io/2019/1/17/1685bc1e8bb54cbe?w=1928&h=1330&f=gif&s=2152409)
下载下来的文件与上面一模一样我就不展示了。

> 按照我的理解，第二种明显要比第一种好很多为什么还要列出第一种呢？我个人觉得，第一种虽然一定会牺牲一定的性能，但是先下载到本地就可以对文件进行一些校验，比如文件是否完整，文件名之类的是否合法，还有些时候的场景可能。毕竟不是所有的下载场景都像Demo这样简单。存在即合理，所以还是都罗列出来。

```
// 第一步：构造数据
const data = [
  [1, 2, 3],
  [true, false, null, 'sheetjs'],
  ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
  ['baz', null, 'qux'],
];
// 第二步：生成buffer
const buffer = xlsx.build([{ name: 'mySheetName', data }]);
// 第三步：直接下载
res.status(200)
  .attachment('bufferExcel.xlsx')
  .send(buffer);
```
```
// 上面下载代码等同于下面这段代码（nodejs原生代码）
res.setHeader('Content-disposition', `attachment; filename="${tmpExcel}"`);
res.setHeader('Content-Type', 'application/octet-stream');
res.end(buffer);
```
- 直接下载文件流

这里我把文件安装包放在本地了，然后我先读取文件内容同时下载到浏览器～
```
// 第一种，已知文件路径直接下载
try {
  const packagePath = 'static/download/iTerm2-3_2_5.zip';
  res.download(path.join(rootDir, packagePath));
} catch (e) {
  console.error(e);
}
```

```
// 第二种，读取本地文件流向浏览器
res.setHeader('Content-disposition', `attachment; filename="download-package.zip"`);
res.setHeader('Content-Type', 'application/octet-stream');
fs.createReadStream(path.join(rootDir, packagePath), 'utf-8').pipe(res);
```

### [request](https://www.npmjs.com/package/request)
最后给大家安利一个将Stream API使用到极致的Http(Https)请求库 —— request。
```
// 不加这一行下载下来的文件没有后缀
res.setHeader('Content-disposition', 'attachment; filename=node-v8.14.0-linux-x64.tar.gz');
request('https://npm.taobao.org/mirrors/node/v8.14.0/node-v8.14.0-linux-x64.tar.gz')
  .pipe(res);
```

> 这里我为了省时间，就用了自己以前搭过的一个脚手架[Next-Antd-Scafflod](https://github.com/luffyZh/next-antd-scafflod)，直接在这里写的Demo。你可以理解我在打广告，你点进去给个star我也不介意😄。

## 总结
看到这里无论怎么样都十分感谢了，总结的不怎么样，可以理解为自我总结文章吧。如果对大家能有那么一点点启发那就更好了。最后如果有兴趣或者有疑问，可以留言或者直接去仓库里提～

Star🌟地址：[frontend-download-sample](https://github.com/luffyZh/frontend-download-sample)