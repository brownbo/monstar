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
    this.isSearchNull_gift = true;
    this.isSearchNull_gifttype = true;
    this.isSearchNull_netspot = true;

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
      data.gift_type_id&&(data.gift_type_id = data.gift_type_id.key);
      data.netspot_id&&(data.netspot_id = data.netspot_id.key);

      this.props.SearchDateByQuery(data);

    })
  }
  search_model_func_gift = (value)=>{
    this.isSearchNull_gift = value==='';
    this.props.getSearch_dataFunc('gift',{name:value});
  }
  search_model_func_gift_type = (value)=>{
    this.isSearchNull_gifttype = value==='';
    this.props.getSearch_dataFunc('gift_type',{name:value});
  }
  search_model_func_netspot = (value)=>{
    this.isSearchNull_netspot = value==='';
    this.props.getSearch_dataFunc('netspot',{name:value});
  }
  search_gifts_gifttype = (option)=> {
    this.gift_type = option.key;
    this.props.getSearch_dataFunc('gift',{gift_type_id:option.key});
  }
  render (){
    const {default_data, search_data,} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {searchAll} = this.state;

    let options = [];
    options[0] = Func.getSelectOptions(search_data[0],default_data[0],this.isSearchNull_gift);
    options[1] = Func.getSelectOptions(search_data[1],default_data[1],this.isSearchNull_gifttype);
    options[2] = Func.getSelectOptions(search_data[2],default_data[2],this.isSearchNull_netspot);
    return (
      <div className="marginTop10">
        {searchAll?
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="礼品类型" hasFeedback {...formItemLayout}>
                {getFieldDecorator('gift_type_id', {})(
                  <Select
                    className="allwidth"
                    onSearch={this.search_model_func_gift_type}
                    onChange = {this.search_gifts_gifttype}
                    showSearch
                    labelInValue
                    filterOption={false}>
                    {options[1]}
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
              <FormItem label="网点" hasFeedback {...formItemLayout}>
                {getFieldDecorator('netspot_id', {})(
                  <Select
                    className="allwidth"
                    onSearch={this.search_model_func_netspot}
                    showSearch
                    labelInValue
                    filterOption={false}>
                    {options[2]}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={8} push={16}>
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
              <FormItem label="礼品类型" hasFeedback {...formItemLayout}>
                {getFieldDecorator('gift_type_id', {})(
                  <Select
                    className="allwidth"
                    onSearch={this.search_model_func_gift_type}
                    onChange = {this.search_gifts_gifttype}
                    showSearch
                    labelInValue
                    filterOption={false}>
                    {options[1]}
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
