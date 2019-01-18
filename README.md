# frontend-download-sample
自己整理的一些项目中遇到过的关于上传和下载的一些Demo，大前端系列（也就是纯前端 + node端完成的下载，只要获取到数据下载工作全是前端来做），仅供给位看官参考，避免踩坑，即插即用，欢迎fork和star🌟，为这个仓库添砖加瓦～(P.S. 个人认为如果没写过上传下载其实还是挺麻烦的～)

## 写在前面
我平时在项目中接触的也就是一些上传图片，上传安装包，下载图片，下载安装包以及整理数据生成excel文件下载下来。暂时还没有接触过其他类型的，所以本项目可能有一定的局限性，只是给大家提供一种思路或者方案，有其他想法欢迎评论～

## 纯前端下载形式

**演示Demo**

```
  第一步： npm install -g http-server

  第二步： 进入工程目录

  第三步： $ http-server

  第四步： 浏览器输入 http://127.0.0.1:8080/

```


### 基于a标签下载

### 基于location&iframe下载

### 前端下载利器[FileSaver](https://github.com/eligrey/FileSaver.js)

## node端配合下载（大前端）

**演示Demo**
```
  第一步： cd node-demo

  第二步： yarn install

  第三步： yarn start

  第四步： 在浏览器 http://localhost:3006/ 查看Demo

```

### 先下载到本地再下载到浏览器

### 直接下载到浏览器 => [推荐]