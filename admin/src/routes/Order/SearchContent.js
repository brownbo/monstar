import React from 'react';

import {Input, Button, Icon, Row, Col, Select, Form,InputNumber,message,DatePicker} from 'antd';
import PropTypes from 'prop-types'
import Func from "../../utils/publicFunc"
import styles from './app.css'
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
}
var urlEncode = function (param, key, encode) {
  if(param==null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};
const typeArray = ['礼品','代金券','商品'];
class SearchContent extends React.Component {
  state = {
    searchAll: false,
    type:2,
    url_opts:'',//查询参数
  }
  constructor(props) {
    super(props);
    this.isSearchNull = [];//查询是否为空
    this.isSearchNull_name = true;//查询是否为空
  }

  componentDidMount() {
    this.props.getAllDefault_data();
  }

  handleReset = (event) => {
    const fields = this.props.form.getFieldsValue();
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = [];
        } else {
          fields[item] = undefined;
        }
      }
    }
    this.props.form.setFieldsValue(fields);
    this.props.SearchDateByQuery();
    event.preventDefault();
  }
  handClick = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...this.props.form.getFieldsValue(),
      }
      const type = this.state.type;

      data.order_goods_id&&(data.order_goods_id = data.order_goods_id.key);
      data.verify_id&&(data.verify_id = data.verify_id.key);

      if(type===0)data.gift_id = data.order_goods_id;
      if(type===1)data.voucher_id = data.order_goods_id;
      if(type===2)data.goods_id = data.order_goods_id;
      delete data['order_goods_id'];
      const tep =  data.verify_id?data.verify_id.split('-'):[];
      data[tep[0]] = tep[1];
      delete data['verify_id'];

      if(data.create_time)data.create_time = Func.getTimeStrByMomentArray(data.create_time);
      if(data.pay_time)data.pay_time = Func.getTimeStrByMomentArray(data.pay_time);
      if(data.verify_time)data.verify_time = Func.getTimeStrByMomentArray(data.verify_time);
      
      this.setState({url_opts:urlEncode(data)});
      this.props.SearchDateByQuery(data);
    })
  }
  searchBtnClock = ()=> {
    this.setState({searchAll: !this.state.searchAll});
  }
  search_model_func_goods = (value)=>{
    this.isSearchNull_name = value=='';
    const type = this.state.type;
    if(type===0){//礼品
      this.props.getSearch_dataFunc('gift',{name:value});
    }else if(type===1){//代金券
      this.props.getSearch_dataFunc('voucher',{name:value});
    }else{//商品
      this.props.getSearch_dataFunc('goods',{name:value});
    }
  }
  search_model_func_verify = (value)=>{
    this.isSearchNull =!value;
    this.props.getSearch_dataFunc('staff',{name:value});
    this.props.getSearch_dataFunc('merchant',{name:value});
  }
  selectOnChange = (value)=>{
    this.setState({type:parseInt(value)});
    this.props.form.resetFields(['order_goods_id']);
  }


  render() {
    const {getFieldDecorator} = this.props.form;
    const {searchAll,type,url_opts} = this.state;
    const {default_data, search_data,default_data_verify,search_data_verify} = this.props;
    let options;
    if(type===0)options = Func.getSelectOptions(search_data[0],default_data[0],this.isSearchNull_name)
    if(type===1)options = Func.getSelectOptions(search_data[1],default_data[1],this.isSearchNull_name)
    if(type===2)options = Func.getSelectOptions(search_data[2],default_data[2],this.isSearchNull_name)

    const options_verify = Func.getSelectOptionsByVerify([{
      type:'verify_staff_id',data:search_data_verify[0],
    },{
      type:'verify_merchant_id',data:search_data_verify[1],
    }],[{
      type:'verify_staff_id',data:default_data_verify[0],
    },{
      type:'verify_merchant_id',data:default_data_verify[1],
    }],this.isSearchNull)
    const url = '/admin/api/ordersToExcel?'+url_opts;
    return (
      <div className="marginTop10">
        {searchAll ?
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="订单号" hasFeedback {...formItemLayout}>
                {getFieldDecorator('order_no', {})(<Input placeholder='订单号'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="联系电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('phone', {})(<InputNumber className="allwidth" placeholder='联系电话'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="客户姓名" hasFeedback {...formItemLayout}>
                {getFieldDecorator('customer_name', {})(<Input placeholder='客户姓名'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="订单类型 " hasFeedback {...formItemLayout}>
                {getFieldDecorator('type', {})(<Select className="allwidth" onChange={this.selectOnChange}>
                  <Option key="0" value={'0'}>礼品</Option>
                  <Option key="1" value={'1'}>代金券</Option>
                  <Option key="2" value={'2'}>商品</Option>
                </Select>)}
              </FormItem>
            </Col>

            <Col sm={24} md={8}>
              <FormItem label={typeArray[type]+"名称 "} hasFeedback {...formItemLayout}>
                {getFieldDecorator('order_goods_id', {
                })(<Select
                  className="allwidth"
                  onSearch={this.search_model_func_goods}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  {options}
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="支付方式" hasFeedback {...formItemLayout}>
                {getFieldDecorator('pay_type', {})(<Select className="allwidth">
                  <Option key="0" value={'0'}>积分</Option>
                  <Option key="1" value={'1'}>支付</Option>
                  <Option key="2" value={'2'}>支付+积分</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="订单状态" hasFeedback {...formItemLayout}>
                {getFieldDecorator('status', {})(<Select className="allwidth">
                  <Option key="0" value={'0'}>待支付</Option>
                  <Option key="1" value={'1'}>支付中</Option>
                  <Option key="2" value={'2'}>支付完成</Option>
                  <Option key="3" value={'3'}>已核销</Option>
                  {/* <Option key="sumStatus1" value={'sumStatus1'}>待结算</Option>
                  <Option key="sumStatus3" value={'sumStatus3'}>已结算</Option> */}
                  <Option key="-1" value={'-1'}>申请退货</Option>
                  <Option key="-4" value={'-4'}>退货中</Option>
                  <Option key="-2" value={'-2'}>退货失败</Option>
                  <Option key="-3" value={'-3'}>退货成功</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="订单生成时间" hasFeedback {...formItemLayout}>
                {getFieldDecorator('create_time', {})(<RangePicker
                  className="allwidth"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="订单支付时间" hasFeedback {...formItemLayout}>
                {getFieldDecorator('pay_time', {})(<RangePicker
                  className="allwidth"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}> 
              <FormItem label="订单核销时间" hasFeedback {...formItemLayout}>
                {getFieldDecorator('verify_time', {})(<RangePicker
                  className="allwidth"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="核销人姓名" hasFeedback {...formItemLayout}>
                {getFieldDecorator('verify_id', {
                })(<Select
                  className="allwidth"
                  onSearch={this.search_model_func_verify}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  {options_verify}
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <span className="fr">
                <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
                <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
                <a type="primary"className={styles.marginRight} href={url}><Icon type="arrow-down"/> 导出</a>
                <a className="s-btn-clock" onClick={this.searchBtnClock}>
                  {this.state.searchAll ? '收起' : '展开'}
                  {this.state.searchAll ? <Icon type="up"/> : <Icon type="down"/>}
                </a >
              </span>
            </Col>
          </Row> :
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="订单号" hasFeedback {...formItemLayout}>
                {getFieldDecorator('order_no', {})(<Input placeholder='订单号'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="联系电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('phone', {})(<InputNumber className="allwidth"  placeholder='联系电话'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <span className="fr">
                <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
                <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
                <a type="primary"className={styles.marginRight} href={url}><Icon type="arrow-down"/> 导出</a>
                <a className="s-btn-clock" onClick={this.searchBtnClock}>
                  {this.state.searchAll ? '收起' : '展开'}
                  {this.state.searchAll ? <Icon type="up"/> : <Icon type="down"/>}
                </a>
              </span>
            </Col>
          </Row>
        }
      </div>
    )
  }
}
SearchContent.propTypes = {
  form:PropTypes.object,
  SearchDateByQuery:PropTypes.func,
  getGiftTypeDefalut_data:PropTypes.func,
  getGiftTypeSearch_data:PropTypes.func,
  default_data:PropTypes.array,
  search_data:PropTypes.array,
};
export default Form.create()(SearchContent)
