import React from 'react';
import PropTypes from 'prop-types'
import formRules from '../../utils/formRules'
import { Form, Input, Modal, Select, Upload, Icon, message, InputNumber, Radio } from 'antd'
//裁剪图片
import CropImg from '../../components/CropImg'
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
      const data = {
        ...this.props.form.getFieldsValue(),
      }
      this.props.BtnOk(data)
    })
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
      const imgArray = fileList.map(file => {
        return file.response.url;
      })
      if (imgArray.length == 0) {
        message.info('请上传一张图片');
        return;
      }
      data.img = imgArray.toString();
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
  //阻止上传展示裁剪图片modal
  beforeUpload = (file, files) => {
    Func.readBlobAsDataURL(file, dataurl => {
      this.props.showCropImg(dataurl, file, file.name);
    });
    return false;
  }
  render() {
    const { formProps, modalType, fileList, cropImgProps, ...modalProps } = this.props;
    const { previewVisible, previewImage, } = this.state;
    const { getFieldDecorator } = this.props.form;
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
      <div>
        <Modal {...modalOpts}>
          <Form layout="horizontal" {...formProps}>
            <FormItem label="分类名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: item.name,
                rules: [
                  formRules.require,formRules.whitespace,
                ],
              })(<Input  placeholder="分类名称"/>)}
            </FormItem>
            <FormItem label="库存预警数量" hasFeedback {...formItemLayout}>
              {getFieldDecorator('count_warning', {
                initialValue: item.count_warning,
                rules: [
                  formRules.require,
                ],
              })(<InputNumber min={0}  className="allwidth" placeholder="库存预警数量"/>)}
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
            <FormItem label="是否可用" hasFeedback {...formItemLayout}>
              {getFieldDecorator('enabled', {
                initialValue: item.enabled,
                rules: [
                  formRules.require,
                ],
              })(<Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
              </Radio.Group>)}
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