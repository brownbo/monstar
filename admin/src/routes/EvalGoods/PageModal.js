import React from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Modal,Select } from 'antd'
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
          <FormItem label="回复内容" hasFeedback {...formItemLayout}>
            {getFieldDecorator('reply_content', {
              initialValue: item.reply_content,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input  placeholder="回复内容"/>)}
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
