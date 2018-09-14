import React from 'react';
import PropTypes from 'prop-types'
import {Form, Input, Modal, Select,Icon,Upload,message} from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
class PageModal extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
  }
  constructor(props) {
    super(props);
  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...this.props.form.getFieldsValue(),
      }
      const fileList = this.props.fileList;
      const imgArray = fileList.map(file=>{
        return file.response.url;
      })
      if(imgArray.length==0){
        message.info('请上传一张图片');
        return;
      }
      data.img = imgArray.toString();
      this.props.BtnOk(data)
    })
  }
  handleCancel = () => this.setState({previewVisible: false})
  handleChange = ({file,fileList}) => {
    const stateFiles = this.props.fileList.filter(item=>item.response&&item.response.success);
    if(file.status==='removed') {
      this.props.updateFile(fileList);
    }else {
      this.props.updateFile(fileList);
      if (file.percent == 100) {
        if (file.response&&file.response.success) {
          message.success('上传成功');
        }
        if (file.response&&!file.response.success) {
          this.props.updateFile(stateFiles);
          message.error('上传失败');
        }
      }
    }
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url||file.response.url||file.thumbUrl,
      previewVisible: true,
    });
  }

  render() {
    const {formProps,modalType,isDetail,fileList,...modalProps} = this.props;

    const {getFieldDecorator} = this.props.form;
    const {previewVisible, previewImage} = this.state;
    const item = this.props.item;
    const currentUser=this.props.currentUser;


    const modalOpts = {
      onOk: this.handleOk,
      ...modalProps,
    }
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal" {...formProps}>
          <FormItem label="推荐业务编号" hasFeedback {...formItemLayout}>
            {<Input disabled={true} placeholder={modalType == 'create' ? '自动生成' : item.id}/>}

          </FormItem>
          <FormItem label="业务名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input placeholder="业务名称"/>)}
          </FormItem>
          <FormItem label="业务描述" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input placeholder="业务描述"/>)}
          </FormItem>
          <FormItem label="图片" hasFeedback {...formItemLayout}>
            <div className="clearfix">
              <Upload
                action="/admin/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                multiple={true}
              >
                {fileList.length==0?uploadButton:''}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{width: '100%'}} src={previewImage}/>
              </Modal>
            </div>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
;

PageModal.propTypes = {
  form: PropTypes.object,
  formProps: PropTypes.object,
  modalType: PropTypes.string,
}
export default Form.create()(PageModal)
