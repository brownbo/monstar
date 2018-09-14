import React from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Icon, Upload, message } from 'antd'
import Func from "../../utils/publicFunc"
//裁剪图片
import CropImg from '../../components/CropImg'
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

    confirmDirty:'',
  }
  constructor(props) {
    super(props);
    this.props.getNetspotsDefault_data();
    this.props.getNetspotsSearch_data();
    this.isSearchNull = true; //查询礼品是否为空
  }

  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return;
      }
      let data = {
        ...this.props.form.getFieldsValue(),
      }
      const fileList = this.props.fileList;
      const imgArray = fileList.map(file => {
        return file.response.url;
      })
      if (imgArray.length == 0) {
        imgArray.push('/static/1523607566754.png');
      }
      data.img = imgArray.toString();
      data.netspot_id && (data.netspot_id = data.netspot_id.key);
      if(this.props.modalType==='create'){
        data.password = data.pwd1;
        delete data[pwd1];
        delete data[pwd2];
      }
      this.props.BtnOk(data)

    })
  }
  handleCancel = () => this.setState({ previewVisible: false })
  handleChange = ({ file }) => {
    if (file.status === 'removed') {
      const fileList = this.props.fileList.filter(item => item.status !== 'removed');
      this.props.updateFile(fileList);
    }
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.response.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  search_model_func = (value) => {
    this.isSearchNull = value == '';
    this.props.getNetspotsSearch_data(value);
  }
  //阻止上传展示裁剪图片modal
  beforeUpload = (file, files) => {
    Func.readBlobAsDataURL(file, dataurl => {
      this.props.showCropImg(dataurl,file, file.name);
    });
    return false;
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['pwd2'], { force: true });
    }
    callback();
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('pwd1')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  }
  
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  render() {
    const { formProps, modalType, fileList, haveDate, cropImgProps, ...modalProps } = this.props;
    const { getFieldDecorator } = this.props.form;
    const options = Func.getSelectOptions(this.props.search_data_netspot, this.props.default_data_netspot, this.isSearchNull);
    const { previewVisible, previewImage } = this.state;
    const currentItem = this.props.item;

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
      <div>
        <Modal {...modalOpts}>
          <Form layout="horizontal" {...formProps}>
            { currentItem.id?<FormItem label="员工编号" hasFeedback {...formItemLayout}>
              {<Input disabled={true} placeholder={modalType == 'create' ? '自动生成' : currentItem.id}/>}

            </FormItem>:''}
            <FormItem label="用户名" hasFeedback {...formItemLayout}>
              {getFieldDecorator('username', {
                initialValue: currentItem.username,
                rules: [
                  formRules.require,formRules.whitespace,
                ],
              })(<Input  placeholder="用户名"/>)}
            </FormItem>
            {modalType==='create'?
            <div>
              <FormItem label="密码" hasFeedback {...formItemLayout}>
                {getFieldDecorator('pwd1', {
                  rules: [
                    formRules.require,formRules.pwdLength6,formRules.whitespace,{
                      validator: this.validateToNextPassword,
                    }
                  ],
                })(<Input type="password"  placeholder="密码"/>)}
              </FormItem>
              <FormItem label="确认密码" hasFeedback {...formItemLayout}>
                {getFieldDecorator('pwd2', {
                  rules: [
                    formRules.require,formRules.pwdLength6,formRules.whitespace,{
                      validator: this.compareToFirstPassword,
                    }
                  ],
                })(<Input type="password"  onBlur={this.handleConfirmBlur} placeholder="确认密码"/>)}
              </FormItem></div>:''}
            <FormItem label="姓名" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: currentItem.name,
                rules: [
                  formRules.require,formRules.whitespace,
                ],
              })(<Input placeholder="姓名"/>)}
            </FormItem>
            <FormItem label="手机号" hasFeedback {...formItemLayout}>
              {getFieldDecorator('phone', {
                initialValue: currentItem.phone,
                rules: [
                  formRules.require, formRules.phoneNo,
                ],
              })(<Input disabled = {modalType == 'create'?false:true} placeholder="手机号"/>)}
            </FormItem>
            <FormItem label="网点" hasFeedback {...formItemLayout}>
              {getFieldDecorator('netspot_id', currentItem.netspot_id?{
                initialValue:{key:currentItem.netspot_id.toString(),label:currentItem.netspot.name.toString()},
                rules: [
                  formRules.require,
                ],
              }:{
                rules: [
                  formRules.require,
                ],
              })(<Select
                onSearch={this.search_model_func}
                showSearch
                labelInValue
                filterOption={false}>
                {options}
              </Select>)}
            </FormItem>
            <FormItem label="图片" hasFeedback {...formItemLayout}>
              <div className="clearfix">
                <Upload
                  action="/admin/api/upload"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                  beforeUpload = {this.beforeUpload}
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
        {cropImgProps.visible?<CropImg {...cropImgProps}/>:''}
      </div>
    );
  }
};

PageModal.propTypes = {
  form: PropTypes.object,
  formProps: PropTypes.object,
  modalType: PropTypes.string,
}
export default Form.create()(PageModal)
