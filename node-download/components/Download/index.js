import { Component } from 'react';
import { Button } from 'antd';
import { download } from '../../core/util';

export default class index extends Component {

  fsDownloadExcel = () => {
    console.log('fs下载excel');
    download('/download/fsExcel');
  }

  fsDownloadPackage = () => {
    console.log('request下载package');
    download('/download/requestPackage');
  }

  pipeDownloadExcel = () => {
    console.log('pipe下载excel');
    download('/download/pipeExcel');
  }

  pipeDownloadPackage = () => {
    console.log('pipe下载package');
    download('/download/pipePackage');
  }

  downloadZip = () => {
    download('/download/zipFile');
  }

  render() {
    return (
      <div className='download-container'>
        <style jsx>{`
          .download-container {
            display: flex;
            width: 100%;
            flex-direction: column;
          }
          .btn-container {
            display: flex;
            justify-content: space-around;
            margin: 10px 0;
          }
        `}</style>
        <div className='btn-container'>
          <Button onClick={this.fsDownloadExcel} type='primary'>fs下载Excel文件</Button>
          <Button onClick={this.fsDownloadPackage} type='primary' ghost>request下载安装包</Button>
        </div>
        <div className='btn-container'>
          <Button onClick={this.pipeDownloadExcel} type='primary'>buffer/pipe下载Excel文件</Button>
          <Button onClick={this.pipeDownloadPackage} type='primary' ghost>buffer/pipe下载安装包</Button>
        </div>
        <div className='btn-container'>
          <Button onClick={this.downloadZip}>下载 zip 文件</Button>
        </div>
      </div>
    );
  }
}
