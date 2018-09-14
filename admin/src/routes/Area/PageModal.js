import React from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Modal,Select,message } from 'antd'
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
    this.isSearchNull = true;//查询分类是否为空
  }
  componentDidMount(){
    this.props.default_model_func();
  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...this.props.form.getFieldsValue(),
      }
      if(this.props.modalType==='update'&&this.props.currentItem.id.toString()===data.parent_area_id){
        message.error('上级区域不能和当前区域相同');
        return;
      }
      if(!data.parent_area_id) delete data['parent_area_id'];

      data.parent_area_id&&(data.parent_area_id = data.parent_area_id.key);
      this.props.BtnOk(data)
    })
  }
  search_model_func = (value) => {
    this.isSearchNull = value == ''
    this.props.search_model_func(value);
  }
  render() {
    const {currentItem, formProps,modalType,default_data,search_data,...modalProps} = this.props;
    const { getFieldDecorator} = this.props.form;
    const options = Func.getSelectOptions(search_data,default_data,this.isSearchNull,currentItem.parent_area,currentItem.parent_area_id);
    const modalOpts = {
        onOk:this.handleOk,
        ...modalProps,
    }
    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal" {...formProps}>
          <FormItem label="区域名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: currentItem.name,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input  placeholder="区域名称"/>)}
          </FormItem>
          <FormItem label="上级区域" hasFeedback {...formItemLayout}>
            {getFieldDecorator('parent_area_id', currentItem.parent_area_id?{
              initialValue:{key:currentItem.parent_area_id.toString(),label:currentItem.parent_area.name.toString()},
            }:{

            })(<Select
              onSearch={this.search_model_func}
              showSearch
              labelInValue//必须加，不然只显示选择数据的id
              filterOption={false}>
              {options}
            </Select>)}
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
  parentArea: PropTypes.array,
  searchArea_model: PropTypes.array,
  searchArea_model_func: PropTypes.func,
}
export default Form.create()(PageModal)
