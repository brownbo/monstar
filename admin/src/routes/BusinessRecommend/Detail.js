import React from 'react';
import { connect } from 'dva'

import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, Button, Upload, Modal, Select, Radio, DatePicker, Row, Col, Icon, message, Alert } from 'antd'
import Func from "../../utils/publicFunc"
//裁剪图片
import CropImg from '../../components/CropImg'
import formRules from '../../utils/formRules'
import styles from './app.css'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'

const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
class BusinessDetail extends React.Component {
  state = {
    content: null,
    previewVisible: false,
    previewImage: '',
  }
  constructor(props) {
    super(props);
    this.api_name = 'businessRecommend';
    this.isSearchNull = true; //查询分类是否为空
    const pathname = this.props.location.pathname;
    if (pathname === '/bussiness/add') {
      this.props.dispatch({
        type: `${this.api_name}/updateState`,
        payload: {
          currentItem: {},
          modalType: 'create',
          fileList: [],
        },
      })
      this.todoType = 'create';
    } else {
      const id = this.props.params;
      this.props.dispatch({
        type: `${this.api_name}/getDetail`,
        payload: {
          ...id,
        },
      })
      this.todoType = 'update';
    }
    this.editorProps = {
      placeholder: 'Hello World!',
      contentFormat: 'html',
      height: 350,
      initialContent: '',
      onChange: this.handleChange,
      onHTMLChange: this.handleHTMLChange,
      media: {
        image: true, // 开启图片插入功能
        video: true, // 开启视频插入功能
        audio: true, // 开启音频插入功能
        uploadFn: this.uploadFn
      },
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.businessRecommend.currentItem && this.props.businessRecommend) {
      if (nextProps.businessRecommend.currentItem.id && this.props.businessRecommend.currentItem.id) {
        //
        if (nextProps.businessRecommend.currentItem.id !== this.props.businessRecommend.currentItem.id) {
          // id发生了变化,
          this.editorInstance.setContent(nextProps.businessRecommend.currentItem.url ? nextProps.businessRecommend.currentItem.url : '', 'html');
        } else {
          //id未发生变化
          if (nextProps.businessRecommend.currentItem.url) {
            console.timeEnd(nextProps.businessRecommend.currentItem.url)
            this.editorInstance.setContent(this.state.content ? this.state.content : nextProps.businessRecommend.currentItem.url, 'html')
          }
        }
      }
    }
  }
  //确定保存或新增
  handClick = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...this.props.form.getFieldsValue(),
        url: this.state.content,
      }
      const fileList = this.props.businessRecommend.fileList;
      const imgArray = fileList.map(file => {
        return file.response.url;
      })
      if (imgArray.length == 0) {
        imgArray.push('/static/1523607566754.png');
      }
      data.img = imgArray.toString();
      this.props.dispatch({
        type: `${this.api_name}/${this.props.businessRecommend.modalType}`,
        payload: {
          ...data
        }
      });
    })
  }

  handCancle = () => {
    this.props.dispatch({
      type: `${this.api_name}/query`,
      payload: {
        back: true
      }
    });
  }
  handleReset = () => {
    const fields = this.props.form.getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    this.props.form.setFieldsValue(fields)
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handleChangeImg = ({ file, fileList }) => {
    if (file.status === 'removed') {
      const fileList = this.props.businessRecommend.fileList.filter(item => item.status !== 'removed');
      this.updateFile(fileList);
    }
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.response.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  updateFile = (fileList) => {
    this.props.dispatch({
      type: `businessRecommend/updateState`,
      payload: {
        fileList: fileList
      }
    })
  }

  handleHTMLChange = (content) => {

   /* var i=window.location.href.indexOf('#');
    var data=window.location.href.substring(0,i-1);*/
    this.setState({ content: content.replace('http://localhost:8000', '') });
  }

  uploadFn = (param) => {
    const serverURL = '/admin/api/upload'
    const xhr = new XMLHttpRequest
    const fd = new FormData()
    // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容
    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url: JSON.parse(xhr.responseText).url,
      })

    }
    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }
    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.'
      })
    }

    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.send(fd)
  }
  //阻止上传展示裁剪图片modal
  beforeUpload = (file, files) => {
    Func.readBlobAsDataURL(file, dataurl => {
      this.showCropImg(dataurl, file, file.name);
    });
    return false;
  }
  //展示裁剪图片
  showCropImg = (data, file, name) => {
    const fileList = this.props.businessRecommend.fileList.concat([file]);
    this.props.dispatch({
      type: `${this.api_name}/updateState`,
      payload: {
        editorImg: data,
        cropModalVisible: true,
        fileName: name,
        fileList,
        oldFile:file,
      }
    })
  }
  render() {
    const { currentItem = {}, fileList } = this.props.businessRecommend;
    const { getFieldDecorator } = this.props.form;

    const loading_create = this.props.loading.effects['bussiness/create'];
    const loading_update = this.props.loading.effects['bussiness/update'];
    const { previewVisible, previewImage } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    //裁剪图片组件所需参数
    const doneFile = fileList.filter(item => item.status === 'done')
    const cropImgProps = {
      cropSize: 1 / 1, //裁剪比例
      editorImg: this.props.businessRecommend.editorImg,
      visible: this.props.businessRecommend.cropModalVisible,
      maskClosable: false,
      confirmLoading: this.props.loading.effects[`businessRecommend/uploadCropImg`],
      title: '图片裁剪-比例(1:1)',
      BtnOk: (data) => {
        this.props.dispatch({ type: `${this.api_name}/uploadCropImg`, payload: data, })
      },
      onCancel: () => {
        this.props.dispatch({
          type: `${this.api_name}/updateState`,
          payload: {
            cropModalVisible: false, //隐藏裁剪框
            fileList: fileList.filter(item => { return item.status }),
          }
        })
      },
    }
    return (
      <div>
        <Form className="detail_form marginTop10" layout="horizontal">
          <Row gutter={24}>
            {currentItem.id?
            <Col span={12}>
              <FormItem label="推荐业务编号" hasFeedback {...formItemLayout}>
                {<Input disabled={true} placeholder={currentItem.id ? currentItem.id : '自动生成'}/>}
              </FormItem>
            </Col>:''
            }
            <Col span={12}>
              <FormItem label="名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: currentItem.name,
                  rules: [
                    formRules.require, formRules.whitespace,
                  ],
                })(<Input placeholder="推荐业务名称"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
          <Col span={12}>
            <FormItem label="图片" hasFeedback {...formItemLayout}>
              <div className="clearfix">
                <Upload
                  action="/admin/api/upload"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChangeImg}
                  beforeUpload = {this.beforeUpload}
                >
                  {fileList.length==0?uploadButton:''}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
              </div>
            </FormItem>
          </Col>
          </Row>
          <Row gutter={24}>
            <BraftEditor ref={instance => this.editorInstance = instance} {...this.editorProps}/>
          </Row>
          <Row>
            <Col className="marginTop10" span={12}>
              {this.todoType === 'update' ?
                <Button loading={loading_update} type='primary' icon="edit" onClick={this.handClick}>保存</Button> :
                <Button loading={loading_create} type='primary' icon="plus" onClick={this.handClick}>新增</Button>}
              <Button icon="left" onClick={this.handCancle}>取消</Button>
            </Col>
          </Row>

        </Form>
        {cropImgProps.visible?<CropImg {...cropImgProps}/>:''}
      </div>
    );
  }
};

BusinessDetail.propTypes = {
  businessRecommend: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
}
export default connect(({ businessRecommend, loading }) => ({ businessRecommend, loading }))(Form.create()(BusinessDetail))
