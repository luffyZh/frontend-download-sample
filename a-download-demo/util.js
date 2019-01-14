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
