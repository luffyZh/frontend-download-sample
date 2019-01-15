// 图片转base64
function image2base64(img) {  
  const canvas = document.createElement("canvas");  
  canvas.width = img.width;  
  canvas.height = img.height;  
  const ctx = canvas.getContext("2d");  
  ctx.drawImage(img, 0, 0, img.width, img.height);  
  const mime = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();  
  const dataUrl = canvas.toDataURL("image/" + mime);  
  return dataUrl;
}

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

  setTimeout(function loadUrl() { // eslint-disable-line
    iframe.contentWindow.location.href = url;
  }, 50);
}
