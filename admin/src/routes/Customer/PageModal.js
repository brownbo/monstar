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
  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...this.props.form.getFieldsValue(),
      }
      this.props.BtnOk(data)
    })
  }
  render() {
    const { formProps,modalType,...modalProps} = this.props;
    const { getFieldDecorator} = this.props.form;
    const item = this.props.item;
    const modalOpts = {
        onOk:this.handleOk,
        ...modalProps,
    }
    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal" {...formProps}>
          <FormItem label="姓名" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input  placeholder="姓名"/>)}
          </FormItem>
          <FormItem label="证件编号" hasFeedback {...formItemLayout}>
            {getFieldDecorator('certificate_code', {
              initialValue: item.certificate_code,
              rules:[
                formRules.require,formRules.idCard
              ]
            })(<Input  placeholder="证件编号"/>)}
          </FormItem>
          <FormItem label="用户名" hasFeedback {...formItemLayout}>
            {getFieldDecorator('username', {
              initialValue: item.username,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input  placeholder="用户名"/>)}
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
