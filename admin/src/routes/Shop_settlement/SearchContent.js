/**
 * Created by 郑银华 on 2017/10/30.
 */

import React from 'react';
import {Input, Button, Icon, Row, Col, Form, Select, DatePicker} from 'antd';
import PropTypes from 'prop-types'
import Func from "../../utils/publicFunc"
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
}
class SearchContent extends React.Component {
  state = {
    shop_id:'',
    shop_name:'',
    time:'',
    verify_vouchers:'',
    verify_goods:''
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getDefaultDate();
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
    this.setState({verify_vouchers:''})
    this.setState({verify_goods:''})
    this.props.form.setFieldsValue(fields);
    this.props.SearchDateByQuery({first:true,rest:true});
    this.props.handleRese();
    event.preventDefault();
  }
  search_model_func = (value)=> {

    this.props.getSearch_dataFunc('shop', value);
  }
  handClick = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...this.props.form.getFieldsValue(),
      }
    
      data.created_at = data.created_at ? (new Date('2017-10-01 00:00:00').getTime() + ',' +new Date(data.created_at).getTime()) : undefined;
      data.shop_name=this.state.shop_name;
      data.verify_goods=this.state.verify_goods,
      data.verify_vouchers=this.state.verify_vouchers,
      data.first=false;
      data.shop_id&&(data.shop_id = data.shop_id.key);
      data.type&&(data.type ='');
      this.props.SearchDateByQuery(data);
      this.props.getType(this.state.verify_goods?this.state.verify_goods:this.state.verify_vouchers);
      this.props.cleanSelectedKeys();
    })
  }
  /*  getTime=(data,dateString)=>{
    
    this.props.getTime(data,dateString);
  }  */
  onChange=(value)=>{
    this.setState({shop_id:value.key})
    this.setState({shop_name:value.label})
  }
  changeType=(value)=>{
    if(value.key==1){
      this.setState({verify_vouchers:value.key})
      this.setState({verify_goods:''})
    }else{
      this.setState({verify_vouchers:''})
      this.setState({verify_goods:value.key})
    }
  }

  render() {
    const {default_data, search_data,data} = this.props;
    const {getFieldDecorator} = this.props.form;
    const options = Func.getSelectOptions(search_data, default_data, true);
    return (
      <div className="marginTop10">
        <Row gutter={8}>
          <Col sm={24} md={6}>
            <FormItem label="商户" hasFeedback {...formItemLayout}>
              {getFieldDecorator('shop_id', {})(
                <Select
                  className="allwidth"
                  onSearch={this.search_model_func}
                  onChange={this.onChange}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={6}>
            <FormItem label="选择时间" hasFeedback {...formItemLayout}>
            {getFieldDecorator('created_at', {})(<DatePicker
                  className="allwidth"
                  showTime
                  onChange={this.getTime}
                  format="YYYY-MM-DD HH:mm:ss"
                />)}
            </FormItem>
          </Col>
          <Col sm={24} md={6} >
          <FormItem label="选择类型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('type', {})(
                <Select
                  className="allwidth"
                  onChange={this.changeType}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  <Option value="0">商品</Option>
                  <Option value="1">代金券</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={6} >
            <span className="fr">
              <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
              <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </div>)
  }
}
;

SearchContent.propTypes = {
  SearchDateByQuery: PropTypes.func,
};

export default Form.create()(SearchContent);
