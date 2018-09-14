/**
 * Created by 郑银华 on 2017/10/30.
 */

import React from 'react';

import {Input, Button, Icon, Row, Col, Select, Form, DatePicker} from 'antd';
import Func from '../../utils/publicFunc'
import PropTypes from 'prop-types'
import styles from './app.css'
import {Modal} from 'antd';
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

class SearchContent extends React.Component {
  state = {
    searchAll: false,
  }

  constructor(props) {
    super(props);
    this.props.getGoodsDefault_data();
    this.props.getCustomerDefault_data();
    this.isSearchNull = true;//查询礼品是否为空
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
      if (data.eval_time)data.eval_time = Func.getTimeStrByMomentArray(data.eval_time);
      if (data.reply_time)data.reply_time = Func.getTimeStrByMomentArray(data.reply_time);

      data.goods_id&&(data.goods_id = data.goods_id.key);
      data.eval_customer_id&&(data.eval_customer_id = data.eval_customer_id.key);

      this.props.SearchDateByQuery(data);
    })
  }
  searchBtnClock = ()=> {
    this.setState({searchAll: !this.state.searchAll});
  }
  search_model_func_goods = (value) => {
    this.isSearchNull = value === '';
    this.props.getGoodsSearch_data(value);
  }
  search_model_func_customer = (value) => {
    this.isSearchNull = value === '';
    this.props.getCustomerSearch_data(value);
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    //根据礼品名称
    const {default_data_goods, search_data_goods, default_data_customer, search_data_customer} = this.props;
    const goods_option = Func.getSelectOptions(search_data_goods, default_data_goods, this.isSearchNull);
    const customer_option = Func.getSelectOptions(search_data_customer, default_data_customer, this.isSearchNull);
    return (
      <div className="marginTop10">
        {this.state.searchAll ?
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="商品名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('goods_id', {})(<Select
                  className="allwidth"
                  onSearch={this.search_model_func_goods}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  {goods_option}
                </Select>)}
              </FormItem>
            </Col>

            <Col sm={24} md={8}>
              <FormItem label="评价人" hasFeedback {...formItemLayout}>
                {getFieldDecorator('eval_customer_id', {})(<Select
                  className="allwidth"
                  onSearch={this.search_model_func_customer}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  {customer_option}
                </Select>)}
              </FormItem>
            </Col>
            {/* <Col sm={24} md={8}>
              <FormItem label="回复人 " hasFeedback {...formItemLayout}>
                {getFieldDecorator('reply_user_id', {})(<Select className="allwidth">
                  <Option key="1" value={'1'}>admin</Option>
                  <Option key="2" value={'2'}>123</Option>
                </Select>)}
              </FormItem>

            </Col> */}
            <Col sm={24} md={8}>
              <FormItem label="评价时间" hasFeedback {...formItemLayout}>
                {getFieldDecorator('eval_time', {})(<RangePicker
                  className="allwidth"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />)}
              </FormItem>
            </Col>
            {/* <Col sm={24} md={8}>
              <FormItem label="回复时间" hasFeedback {...formItemLayout}>
                {getFieldDecorator('reply_time', {})(<RangePicker
                  className="allwidth"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />)}
              </FormItem>
            </Col> */}

            <Col sm={24} md={8} push={16}>
            <span className="fr">

              <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
              <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
              <a type="primary" className={styles.marginRight} href='/admin/api/evalGoodsToExcel'><Icon type="arrow-down"/> 导出</a>
              <a className="s-btn-clock" onClick={this.searchBtnClock}>
                {this.state.searchAll ? '收起' : '展开'}
                {this.state.searchAll ? <Icon type="up"/> : <Icon type="down"/>}
              </a >
            </span>
            </Col>
          </Row> :
          <Row gutter={8}>

            <Col sm={24} md={8}>
              <FormItem label="商品名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('goods_id', {})(<Select
                  className="allwidth"
                  onSearch={this.search_model_func_goods}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  {goods_option}
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="评价人" hasFeedback {...formItemLayout}>
                {getFieldDecorator('eval_customer_id', {})(<Select
                  className="allwidth"
                  onSearch={this.search_model_func_customer}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  {customer_option}
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
            <span className="fr">

              <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
              <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
              <a type="primary"className={styles.marginRight} href="/admin/api/evalGoodsToExcel"><Icon type="arrow-down"/> 导出</a>
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

