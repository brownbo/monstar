import React from 'react';

import {Input, Button, Icon, Row, Col, Select, Form, DatePicker} from 'antd';
import PropTypes from 'prop-types'
import styles from './app.css'
import Func from '../../utils/publicFunc'
import {Modal} from 'antd';

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

class SearchContent extends React.Component {
  state = {
    searchAll: false,
  }

  constructor(props) {
    super(props);

    this.isSearchNull = true;//查询是否为空
  }
  componentDidMount(){
    this.props.getShopDefault_data();
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
      const data = {
        ...this.props.form.getFieldsValue(),
      }
      data.commit_time = data.commit_time ? new Date(data.commit_time.format('YYYY-MM-DD')).getTime() : undefined;
      if(data.price>0){
        data.price*=100
      }
      if(data.apply_price>0){
        data.apply_price*=100
      }
      data.shop_id&&(data.shop_id = data.shop_id.key);
      this.props.SearchDateByQuery(data);
    })
  }
  searchBtnClock = ()=> {
    this.setState({searchAll: !this.state.searchAll});
  }
  search_model_func = (value) => {
    this.isSearchNull = !value;
    this.props.getShopSearch_data(value);
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const {default_data, search_data,tab} = this.props;
    const options = Func.getSelectOptions(search_data,default_data,this.isSearchNull);
    return (
      <div className="marginTop10">
        {this.state.searchAll ?
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="商户名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('shop_id', {})(<Select
                  className="allwidth"
                  onSearch={this.search_model_func}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  {options}
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="商品名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {})(<Input placeholder='商品名称'/>)}
              </FormItem>
            </Col>

            <Col sm={24} md={8}>
              <FormItem label="联系电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('phone', {})(<Input placeholder='联系电话'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="商品价格" hasFeedback {...formItemLayout}>
                {getFieldDecorator('price', {})(<Input placeholder='商品价格(元)'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="商品数量" hasFeedback {...formItemLayout}>
                {getFieldDecorator('sum_count', {})(<Input placeholder='商品数量'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="发起时间 " hasFeedback {...formItemLayout}>
                {getFieldDecorator('commit_time', {})(<DatePicker
                  className="allwidth"
                  showTime
                  format="YYYY-MM-DD"
                  placeholder="选择时间"
                />)}
              </FormItem>
            </Col>
            <Col sm={24} md={8} push={16}>
            <span className="fr">
              <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
              <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
              <a className="s-btn-clock" onClick={this.searchBtnClock}>
                {this.state.searchAll ? '收起' : '展开'}
                {this.state.searchAll ? <Icon type="up"/> : <Icon type="down"/>}
              </a >
            </span>
            </Col>
          </Row> :
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="商户名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('shop_id', {})(<Select
                  className="allwidth"
                  onSearch={this.search_model_func}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  {options}
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="商品名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {})(<Input placeholder='商品名称'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
            <span className="fr">
              <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
              <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
              <a className="s-btn-clock" onClick={this.searchBtnClock}>
                {this.state.searchAll ? '收起' : '展开'}
                {this.state.searchAll ? <Icon type="up"/> : <Icon type="down"/>}
              </a >
            </span>
            </Col>
          </Row>
        }
      </div>
    )
  }
}
;

SearchContent.propTypes = {};
export default Form.create()(SearchContent)
