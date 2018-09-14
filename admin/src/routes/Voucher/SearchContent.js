import React from 'react';
import {Button, Row, Col, Select, Form} from 'antd';
import PropTypes from 'prop-types'
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

  }
  constructor(props) {
    super(props);
    this.isSearchNull = true;//查询分类是否为空
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
      data.shop_id&&(data.shop_id = data.shop_id.key);
      this.props.SearchDateByQuery(data);
    })
  }
  search_model_func = (value) => {
    this.isSearchNull = value == '';
    this.props.getShopSearch_data(value);
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const {default_data, search_data} = this.props;
    const list = (search_data.length || !this.isSearchNull) ? search_data : default_data;
    let options = [];
    list.forEach((obj)=> {
      options.push(<Option key={obj.id} value={obj.id.toString()}>{obj.name}</Option>);
    })
    return (
      <div className="marginTop10">
          <Row gutter={8}>
            <Col sm={24} md={8}>
              <FormItem label="商户" hasFeedback {...formItemLayout}>
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
            <Col sm={24} md={8} push={8}>
              <span className="fr">
                <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
                <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
              </span>
            </Col>
          </Row>
      </div>
    )
  }
}
;

SearchContent.propTypes = {
  SearchDateByQuery:PropTypes.func,
  default_data:PropTypes.array,
  search_data:PropTypes.array,
  getShopSearch_data:PropTypes.func,
  getShopDefault_data:PropTypes.func,
};
export default Form.create()(SearchContent)
