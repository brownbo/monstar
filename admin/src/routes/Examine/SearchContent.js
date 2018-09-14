/**
 * Created by 郑银华 on 2017/10/30.
 */

import React from 'react';
import { Input,Button,Icon,Row,Col,Form,Select} from 'antd';
import PropTypes from 'prop-types'
import styles from './app.css'
import Func from "../../utils/publicFunc"
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
    this.isSearchNull_gift = true;//查询是否为空
    this.isSearchNull_netspot = true;//查询是否为空
    this.isSearchNull_applicant = true;//查询是否为空
  }
  componentDidMount(){
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
    this.props.form.setFieldsValue(fields);
    this.props.SearchDateByQuery();
    event.preventDefault();
  }
  searchBtnClock = ()=> {
    this.setState({searchAll: !this.state.searchAll});
  }
  handClick = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...this.props.form.getFieldsValue(),
      }

      data.gift_id&&(data.gift_id = data.gift_id.key);
      data.sub_netspot_id&&(data.sub_netspot_id = data.sub_netspot_id.key);
      data.applicant_id&&(data.applicant_id = data.applicant_id.key);
      this.props.SearchDateByQuery(data);
    })
  }
  search_model_func_gift = (value)=>{
    this.isSearchNull_gift = value==='';
    this.props.getSearch_dataFunc('gift',{name:value});
  }
  search_model_func_netspot = (value)=>{
    this.isSearchNull_netspot = value==='';
    this.props.getSearch_dataFunc('netspot',{name:value});
  }
  search_model_func_applicant = (value)=>{
    this.isSearchNull_applicant = value==='';
    this.props.getSearch_dataFunc('staff',{name:value});
  }
  render (){
    const {default_data, search_data,} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {searchAll} = this.state;
    let options = [];
    options[0] = Func.getSelectOptions(search_data[0],default_data[0],this.isSearchNull_gift);
    options[1] = Func.getSelectOptions(search_data[1],default_data[1],this.isSearchNull_netspot);
    options[2] = Func.getSelectOptions(search_data[2],default_data[2],this.isSearchNull_applicant);
    return (
      <div className="marginTop10">
        {searchAll?
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="申请状态" hasFeedback {...formItemLayout}>
                {getFieldDecorator('status', {})(
                  <Select
                    className="allwidth">
                    <Option key={0} value={'0'}>已申请</Option>
                    <Option key={1} value={'1'}>申请通过</Option>
                    <Option key={2} value={'2'}>申请不通过</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="礼品名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('gift_id', {})(
                  <Select
                    className="allwidth"
                    onSearch={this.search_model_func_gift}
                    showSearch
                    labelInValue
                    filterOption={false}>
                    {options[0]}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="申请网点" hasFeedback {...formItemLayout}>
                {getFieldDecorator('sub_netspot_id', {})(
                  <Select
                    className="allwidth"
                    onSearch={this.search_model_func_netspot}
                    showSearch
                    labelInValue
                    filterOption={false}>
                    {options[1]}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="申请人" hasFeedback {...formItemLayout}>
                {getFieldDecorator('applicant_id', {})(
                  <Select
                    className="allwidth"
                    onSearch={this.search_model_func_applicant}
                    showSearch
                    labelInValue
                    filterOption={false}>
                    {options[2]}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={8} push={8}>
              <span className="fr">
                <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
                <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
                <a className="s-btn-clock" onClick={this.searchBtnClock}>
                  {searchAll ? '收起' : '展开'}
                  {searchAll ? <Icon type="up"/> : <Icon type="down"/>}
                </a >
              </span>
            </Col>
          </Row>:
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="申请状态" hasFeedback {...formItemLayout}>
                {getFieldDecorator('status', {})(
                  <Select
                    className="allwidth">
                    <Option key={0} value={'0'}>已申请</Option>
                    <Option key={1} value={'1'}>申请通过</Option>
                    <Option key={2} value={'2'}>申请不通过</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="礼品名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('gift_id', {})(
                  <Select
                    className="allwidth"
                    onSearch={this.search_model_func_gift}
                    showSearch
                    labelInValue
                    filterOption={false}>
                    {options[0]}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={8} >
              <span className="fr">
                <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
                <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
                <a className="s-btn-clock" onClick={this.searchBtnClock}>
                  {searchAll ? '收起' : '展开'}
                  {searchAll ? <Icon type="up"/> : <Icon type="down"/>}
                </a >
              </span>
            </Col>
          </Row>
        }
    </div>)
  }
};

SearchContent.propTypes = {
  SearchDateByQuery:PropTypes.func,
};

export default Form.create()(SearchContent);
