import React from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Modal,Select,Radio } from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
const Option = Select.Option;
const FormItem  = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
class PageModal extends React.Component {
  constructor(props) {
    super(props);
    this.isSearchNull = true;//查询下拉框内容否为空
  }
  componentDidMount(){
    this.props.getDefault_data();
  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...this.props.form.getFieldsValue(),
      }
      const longlat = data.point;
      data.long = longlat.split(',')[0];
      data.lat = longlat.split(',')[1];
      if(data.area_id){
        data.area_id = data.area_id.key
      }else{
        delete data['area_id'];//如果id为空则删除该字段 否则接口报错
        data.is_parent = 1;
      }


      this.props.BtnOk(data)
    })
  }
  search_model_func = (value) => {
    this.isSearchNull = value == '';
    this.props.getAreaSearch_data(value);
  }
  render() {
    const { formProps,modalType,default_data,search_data,...modalProps} = this.props;
    const { getFieldDecorator} = this.props.form;
    const currentItem = this.props.item;
    const options = Func.getSelectOptions(search_data,default_data,this.isSearchNull,currentItem.area,currentItem.area_id);
    const modalOpts = {
        onOk:this.handleOk,
        ...modalProps,
    }
    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal" {...formProps}>
          <FormItem label="网点名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: currentItem.name,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input  placeholder="网点名称"/>)}
          </FormItem>
          <FormItem label="所属区域" hasFeedback {...formItemLayout}>
            {getFieldDecorator('area_id', currentItem.area_id?{
              initialValue:{key:currentItem.area_id.toString(),label:currentItem.area.name.toString()},
              rules: [
                formRules.require,
              ],
            }:{
              rules: [
                formRules.require,
              ],
            })(<Select
              onSearch={this.search_model_func}
              showSearch
              labelInValue
              filterOption={false}>
              {options}
            </Select>)}
          </FormItem>
          <FormItem label="地址 " hasFeedback {...formItemLayout}>
            {getFieldDecorator('address', {
              initialValue: currentItem.address,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input  placeholder="地址"/>)}
          </FormItem>
          <FormItem label="经纬度" hasFeedback {...formItemLayout}>
            {getFieldDecorator('point', {
              initialValue: currentItem.long?(currentItem.long+","+currentItem.lat):'',
              rules: [
                formRules.require,formRules.longlat,
              ],
            })(<Input  placeholder="经纬度(逗号隔开)"/>)}
          </FormItem>
          <FormItem label="网点电话" hasFeedback {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: currentItem.phone,
              rules: [
                formRules.require,formRules.whitespace,
                formRules.phoneNo,
              ],
            })(<Input  placeholder="phone"/>)}
          </FormItem>
          <FormItem label="是否一级网点" hasFeedback {...formItemLayout}>
            {getFieldDecorator('is_parent', {
              initialValue: currentItem.is_parent!==undefined?currentItem.is_parent:1,
              rules: [
                formRules.require,
              ],
            })(<Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>)}
          </FormItem>
          <FormItem label="状态" hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: currentItem.status!==undefined?currentItem.status:1,
              rules: [
                formRules.require,
              ],
            })(<Radio.Group>
              <Radio value={1}>营业</Radio>
              <Radio value={0}>停业</Radio>
            </Radio.Group>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
};

PageModal.propTypes = {
  form: PropTypes.object,
  formProps: PropTypes.object,
  modalType: PropTypes.string,
  getAreaDefalut_data:PropTypes.func,
  getAreaSearch_data:PropTypes.func,
  default_data:PropTypes.array,
  search_data:PropTypes.array,
}
export default Form.create()(PageModal)
