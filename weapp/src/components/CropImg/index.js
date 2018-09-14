import React from 'react';
import PropTypes from 'prop-types'
import {Modal,Slider } from 'antd'
import Func from "../../utils/publicFunc"
import fetch from 'dva/fetch';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from "./index.css"

/**
 * @param {File} image - Image File Object
 * @param {Object} pixelCrop - pixelCrop Object provided by react-image-crop
 * @param {String} fileName - Name of the returned file in Promise
 */
function getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );
    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob(file => {
        file.name = fileName;
        resolve(file);
        }, 'image/jpeg');
    });
}

class CropImg extends React.Component {
  state = {
    crop:'',//裁剪的大小
    file:'',//裁剪后的图片
  }
  constructor(props) {
    super(props);
  } 
  onComplete = (crop, pixelCrop) => {
    getCroppedImg(this.image, pixelCrop, 'text.png').then(file=>{
        this.setState({file})     
    });
  }
  handleOk = () => {
    this.props.BtnOk(this.state.file) 
  }
  onImageLoaded = (image) => {
    this.image = image;
  }
  onCropChange = (crop) => {
    this.setState({ crop });
  }
  render() {
    const {editorImg,cropSize,...modalProps} = this.props;
    const modalOpts = {
        onOk:this.handleOk,
        ...modalProps,
    }
    return (
      <Modal {...modalOpts}>
        <div className="crop">
            <ReactCrop
                crop={{...this.state.crop,aspect: cropSize}}
                src={editorImg}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onComplete}
                onChange={this.onCropChange}
            />
        </div>
      </Modal>
    );
  }
};

CropImg.propTypes = {
  editorImg: PropTypes.string,
  cropSize: PropTypes.number,
  visible: PropTypes.bool,
  maskClosable: PropTypes.bool,
  title: PropTypes.string,
  BtnOk: PropTypes.func,
  onCancel: PropTypes.func,
}
export default CropImg
