import React from 'react';
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
const { goBack, push } = routerRedux;
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, Button, Upload, Modal, Select, Radio, DatePicker, Row, Col, Icon, message, InputNumber, Alert, Checkbox, } from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
//裁剪图片
import CropImg from '../../components/CropImg'

import styles from './app.css'
const Option = Select.Option;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
//活动日生成
const weeks = [
  { label: '星期一', value: '1' },
  { label: '星期二', value: '2' },
  { label: '星期三', value: '3' },
  { label: '星期四', value: '4' },
  { label: '星期五', value: '5' },
  { label: '星期六', value: '6' },
  { label: '星期日', value: '0' },
];
const months = Array.from({ length: 12 }).map((item, index) => {
  return { label: `${index+1}月`, value: (index + 1).toString() };
});
const days = Array.from({ length: 31 }).map((item, index) => {
  return { label: `${index+1}号`, value: (index + 1).toString() };
});

class GiftDetail extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    is_active: undefined, //记录是否是活动决定是否选择活动时间
    pay_type: undefined,

    pay_type_ac: undefined,
    time_type: undefined, //活动周期类型 012

    //checkbox
    checkedList: undefined,
    indeterminate: true,
    checkAll: false,

  }

  constructor(props) {
    super(props);
    this.api_name = 'gift';
    this.isSearchNull = true; //查询分类是否为空
    const pathname = this.props.location.pathname;
    if (pathname === '/gift/add') {
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

  }
  componentDidMount() {
    this.props.dispatch({
      type: 'gift_type/getDefault_data',
    })
  }
  handClick = () => {
    const { currentItem } = this.props.gift;
    let { checkedList } = this.state;
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...this.props.form.getFieldsValue(),
      }
      const fileList = this.props.gift.fileList;
      const imgArray = fileList.map(file => {
        return file.response.url;
      })
      if (imgArray.length == 0) {
        message.info('请至少上传一张图片');
        return;
      }
      //没有修改活动周期
      if (data.is_active && !checkedList) checkedList = currentItem.activity ? currentItem.activity.active_days.split(',') : [];

      let activeObj = {};
      if (data.is_active) {
        if (data.start_at < data.end_at) {
          activeObj = { //活动对象
            start_at: data.start_at.format('YYYY-MM-DD HH:mm:ss'),
            end_at: data.end_at.format('YYYY-MM-DD HH:mm:ss'),
            time_type: data.time_type,
            pay_type: data.pay_type_ac,
            active_days: checkedList.toString(),
            settle_price: data.settle_price_ac * 100,
            exch_points: data.exch_points_ac,
          }
          if (data.pay_type_ac === 0) {
            activeObj.price = 0;
          } else if (data.pay_type_ac === 1) {
            activeObj.exch_points = 0;
            activeObj.price = data.price_ac * 100;
          } else {
            activeObj.price = data.price_ac * 100;
          }
        } else {
          message.info('活动开始时间不能大于活动结束时间');
          return;
        }
        //活动数量判断
        if (activeObj._count > data.sum_count) {
          message.info('活动数量需小于或等于总数量');
          return;
        }
        if (!checkedList.length) {
          message.info('请选择活动周期');
          return;
        }
      }
      if (currentItem.activity) { //编辑之前有活动的 传入active id
        data.activity_id = currentItem.activity.id;
      }
      if (data.pay_type === 0) {
        data.price = 0;
      } else if (data.pay_type === 1) {
        data.exch_points = 0;
        data.price *= 100;
      } else {
        data.price *= 100;
      }
      data.imgs = imgArray.toString();

      if (data.is_active) activeObj.enabled = 1; //是否活动需要更改activity表enabled
      data.gift_type_id && (data.gift_type_id = data.gift_type_id.key);
      data = {
        gift: data,
        activity: data.is_active ? activeObj : (this.props.gift.modalType === 'create' ? {} : { enabled: 0 })
      }
      this.props.dispatch({
        type: `${this.api_name}/${this.props.gift.modalType}`,
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
  handleChange = ({file}) => {
    if (file.status === 'removed') {
      const fileList = this.props.gift.fileList.filter(item => item.status !== 'removed');
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
    this.isSearchNull = value == ''
    this.props.dispatch({
      type: `gift_type/getSearch_data`,
      payload: {
        query: { name: value }
      }
    })
  }
  updateFile = (fileList) => {
    this.props.dispatch({
      type: `gift/updateState`,
      payload: {
        fileList: fileList
      }
    })
  }
  //阻止上传展示裁剪图片modal
  beforeUpload = (file, files) => {
    Func.readBlobAsDataURL(file, dataurl => {
      this.showCropImg(dataurl,file, file.name);
    });
    return false;
  }
  //展示裁剪图片
  showCropImg = (data,file, name) => {
    const fileList = this.props.gift.fileList.concat([file]);
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
  onChange = (checkedList) => {
    //活动日
    let { time_type } = this.state;
    const { currentItem = {} } = this.props.gift;
    const activity = currentItem.activity ? currentItem.activity : {};
    if (time_type === undefined) { //state默认值为currentItem的值
      time_type = activity.time_type;
    }
    const plainOptions = time_type ? (time_type === 1 ? weeks : months) : days
    this.setState({
      checkedList: checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }
  onCheckAllChange = (e) => {
    //活动日
    let { time_type } = this.state;
    const { currentItem = {} } = this.props.gift;
    const activity = currentItem.activity ? currentItem.activity : {};
    if (time_type === undefined) { //state默认值为currentItem的值
      time_type = activity.time_type;
    }
    const plainOptions = time_type ? (time_type === 1 ? weeks : months) : days
    this.setState({
      checkedList: e.target.checked ? plainOptions.map(item => item.value) : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  activeChange = (e) => {
    const thisValue = e.target.value;
    //活动日
    const { currentItem = {} } = this.props.gift;
    const activity = currentItem.activity ? currentItem.activity : {};
    const plainOptions = thisValue ? (thisValue === 1 ? weeks : months) : days;
    const defaultCheckedList = thisValue === activity.time_type ? activity.active_days.split(',') : []
    this.setState({
      time_type: thisValue,
      checkedList: defaultCheckedList,
      indeterminate: defaultCheckedList.length && defaultCheckedList.length < plainOptions.length,
      checkAll: defaultCheckedList.length === plainOptions.length,
    })
  }
  render() {
    const { currentItem = {}, fileList } = this.props.gift;
    const activity = currentItem.activity ? currentItem.activity : {};
    const { default_data, search_data } = this.props.gift_type;
    const { getFieldDecorator } = this.props.form;
    let { is_active, time_type, pay_type, pay_type_ac, previewVisible, previewImage, checkedList } = this.state;
    if (is_active === undefined) { //state默认值为currentItem的值
      is_active = currentItem.is_active;
    }
    if (pay_type === undefined) { //state默认值为currentItem的值
      pay_type = currentItem.pay_type;
    }
    if (pay_type_ac === undefined) { //state默认值为currentItem的值
      pay_type_ac = activity.pay_type;
    }
    if (time_type === undefined) { //state默认值为currentItem的值
      time_type = activity.time_type;
    }
    if (checkedList === undefined) { //state默认值为currentItem的值
      checkedList = activity.active_days ? activity.active_days.split(',') : [];
    }
    //活动日
    const active_opts = time_type ? (time_type === 1 ? weeks : months) : days

    const options = Func.getSelectOptions(search_data, default_data, this.isSearchNull, currentItem.gift_type, currentItem.gift_type_id);
    const loading_create = this.props.loading.effects['gift/create'];
    const loading_update = this.props.loading.effects['gift/update'];
    //TZ时间moment转换有问题，先new Date.
    activity.start_at = activity.start_at ? new Date(activity.start_at) : '';
    activity.end_at = activity.start_at ? new Date(activity.end_at) : '';
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    //裁剪图片组件所需参数
    const cropImgProps = {
      cropSize: 1/1, //裁剪比例
      editorImg: this.props.gift.editorImg,
      visible: this.props.gift.cropModalVisible,
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
              <FormItem label="礼品名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: currentItem.name,
                  rules: [
                    formRules.require,formRules.whitespace,
                  ],
                })(<Input placeholder="礼品名称"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="礼品分类" hasFeedback {...formItemLayout}>
                {getFieldDecorator('gift_type_id', currentItem.gift_type_id?{
                  initialValue:{key:currentItem.gift_type_id.toString(),label:currentItem.gift_type.name.toString()},
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
            </Col>
            <Col span={12}>
              <FormItem label="品牌" hasFeedback {...formItemLayout}>
                {getFieldDecorator('brand', {
                  initialValue: currentItem.brand,
                  rules: [
                    formRules.require,formRules.whitespace,
                  ],
                })(<Input placeholder="品牌"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="是否热门" hasFeedback {...formItemLayout}>
                {getFieldDecorator('is_hot', {
                  initialValue: (currentItem.is_hot!==null||currentItem.is_hot!==undefined) ? currentItem.is_hot : 1,
                  rules: [
                    formRules.require,
                  ],
                })(<Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="支付方式" hasFeedback {...formItemLayout}>
                {getFieldDecorator('pay_type', {
                  initialValue: currentItem.pay_type ? currentItem.pay_type : 0,
                  rules: [
                    formRules.require,
                  ],
                })(<Radio.Group onChange={(e)=>{
                  this.setState({pay_type:e.target.value})
                  this.props.form.resetFields(['exch_points','price']);
                }}>
                  <Radio value={0}>积分</Radio>
                  <Radio value={1}>支付</Radio>
                  <Radio value={2}>支付+积分</Radio>
                </Radio.Group>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="兑换积分" hasFeedback {...formItemLayout}>
                {getFieldDecorator('exch_points', {
                  initialValue: currentItem.exch_points,
                  rules: [
                    {
                      required: (pay_type===0||pay_type===2||pay_type===undefined)?true:false,
                      message:formRules.require.message
                    },
                  ],
                })(<InputNumber
                  disabled={(pay_type===0||pay_type===2||pay_type===undefined)?false:true}
                  min={0}  className="allwidth" placeholder="兑换积分"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="金额支付" hasFeedback {...formItemLayout}>
                {getFieldDecorator('price', {
                  initialValue: Func.price(currentItem.price),
                  rules: [
                    {
                      required: (pay_type===1||pay_type===2)?true:false,
                      message:formRules.require.message
                    }
                  ],
                })(<InputNumber
                  disabled={(pay_type===1||pay_type===2)?false:true}
                  min={0} className="allwidth" placeholder="金额支付"/>)}
              </FormItem>
            </Col>
            {/* <Col span={12}>
              <FormItem label="已购买人数" hasFeedback {...formItemLayout}>
                {currentItem.paid_users?currentItem.paid_users:0}
              </FormItem>
            </Col> */}

            <Col span={12}>
              <FormItem label="描述" hasFeedback {...formItemLayout}>
                {getFieldDecorator('desc', {
                  initialValue: currentItem.desc,
                  rules: [
                    formRules.require,formRules.whitespace,
                  ],
                })(<Input autosize={{minRows: 6, maxRows: 10}} type='textarea' placeholder="描述"/>)}
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
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="启用状态" hasFeedback {...formItemLayout}>
                {getFieldDecorator('enabled', {
                  initialValue: currentItem.enabled!==null ? currentItem.enabled : 1,
                  rules: [
                    formRules.require,
                  ],
                })(<Radio.Group>
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>禁用</Radio>
                </Radio.Group>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="是否活动" hasFeedback {...formItemLayout}>
                {getFieldDecorator('is_active', {
                  initialValue: currentItem.is_active ? currentItem.is_active : 0,
                  rules: [
                    formRules.require,
                  ],
                })(<Radio.Group onChange={e=> {
                  this.setState({is_active: e.target.value})
                }}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>)}
              </FormItem>
            </Col>
          </Row>
          {/*活动*/}
          {is_active?
            <Row>
              <Col span={12}>
                <FormItem label="活动支付方式" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('pay_type_ac', {
                    initialValue: activity.pay_type ? activity.pay_type : 0,
                    rules: [
                      formRules.require,
                    ],
                  })(<Radio.Group onChange={(e)=>{
                    this.setState({pay_type_ac:e.target.value})
                    this.props.form.resetFields(['exch_points_ac','price_ac']);
                  }}>
                    <Radio value={0}>积分</Radio>
                    <Radio value={1}>支付</Radio>
                    <Radio value={2}>支付+积分</Radio>
                  </Radio.Group>)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="活动金额支付（元）" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('price_ac', {
                    initialValue: Func.price(activity.price),
                    rules: [
                      {
                        required: (pay_type_ac===1||pay_type_ac===2)?true:false,
                        message:'该项内容不能为空'
                      }
                    ],
                  })(<InputNumber
                    disabled={(pay_type_ac===1||pay_type_ac===2)?false:true}
                    min={0} className="allwidth" placeholder="金额支付"/>)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="活动兑换积分" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('exch_points_ac', {
                    initialValue: activity.exch_points,
                    rules: [
                      {
                        required: (pay_type_ac===0||pay_type_ac===2||pay_type_ac===undefined)?true:false,
                        message:'该项内容不能为空'
                      },
                    ],
                  })(<InputNumber
                    disabled={(pay_type_ac===0||pay_type_ac===2||pay_type_ac===undefined)?false:true}
                    min={0} className="allwidth" placeholder="兑换积分"/>)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="活动开始时间" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('start_at', {
                    initialValue: activity.start_at?moment(activity.start_at, 'YYYY-MM-DD HH:mm:ss'):'',
                    rules: [
                      formRules.require,
                    ],
                  })(<DatePicker
                    disabled={is_active ? false : true}
                    className="allwidth"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="选择活动开始时间"
                  />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="活动结束时间" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('end_at', {
                    initialValue: activity.end_at?moment(activity.end_at, 'YYYY-MM-DD HH:mm:ss'):'',
                    rules: [
                      formRules.require,
                    ],
                  })(<DatePicker
                    disabled={is_active ? false : true}
                    className="allwidth"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="选择活动结束时间"
                  />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="活动周期类型" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('time_type', {
                    initialValue: activity.time_type ? activity.time_type : 0,
                    rules: [
                      formRules.require,
                    ],
                  })(<Radio.Group onChange={this.activeChange}>
                    <Radio value={0}>日</Radio>
                    <Radio value={1}>周</Radio>
                    <Radio value={2}>月</Radio>
                  </Radio.Group>)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="活动周期" hasFeedback {...formItemLayout}>
                  <div>
                    <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                      <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                      >
                        全选
                      </Checkbox>
                    </div>
                    <CheckboxGroup options={active_opts} value={checkedList} onChange={this.onChange} />
                  </div>
                </FormItem>
              </Col>
            </Row>:''}
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

GiftDetail.propTypes = {
  gift: PropTypes.object,
  gift_type: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
}
export default connect(({ gift, gift_type, loading }) => ({ gift, gift_type, loading }))(Form.create()(GiftDetail))
