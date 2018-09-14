import React from 'react';
import PropTypes from 'prop-types'
import {Form, Input, Modal, Select,Icon,Upload,message} from 'antd'
import Func from "../../utils/publicFunc"
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
      if(fileList.length==0||fileList[0].status==='error'){
        message.error('请上传图片,或图片上传失败!');
        return;
      }
      if(fileList[0].response)data.img = fileList[0].response.url;
      this.props.BtnOk(data)
    })
  }
  handleCancel = () => this.setState({previewVisible: false})
  handleChange = ({file,fileList}) => {
    if(file.status==='removed') {
      this.props.updateFile(fileList);
    }else {
      this.props.updateFile(fileList);
      if (file.percent == 100) {
        if (file.response&&file.response.success) {
          message.success('上传成功');
        }
        if (file.response&&!file.response.success) {
          message.success('上传失败');
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
    const {formProps,modalType,fileList,...modalProps} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {previewVisible, previewImage} = this.state;
    const item = this.props.item;

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
          <FormItem label="员工编号" hasFeedback {...formItemLayout}>
            {<Input disabled={true} placeholder={modalType == 'create' ? '自动生成' : item.id}/>}

          </FormItem>
          <FormItem label="用户名" hasFeedback {...formItemLayout}>
            {getFieldDecorator('username', {
              initialValue: item.username,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input placeholder="输入用户名"/>)}
          </FormItem>
          <FormItem label="姓名" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input placeholder="输入姓名"/>)}
          </FormItem>
          <FormItem label="手机号" hasFeedback {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: item.phone,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input placeholder="输入手机号"/>)}
          </FormItem>
          <FormItem label="商铺编号" hasFeedback {...formItemLayout}>
            {getFieldDecorator('shop_code', {
              initialValue: item.shop_code,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input placeholder="输入商铺编号"/>)}
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
