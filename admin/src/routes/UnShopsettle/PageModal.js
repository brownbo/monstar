import React from 'react';
import PropTypes from 'prop-types'
import { Form,Table,Col, Row, Modal,Select,InputNumber} from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
const Option = Select.Option;
const FormItem  = Form.Item;
import styles from './app.css'
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
    this.Columns = [{
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo'
    },{
      title: '客户',
      dataIndex: 'customer',
      key: 'customer'
    }];
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
    const { currentItem,formProps,modalType,...modalProps} = this.props;
    const { getFieldDecorator} = this.props.form;
    const modalOpts = {
        onOk:this.handleOk,
        ...modalProps,
    }
    const content = [];
    currentItem.forEach((obj)=> {

      content.push(<Row gutter={8}   key={obj.order_no}>
        <Col className={styles.border} sm={8} md={8}>{obj.order_no}</Col>
        <Col className={styles.border} sm={5} md={5}>{Func.getDate_ymdhms(obj.sum_time)}</Col>
        <Col className={styles.border} sm={2} md={2}>{obj.exch_points}</Col>
        <Col className={styles.border} sm={2} md={2}>{obj.customer_name}</Col>
        <Col className={styles.border} sm={7} md={7}>{obj.goods_id?obj.goods.name:obj.voucher.name}</Col>
        </Row>)

    })
    return (
      <Modal {...modalOpts}>
        <Row  gutter={8}>
          <Col className={styles.border} sm={8} md={8}>订单编号</Col>
          <Col className={styles.border} sm={5} md={54}>结算时间</Col>
          <Col className={styles.border} sm={2} md={2}>积分</Col>
          <Col className={styles.border} sm={2} md={2}>客户</Col>
          <Col className={styles.border} sm={7} md={7}>商品</Col>
        </Row>
        {content}
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
