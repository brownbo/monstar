/**
 * Created by 郑银华 on 2017/10/30.
 */

import React from 'react';
import {Input, Button, Row, Icon, Col, Form} from 'antd';
import PropTypes from 'prop-types'
import styles from './app.css'
import {Modal} from 'antd';
const confirm = Modal.confirm
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
    this.isSearchNull = true;//查询分类是否为空
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
      this.props.SearchDateByQuery(data);
    })
  }
  searchBtnClock = ()=> {
    this.setState({searchAll: !this.state.searchAll});
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (

      <div className="marginTop10">
        {this.state.searchAll ?
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="商户名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {})(<Input placeholder='输入商户名称'/>)}
              </FormItem>
            </Col>
          
            {/* <Col sm={24} md={8}>
              <FormItem label="联系电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('connect_phone', {})(<Input placeholder='输入联系电话'/>)}
              </FormItem>
            </Col> */}
            <Col sm={24} md={8}>
              <FormItem label="商户经营人" hasFeedback {...formItemLayout}>
                {getFieldDecorator('connect_person', {})(<Input placeholder='输入商户经营人'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="地址" hasFeedback {...formItemLayout}>
                {getFieldDecorator('address', {
                  rules: [],
                })(<Input placeholder='输入商户地址'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8} push={16} >
              <span className="fr">
                <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
                <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
                <a className="s-btn-clock" onClick={this.searchBtnClock}>
                  {this.state.searchAll ? '收起' : '展开'}
                  {this.state.searchAll ? <Icon type="up"/> : <Icon type="down"/>}
                </a >
              </span>
          </Col>
          </Row>   :
        <Row gutter={8}>
          <Col sm={24} md={8}>
            <FormItem label="商户名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {})(<Input placeholder='输入商户名称'/>)}
            </FormItem>
          </Col>
          <Col sm={24} md={8}>
            <FormItem label="商户经营人" hasFeedback {...formItemLayout}>
              {getFieldDecorator('connect_person', {})(<Input placeholder='输入商户经营人'/>)}
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
      </div>)
  }
}
;

SearchContent.propTypes = {
  SearchDateByQuery:PropTypes.func,
  from:PropTypes.object,
};

export default Form.create()(SearchContent);
