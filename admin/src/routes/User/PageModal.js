import React from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Modal,Select} from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
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
  state = {
    confirmDirty:'',
  }
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
      data.role_id&&(data.role_id = data.role_id.key);
      if(this.props.modalType==='create'){
        data.password = data.pwd1;
        delete data[pwd1];
        delete data[pwd2];
      }
      this.props.BtnOk(data)
    })
  }
  search_model_func_role = (value) => {
    this.isSearchNull = value == '';
    this.props.getRoleSearch_data(value);
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['pwd2'], { force: true });
    }
    callback();
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('pwd1')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  }
  
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  render() {
    const { formProps,modalType,default_data,search_data,...modalProps} = this.props;
    const { getFieldDecorator} = this.props.form;
    const currentItem = this.props.item;
    const options = Func.getSelectOptions(search_data,default_data,this.isSearchNull,currentItem.role,currentItem.role_id);
    const modalOpts = {
        onOk:this.handleOk,
        ...modalProps,
    }
    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal" {...formProps}>
          <FormItem label="用户名" hasFeedback {...formItemLayout}>
            {getFieldDecorator('username', {
              initialValue: currentItem.username,
              rules: [
                formRules.require,formRules.dOrW,
              ],
            })(<Input  placeholder="用户名"/>)}
          </FormItem>
          {modalType==='create'?
            <div>
              <FormItem label="密码" hasFeedback {...formItemLayout}>
                {getFieldDecorator('pwd1', {
                  rules: [
                    formRules.require,formRules.pwdLength6,formRules.whitespace,{
                      validator: this.validateToNextPassword,
                    }
                  ],
                })(<Input type="password"  placeholder="密码"/>)}
              </FormItem>
              <FormItem label="确认密码" hasFeedback {...formItemLayout}>
                {getFieldDecorator('pwd2', {
                  rules: [
                    formRules.require,formRules.pwdLength6,formRules.whitespace,{
                      validator: this.compareToFirstPassword,
                    } 
                  ],
                })(<Input type="password"  onBlur={this.handleConfirmBlur} placeholder="确认密码"/>)}
              </FormItem></div>:''}
          <FormItem label="角色" hasFeedback {...formItemLayout}>
            {getFieldDecorator('role_id', currentItem.role_id?{
              initialValue:{key:currentItem.role_id.toString(),label:currentItem.role.name.toString()},
              rules: [
                formRules.require,
              ],
            }:{
              rules: [
                formRules.require,
              ],
            })(<Select
              onSearch={this.search_model_func_role}
              showSearch
              labelInValue
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
}
export default Form.create()(PageModal)
