import React from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Modal,Select,InputNumber} from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
import { DatePicker } from 'antd';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;

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
    const {currentItem, formProps,...modalProps} = this.props;
    const { getFieldDecorator} = this.props.form;
    const modalOpts = {
        onOk:this.handleOk,
        ...modalProps,
    }
    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal" {...formProps}>
          <FormItem label="总积分" hasFeedback {...formItemLayout}>
            {getFieldDecorator('total_points', {
              initialValue: currentItem,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input disabled={true} />)}


          </FormItem>
          <FormItem label="折扣" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discount', {
              rules: [
                formRules.require,formRules.whitespace,formRules.disCount
              ],
            })(<Input  placeholder="输入折扣(0.1-10)"/>)}
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
