/**
 * Created by 郑银华 on 2017/10/30.
 */

import React from 'react';
import { Input,Button,Icon,Row,Col,Form,Select} from 'antd';
import PropTypes from 'prop-types'
import styles from './app.css'
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
  state ={
    searchAll: false,
  }
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
  render (){
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="marginTop10">
        <Row gutter={8}>
          <Col sm={24} md={8}>
            <FormItem label="Banner名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {})(<Input placeholder='Banner名称'/>)}
            </FormItem>
          </Col>
          <Col sm={24} md={8}>
            <FormItem label="状态" hasFeedback {...formItemLayout}>
              {getFieldDecorator('status', {})(
                <Select className="allwidth">
                  <Option key={0} value={'0'}>停用</Option>
                  <Option key={1} value={'1'}>启用</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col sm={24} md={8} >
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
  from:PropTypes.object,
  SearchDateByQuery:PropTypes.func,
};

export default Form.create()(SearchContent);
