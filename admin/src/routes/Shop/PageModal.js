import React from 'react';
import PropTypes from 'prop-types'
import {Form, Input, Modal, Select, Radio, InputNumber, Row, Col} from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
import styles from "./app.css"

const Option = Select.Option;
const FormItem = Form.Item;
const statusArrayExam = ['新申请', '申请受理'];
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
}
class PageModal extends React.Component {
  state = {
    showTextarea: false,//是否显示审核原因输入框
    previewVisible: false,
    previewImage: '',
  }
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
      if(data.examine_status===3)data.status = 1;//状态默认为启用
      data.closeModal = true;
      this.props.BtnOk(data)
    })
  }
  handlePreview = (url) => {
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  }
  handleCancel = () => this.setState({previewVisible: false})
  render() {
    const {currentItem, formProps, ...modalProps} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {previewVisible, previewImage,} = this.state;
    const {showTextarea} = this.state;

    const modalOpts = {
      onOk: this.handleOk,
      ...modalProps,
    }
    return (
      <Modal {...modalOpts}>
        <Row>
          <Col span={12}>
            <div className='term'>申请单编号</div>
            <div className='term_detail'>{currentItem.id}</div>
          </Col>
          <Col span={12}>
            <div className='term'>商户名称</div>
            <div className='term_detail'>{currentItem.name}</div>
          </Col>
          <Col span={12}>
            <div className='term'>是否本行商户</div>
            <div className='term_detail'>{currentItem.is_thefamily?'是':'否'}</div>
          </Col>
          <Col span={12}>
            <div className='term'>经营人</div>
            <div className='term_detail'>{currentItem.connect_person}</div>
          </Col>
          <Col span={12}>
            <div className='term'>发起申请时间</div>
            <div className='term_detail'>{Func.getDate_ymdhms(currentItem.created_at)}</div>
          </Col>
          <Col span={12}>
            <div className='term'>审核状态</div>
            <div className='term_detail'>{statusArrayExam[currentItem.examine_status]}</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Col span={12}>
              <div className='term'>营业执照图片</div>
              <div className='term_detail'>
                {currentItem.business_img?currentItem.business_img.split(',').map(img=> {
                  return (<img key={img} onClick={e=> {
                    this.handlePreview(img)
                  }} src={img} className="table_img" alt="点击预览"/>)
                }):''}
              </div>
            </Col>
          </Col>
        </Row>
        <Form layout="horizontal" {...formProps}>
          <FormItem label="审核结果" hasFeedback {...formItemLayout}>
            {getFieldDecorator('examine_status', {
              initialValue: currentItem.examine_status?currentItem.examine_status:null,
              rules: [
                formRules.require,
              ],
            })(<Radio.Group onChange={e=> {
              this.setState({showTextarea: e.target.value === 2})
            }
            }>
              <Radio value={1}>申请受理</Radio>
              <Radio value={2}>审核不通过</Radio>
              <Radio value={3}>审核完成</Radio>
            </Radio.Group>)}
          </FormItem>
          {showTextarea ? <FormItem label="不通过原因" hasFeedback {...formItemLayout}>
            {getFieldDecorator('examine_option', {
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input autosize={{minRows: 4, maxRows: 6}} type='textarea' placeholder="填写原因"/>)}
          </FormItem> :''}

        </Form>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
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
