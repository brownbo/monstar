/**
 * Created by 郑银华 on 2017/10/30.
 */

import React from 'react';
import { Input,Button,Icon,Row,Col,Form,Select} from 'antd';
import PropTypes from 'prop-types'
import Func from "../../utils/publicFunc"
import styles from './app.css'
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
  search_model_func = (value)=>{
    this.props.getSearch_dataFunc('shop',value);
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
    const {default_data, search_data,} = this.props;
    const {getFieldDecorator} = this.props.form;
    const options= Func.getSelectOptions(search_data,default_data,true);
    return (
      <div className="marginTop10">
        <Row gutter={8}>
          <Col sm={24} md={8}>
            <FormItem label="商户" hasFeedback {...formItemLayout}>
              {getFieldDecorator('shop_id', {})(
                <Select
                  className="allwidth"
                  onSearch={this.search_model_func}
                  showSearch
                  filterOption={false}>
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={8} push={8}>
            <span className="fr">
              <Button type="primary" icon="search" onClick={this.handClick}>搜索</Button>
              <Button type="default" className='inputMargin' icon="reload" onClick={this.handleReset}>重置</Button>
              {/* <a type="primary"className={styles.marginRight} href='/admin/api/evalGiftsToExcel'><Icon type="arrow-down"/> 导出</a> */}
            </span>
          </Col>
        </Row>
    </div>)
  }
};

SearchContent.propTypes = {
  SearchDateByQuery:PropTypes.func,
};

export default Form.create()(SearchContent);
