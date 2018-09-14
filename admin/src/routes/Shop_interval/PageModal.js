import React from 'react';
import PropTypes from 'prop-types'
import {Form, Input, Modal, Select, Radio, InputNumber, Row, Col} from 'antd'
import formRules from '../../utils/formRules'
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
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
      if(data.settlement_cycle!=undefined){
        data.is_settlement = 1;
      }
      this.props.BtnOk(data)
    })
  }

  render() {
    const {currentItem, formProps, ...modalProps} = this.props;
    const {getFieldDecorator} = this.props.form;
    const modalOpts = {
      onOk: this.handleOk,
      ...modalProps,
    }
    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal" {...formProps}>
          <FormItem label="设置结算周期" hasFeedback {...formItemLayout}>
            {getFieldDecorator('settlement_cycle', {
              initialValue: currentItem.is_settlement&&currentItem.settlement_cycle!=undefined?currentItem.settlement_cycle.toString():null,
              rules: [
                formRules.require,
              ],
            })(<Radio.Group>
              <Radio value={'0'}>日结算</Radio>
              <Radio value={'1'}>周结算</Radio>
              <Radio value={'2'}>月结算</Radio>
            </Radio.Group>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
;
PageModal.propTypes = {
  form: PropTypes.object,
  formProps: PropTypes.object,
  modalType: PropTypes.string,
}
export default Form.create()(PageModal)
