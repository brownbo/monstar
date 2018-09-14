/**
 * Created by 郑银华 on 2017/10/30.
 */

import React from 'react';
import { Input,Button,Icon,Row,Col,Form,Select} from 'antd';
import PropTypes from 'prop-types'
import styles from './app.css'

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
  state ={
    searchAll: false,
  }
  constructor(props) {
    super(props);
    this.isSearchNull = true;//查询下拉框内容否为空
  }
  componentDidMount(){
    this.props.getDefault_data();
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
      data.area_id&&(data.area_id = data.area_id.key);
      this.props.SearchDateByQuery(data);
    })
  }
  searchBtnClock = ()=> {
    this.setState({searchAll: !this.state.searchAll});
  }
  search_model_func = (value) => {
    this.isSearchNull = value == '';
    this.props.getAreaSearch_data(value);
  }
  render (){
    const {getFieldDecorator} = this.props.form;
    const {default_data, search_data, getAreaSearch_data} = this.props;
    const list = (search_data.length || !this.isSearchNull) ? search_data : default_data;
    let options = [];
    list.forEach((obj)=> {
      options.push(<Option key={obj.id} value={obj.id.toString()}>{obj.name}</Option>);
    })
    return (
      <div className="marginTop10">
        {this.state.searchAll ?
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="网点名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {})(<Input placeholder='输入网点名称'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="所属区域" hasFeedback {...formItemLayout}>
                {getFieldDecorator('area_id', {})(<Select
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
              <FormItem label="网点地址" hasFeedback {...formItemLayout}>
                {getFieldDecorator('address', {})(<Input placeholder='输入网点地址'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="网点电话" hasFeedback {...formItemLayout}>
                {getFieldDecorator('phone', {})(<Input placeholder='输入网点电话'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="状态 " hasFeedback {...formItemLayout}>
                {getFieldDecorator('status', {})(<Select className="allwidth">
                  <Option key="0" value={'1'}>营业</Option>
                  <Option key="1" value={'0'}>停业</Option>
                </Select>)}
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
          :
        <Row gutter={8}>
          <Col sm={24} md={8}>
            <FormItem label="所属区域" hasFeedback {...formItemLayout}>
              {getFieldDecorator('area_id', {})(<Select
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
            <FormItem label="网点名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {})(<Input placeholder='输入网点名称'/>)}
            </FormItem>
          </Col>
          <Col sm={24} md={8} >
              <span className="fr">
                <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
                <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
                <a className="s-btn-clock" onClick={this.searchBtnClock}>
                {this.state.searchAll ? '收起' : '展开'}
                {this.state.searchAll ? <Icon type="up"/> : <Icon type="down"/>}
                </a >
              </span>
          </Col>
        </Row>}
    </div>)
  }
};

SearchContent.propTypes = {
  from:PropTypes.object,
  SearchDateByQuery:PropTypes.func,
  getAreaDefalut_data:PropTypes.func,
  getAreaSearch_data:PropTypes.func,
  default_data:PropTypes.array,
  search_data:PropTypes.array,
};

export default Form.create()(SearchContent);
