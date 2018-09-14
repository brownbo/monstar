import React from 'react';

import {Input, Button, Icon, Row, Col, Select, Form,InputNumber,message} from 'antd';
import PropTypes from 'prop-types';
import Func from '../../utils/publicFunc';
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
  state = {
    searchAll: false,
  }

  constructor(props) {
    super(props);
    this.isSearchNull = true;//查询分类是否为空
  }

  componentDidMount() {
    this.props.getGiftTypeDefalut_data();
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
      if(data.exch_points_start!=undefined&&data.exch_points_end==undefined||
        data.exch_points_start==undefined&&data.exch_points_end!=undefined||data.exch_points_start>=data.exch_points_end){
        message.error('积分段输入错误');
        return;
      }
      if(data.exch_points_start!=undefined&&data.exch_points_end!=undefined)data.exch_points = data.exch_points_start+','+data.exch_points_end;
      data.exch_points_start  = '';
      data.exch_points_end  = '';

      data.gift_type_id&&(data.gift_type_id = data.gift_type_id.key);

      this.props.SearchDateByQuery(data);



    })
  }
  searchBtnClock = ()=> {
    this.setState({searchAll: !this.state.searchAll});
  }
  search_model_func = (value) => {
    this.isSearchNull = value == '';
    this.props.getGiftTypeSearch_data(value);
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const {default_data, search_data} = this.props;
    const options = Func.getSelectOptions(search_data,default_data,this.isSearchNull);
    return (
      <div className="marginTop10">

        {this.state.searchAll ?
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="礼品名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {})(<Input placeholder='名称'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="礼品品牌" hasFeedback {...formItemLayout}>
                {getFieldDecorator('brand', {})(<Input placeholder='礼品品牌'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="分类" hasFeedback {...formItemLayout}>
                {getFieldDecorator('gift_type_id', {})(<Select
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
              <FormItem label="是否启用" hasFeedback {...formItemLayout}>
                {getFieldDecorator('enabled', {})(<Select className="allwidth">
                  <Option key="0" value={'0'}>禁用</Option>
                  <Option key="1" value={'1'}>启用</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="兑换积分" hasFeedback {...formItemLayout}>
                <Row>
                  <Col span={10}>
                    {getFieldDecorator('exch_points_start', {})(<InputNumber min={0} className="allwidth" placeholder='积分开始'/>)}
                  </Col>
                  <Col span={4} className="text-center">
                    -
                  </Col>
                  <Col span={10}>
                  {getFieldDecorator('exch_points_end', {})(<InputNumber min={0} className="allwidth" placeholder='积分结束'/>)}
                  </Col>
                </Row>
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
          </Row> :
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="礼品名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {})(<Input placeholder='名称'/>)}
              </FormItem>
            </Col>
            <Col sm={24} md={8}>
              <FormItem label="礼品品牌" hasFeedback {...formItemLayout}>
                {getFieldDecorator('brand', {})(<Input placeholder='礼品品牌'/>)}
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
SearchContent.propTypes = {
  form:PropTypes.object,
  SearchDateByQuery:PropTypes.func,
  getGiftTypeDefalut_data:PropTypes.func,
  getGiftTypeSearch_data:PropTypes.func,
  default_data:PropTypes.array,
  search_data:PropTypes.array,
};
export default Form.create()(SearchContent)
