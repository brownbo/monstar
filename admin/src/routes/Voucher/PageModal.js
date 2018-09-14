import React from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Modal,Select,Row,Col ,InputNumber,Radio} from 'antd'
import formRules from '../../utils/formRules'
import Func from "../../utils/publicFunc"
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
    showTextarea:false
  }
  constructor(props) {
    super(props);
  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...this.props.form.getFieldsValue(),
      }
      if(data.examine_status===3)data.enabled = true;
      this.props.BtnOk(data)
    })
  }
  render() {
    const { formProps,currentItem,...modalProps} = this.props;
    const { getFieldDecorator} = this.props.form;
    const {showTextarea} = this.state;
    const modalOpts = {
        onOk:this.handleOk,
        ...modalProps,
    }
    return (
      <Modal {...modalOpts}>
        <Row>
          <Col span={12}>
            <div className='term'>申请编号</div>
            <div className='term_detail'>{currentItem.id}</div>
          </Col>
          <Col span={12}>
            <div className='term'>代金券名称</div>
            <div className='term_detail'>{currentItem.name}</div>
          </Col>
          <Col span={12}>
            <div className='term'>商户名称</div>
            <div className='term_detail'>{currentItem.shop.name}</div>
          </Col>
          <Col span={12}>
            <div className='term'>代金券面值</div>
            <div className='term_detail'>{Func.price(currentItem.value)}</div>
          </Col>
        </Row>
        <Form layout="horizontal" {...formProps}>
          <FormItem label="审核结果" hasFeedback {...formItemLayout}>
            {getFieldDecorator('examine_status', {
              initialValue: 3,
              rules: [
                formRules.require,
              ],
            })(<Radio.Group onChange={e=> {
              this.setState({showTextarea: e.target.value === 2})
            }
            }>
              <Radio value={3}>通过</Radio>
              <Radio value={2}>不通过</Radio>
            </Radio.Group>)}
          </FormItem>
          {showTextarea ? <FormItem label="不通过原因" hasFeedback {...formItemLayout}>
            {getFieldDecorator('option', {
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input autosize={{minRows: 4, maxRows: 6}} type='textarea' placeholder="填写原因"/>)}
          </FormItem> :
         ''
          }
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
