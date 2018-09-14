import React from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Modal,Select,Upload,Icon,message,Radio } from 'antd'
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
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...this.props.form.getFieldsValue(),
      }
      this.props.BtnOk(data)
    })
  }
  render() {
    const { formProps,...modalProps} = this.props;
    const { getFieldDecorator} = this.props.form;
    const item = this.props.item;
    const modalOpts = {
        onOk:this.handleOk,
        ...modalProps,
    }
    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal" {...formProps}>
          <FormItem label="状态" hasFeedback {...formItemLayout}>
            {getFieldDecorator('enabled', {
              initialValue: (item.enabled!==null||item.enabled!==undefined)?item.enabled:1,
              rules: [
                formRules.require,
              ],
            })(<Radio.Group>
              <Radio key={0} value={0}>禁用</Radio>
              <Radio key={1} value={1}>启用</Radio>
            </Radio.Group>)}
          </FormItem>
          <FormItem label="告知书内容" hasFeedback {...formItemLayout}>
            {getFieldDecorator('content', {
              initialValue: item.content,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input autosize={{minRows: 6, maxRows: 50}} type='textarea' placeholder="告知书内容"/>)}
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
