import React from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon, Radio, Upload, message, InputNumber, Select, Slider } from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
//裁剪图片
import CropImg from '../../components/CropImg'

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
} 
const Option = Select.Option;

class PageModal extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',

    type: undefined, //类型
  }
  constructor(props) {
    super(props);
    this.isSearchNull = true;
  }
  componentDidMount() {
    this.props.getDefault_data();
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
      data.url = data.url.key;
      data[['gift_id', 'goods_id', 'voucher_id', 'shop_id', 'business_recommend_id'][data.type]] = data.url;
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
  search_model_func = (value) => {
    this.isSearchNull = value === '';
    const type = this.props.form.getFieldValue('type');
    
    const typeText = ['gift', 'goods', 'voucher', 'shop', 'businessRecommend'];
    this.props.getSearch_data(typeText[type], value)
  }
  //阻止上传展示裁剪图片modal
  beforeUpload = (file, files) => {
    Func.readBlobAsDataURL(file, dataurl => {
      this.props.showCropImg(dataurl, file, file.name);
    });
    return false;
  }

  render() {
    const { formProps, modalType, search_data, default_data, fileList, cropImgProps, ...modalProps } = this.props;
    const { previewVisible, previewImage, type } = this.state;
    const { getFieldDecorator } = this.props.form;
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
    const currentBuisObj = [currentItem.gift, currentItem.goods, currentItem.voucher, currentItem.shop, currentItem.business_recommend][currentItem.type ? currentItem.type : 0]
    const options =(modalType==='create'&&type === undefined)?[]: Func.getSelectOptions(search_data[type === undefined ? currentItem.type : type], default_data[type === undefined ? currentItem.type : type], this.isSearchNull, parseInt(type)===currentItem.type?currentBuisObj:undefined, parseInt(type)===currentItem.type?currentItem.url:undefined);
    return (
      <div>
        <Modal {...modalOpts}>
          <Form layout="horizontal" {...formProps}>
            <FormItem label="Banner名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: currentItem.name,
                rules: [
                  formRules.require,formRules.whitespace,
                ],
              })(<Input  placeholder="Banner名称"/>)}
            </FormItem>
            <FormItem label="状态" hasFeedback {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: (currentItem.status!=null||currentItem.status!=undefined)?currentItem.status:1,
                rules: [
                  formRules.require,
                ],
              })(<Radio.Group>
                <Radio key={0} value={0}>停用</Radio>
                <Radio key={1} value={1}>启用</Radio>
              </Radio.Group>)}
            </FormItem>
            <FormItem label="类型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('type', {
                initialValue: currentItem.type!==undefined?currentItem.type.toString():'',
                rules: [
                  formRules.require,
                ],
              })(
                <Select onChange = {(value)=>{
                  this.props.form.resetFields(['url']);
                  this.setState({type:value});
                }}>
                  <Option value="0">礼品</Option>
                  <Option value="1">商品</Option>
                  <Option value="2">代金券</Option>
                  <Option value="3">商户</Option>
                  <Option value="4">推荐业务</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="推荐业务" hasFeedback {...formItemLayout}>
              {getFieldDecorator('url', (type===undefined||parseInt(type)===currentItem.type)&&currentBuisObj?{
                initialValue:{key:currentItem.url.toString(),label:currentBuisObj.name.toString()},
                rules: [
                  formRules.require,
                ],
              }:{
                initialValue:{key:'',label:''},
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