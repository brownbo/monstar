import React from 'react';
import { connect } from 'dva'

import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, Button, Upload, Modal, Select, Radio, DatePicker, Row, Col, Icon, message, Alert } from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
//裁剪图片
import CropImg from '../../components/CropImg'

import styles from './app.css'
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
class ShopDetail extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
  }

  constructor(props) {
    super(props);
    this.api_name = 'shop';
    this.isSearchNull = true; //查询分类是否为空
    this.todoType = 'update';
  }
  componentDidMount() {
    const id = this.props.params;
    this.props.dispatch({
      type: `${this.api_name}/getDetail`,
      payload: {
        ...id,
      },
    })
    this.props.dispatch({ type: 'shop_type/getDefault_data', })
    this.props.dispatch({ type: 'goods/getDefault_data', })
    this.props.dispatch({ type: 'voucher/getDefault_data', })
  }
  handClick = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...this.props.form.getFieldsValue(),
      }
      const fileList = this.props.shop.fileList;
      const imgArray = fileList.map(file => {
        return file.response.url;
      })
      if (imgArray.length == 0) {
        message.info('请至少上传一张图片');
        return;
      }
      const long_lat = data.geo_point.split(',');
      data.long = long_lat[0];
      data.lat = long_lat[1];
      delete data['geo_point']
      data.examine_status = 3;
      data.shop_img = imgArray.toString();
      //data.sign_time = data.sign_time.format('YYYY-MM-DD HH:mm:ss');

      data.shop_type_id && (data.shop_type_id = data.shop_type_id.key);
      data.recommend1_id && (data.recommend1_id = data.recommend1_id.key);
      data.recommend2_id && (data.recommend2_id = data.recommend2_id.key);

      this.props.dispatch({
        type: `${this.api_name}/${this.props.shop.modalType}`,
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
  handleChange = ({ file, fileList }) => {
    if (file.status === 'removed') {
      const fileList = this.props.shop.fileList.filter(item => item.status !== 'removed');
      this.updateFile(fileList);
    }
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  search_model_func = (value) => {
    this.isSearchNull = value == '';
    this.props.dispatch({
      type: `shop_type/getSearch_data`,
      payload: {
        query: { name: value }
      }
    })
  }
  search_model_func_recommend1 = (value) => {
    this.isSearchNull = value == '';
    this.props.dispatch({
      type: `goods/getSearch_data`,
      payload: {
        query: { name: value }
      }
    })
  }
  search_model_func_recommend2 = (value) => {
    this.isSearchNull = value == '';
    this.props.dispatch({
      type: `voucher/getSearch_data`,
      payload: {
        query: { name: value }
      }
    })
  }
  updateFile = (fileList) => {
    this.props.dispatch({
      type: `shop/updateState`,
      payload: {
        fileList: fileList
      }
    })
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
    const fileList = this.props.shop.fileList.concat([file]);
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
    const { currentItem = {}, fileList } = this.props.shop;
    const { default_data, search_data } = this.props.shop_type;
    const default_data_goods = this.props.goods.default_data;
    const default_data_voucher = this.props.voucher.default_data;
    const search_data_goods = this.props.goods.search_data;
    const search_data_voucher = this.props.voucher.search_data;
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage } = this.state;
    let options = [];
    options[0] = Func.getSelectOptions(search_data, default_data, this.isSearchNull, currentItem.shop_type, currentItem.shop_type_id);
    options[1] = Func.getSelectOptions(search_data_goods, default_data_goods, this.isSearchNull, currentItem.recommend1, currentItem.recommend1_id);
    options[2] = Func.getSelectOptions(search_data_voucher, default_data_voucher, this.isSearchNull, currentItem.recommend2, currentItem.recommend2_id);

    const loading_create = this.props.loading.effects['shop/create'];
    const loading_update = this.props.loading.effects['shop/update'];
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    //裁剪图片组件所需参数
    const cropImgProps = {
      cropSize: 1 / 1, //裁剪比例
      editorImg: this.props.shop.editorImg,
      visible: this.props.shop.cropModalVisible,
      maskClosable: false,
      confirmLoading: this.props.loading.effects[`${this.api_name}/uploadCropImg`],
      title: "图片裁剪-比例(1:1)",
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
            <Col span={12}>
              <FormItem label="商户名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: currentItem.name,
                  rules: [
                    formRules.require,formRules.whitespace,
                  ],
                })(<Input placeholder="商户名称"/>)}
              </FormItem>
            </Col>
            {/*<Col span={12}>
              <FormItem label="openid" hasFeedback {...formItemLayout}>
                {getFieldDecorator('open_id', {
                  initialValue: currentItem.open_id,
                  rules: [
                    formRules.require,formRules.whitespace,
                  ],
                })(<Input placeholder="openid"/>)}
              </FormItem>
            </Col>*/}
            <Col span={12}>
              <FormItem label="商户类型" hasFeedback {...formItemLayout}>
                {getFieldDecorator('shop_type_id', currentItem.shop_type_id?{
                  initialValue:{key:currentItem.shop_type_id.toString(),label:currentItem.shop_type.name.toString()},
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
                  {options[0]}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="注册时间" hasFeedback {...formItemLayout}>
                <Input disabled={true}
                       placeholder={Func.getDate_ymdhms(currentItem.created_at ? currentItem.created_at : new Date())}/>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="注册状态" hasFeedback {...formItemLayout}>
                {currentItem.sign_status?'已注册':'未注册'}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="联系人" hasFeedback {...formItemLayout}>
                {getFieldDecorator('connect_person', {
                  initialValue: currentItem.connect_person,
                  rules: [
                    formRules.require,formRules.whitespace,
                  ],
                })(<Input placeholder="联系人姓名"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="联系电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('connect_phone', {
                  initialValue: currentItem.connect_phone,
                  rules: [
                    formRules.require,
                    formRules.phoneNo,
                  ],
                })(<Input placeholder="联系电话"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="地址" hasFeedback {...formItemLayout}>
                {getFieldDecorator('address', {
                  initialValue: currentItem.address,
                  rules: [
                    formRules.require,formRules.whitespace,
                  ],
                })(<Input placeholder="地址"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="经纬度" hasFeedback {...formItemLayout}>
                {getFieldDecorator('geo_point', {
                  initialValue:currentItem.long? `${currentItem.long},${currentItem.lat}`:'',
                  rules: [
                    formRules.require,formRules.longlat,
                  ],
                })(<Input placeholder="经纬度(,)隔开"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="户名" hasFeedback {...formItemLayout}>
                {getFieldDecorator('account_name', {
                  initialValue: currentItem.account_name,
                  rules: [
                    formRules.require,formRules.whitespace,
                  ],
                })(<Input placeholder="户名"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="账号" hasFeedback {...formItemLayout}>
                {getFieldDecorator('username', {
                  initialValue: currentItem.username,
                  rules: [
                    formRules.require,formRules.whitespace,
                  ],
                })(<Input placeholder="账号"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="推荐商户" hasFeedback {...formItemLayout}>
                {getFieldDecorator('is_recommend', {
                  initialValue: currentItem.is_recommend ? currentItem.is_recommend : 0,
                  rules: [
                    formRules.require,
                  ],
                })(<Radio.Group>
                  <Radio value={1}>推荐</Radio>
                  <Radio value={0}>非推荐</Radio>
                </Radio.Group>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="推荐业务1" hasFeedback {...formItemLayout}>
                {getFieldDecorator('recommend1_id', currentItem.recommend1?{
                  initialValue:{key:currentItem.recommend1_id.toString(),label:currentItem.recommend1.name.toString()},
                  rules: [
                    formRules.require,
                  ],
                }:{
                  rules: [
                    formRules.require,
                  ],
                })(<Select
                  onSearch={this.search_model_func_recommend1}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  {options[1]}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="推荐业务2" hasFeedback {...formItemLayout}>
                {getFieldDecorator('recommend2_id', currentItem.recommend2?{
                  initialValue:{key:currentItem.recommend2_id.toString(),label:currentItem.recommend2.name.toString()},
                  rules: [
                    formRules.require,
                  ],
                }:{
                  rules: [
                    formRules.require,
                  ],
                })(<Select
                  onSearch={this.search_model_func_recommend2}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  {options[2]}
                </Select>)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="商户状态" hasFeedback {...formItemLayout}>
                {getFieldDecorator('status', {
                  initialValue: currentItem.status ? currentItem.status : 0,
                  rules: [
                    formRules.require,
                  ],
                })(<Radio.Group>
                  <Radio value={1}>已上架</Radio>
                  <Radio value={0}>待上架</Radio>
                </Radio.Group>)}
              </FormItem>
            </Col>

            <Col span={12}>
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
                    {uploadButton}
                  </Upload>
                  <Alert message="默认第一张为封面" type="warning" showIcon />
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                  </Modal>
                </div>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="描述" hasFeedback {...formItemLayout}>
                {getFieldDecorator('shop_desc', {
                  initialValue: currentItem.shop_desc,
                  rules: [
                    formRules.require,formRules.whitespace,
                  ],
                })(<Input autosize={{minRows: 6, maxRows: 10}} type='textarea' placeholder="描述"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
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

ShopDetail.propTypes = {
  shop: PropTypes.object,
  shop_type: PropTypes.object,
  goods: PropTypes.object,
  voucher: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
}
export default connect(({ shop, shop_type, goods, voucher, loading }) => ({ shop, goods, voucher, shop_type, loading }))(Form.create()(ShopDetail))