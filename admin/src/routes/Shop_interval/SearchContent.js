/**
 * Created by 郑银华 on 2017/10/30.
 */

import React from 'react';
import {Input, Button, Row, Icon, Col, Form,Select} from 'antd';
import PropTypes from 'prop-types'

import {Modal} from 'antd';
const Option = Select.Option;
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
  constructor(props) {
    super(props);
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
      this.props.SearchDateByQuery(data);
    })
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const {tab} = this.props;
    return (
      <div className="marginTop10">
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="商户名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {})(<Input placeholder='输入商户名称'/>)}
              </FormItem>
            </Col>
            {tab===2?<Col sm={24} md={8}>
              <FormItem label="结算周期 " hasFeedback {...formItemLayout}>
                {getFieldDecorator('settlement_cycle', {})(<Select className="allwidth" onChange={this.selectOnChange}>
                  <Option key="0" value={'0'}>日结算</Option>
                  <Option key="1" value={'1'}>周结算</Option>
                  <Option key="2" value={'2'}>月结算</Option>
                </Select>)}
              </FormItem>
            </Col>:''}
            <Col sm={24} md={8} push={tab===1?8:''}>
              <span className="fr">
                <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
                <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
              </span>
            </Col>
          </Row>
      </div>)
  }
};

SearchContent.propTypes = {
  SearchDateByQuery:PropTypes.func,
  from:PropTypes.object,
};

export default Form.create()(SearchContent);
