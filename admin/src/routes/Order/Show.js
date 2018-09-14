import React from 'react';
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
const {goBack, push} = routerRedux;
import PropTypes from 'prop-types'
import {Row, Col, Icon,Badge,Modal,Button,Alert,Steps,} from 'antd'
import Func from "../../utils/publicFunc"
import styles from './app.css'
const Step = Steps.Step;
const typeArry = ['礼品','代金券','商品'];
const payTypeText = ['积分','支付','积分+支付'];
const statusArry = {'-4':'退货中','-3':'退货成功','-2':'退货失败','-1':'申请退货','0':'新建','1':'支付中','2':'支付完成','3':'已核销'};
const sumStatusArry = ['支付','待结算','生成结算文件','已结算'];
const statusMap = ['default','processing'];
const statusText = ['待上架','已上架'];
const activeType = ['日','周','月'];


class OrderShow extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
  }
  constructor(props) {
    super(props);
    const id = this.props.params;
    this.props.dispatch({type: `order/getDetail`,payload: {...id}})
  }
  handlePreview = (url) => {
    this.setState({
      previewImage:url,
      previewVisible: true,
    });
  }
  handleCancel = () => this.setState({previewVisible: false})
  handBack = () => {
    this.props.dispatch(push("/orders"));
  }
  getOrderGoods =  (currentItem)=>{
    if(currentItem.type===0)return currentItem.gift?currentItem.gift.name:'';
    if(currentItem.type===1)return currentItem.voucher?currentItem.voucher.name:'';
    if(currentItem.type===2)return currentItem.goods?currentItem.goods.name:'';
  }
  getVerifyPeople =  (currentItem)=>{
    if(currentItem.verify_people_type===1)return currentItem.verify_merchant?currentItem.verify_merchant.name:'暂无';
    if(currentItem.verify_people_type===2)return currentItem.verify_staff?currentItem.verify_staff.name:'暂无';
    return '无';
  }
  render() {
    const {currentItem = {},fileList} = this.props.order;
    const activity =  currentItem.activity?currentItem.activity:{};
    let {previewVisible, previewImage} = this.state;
    return (
      <div className={styles.show_content}>
        <div className="content_item">
          <div className="item_lt">
          <div className="item_name">订单信息</div> 
          </div>
          <div className="item_rt">
            <div className="item_li"><div className="li_name">订单号:</div><div className="li_value">{currentItem.order_no}</div></div>
            <div className="item_li"><div className="li_name">订单类型:</div><div className="li_value">{typeArry[currentItem.type]}</div></div>
            <div className="item_li"><div className="li_name">数量:</div><div className="li_value">{currentItem._count}</div></div>
            {currentItem.pay_type!==1?<div className="item_li"><div className="li_name">订单积分:</div><div className="li_value">{currentItem.exch_points?currentItem.exch_points:0}</div></div>:''}
            {currentItem.pay_type!==0?<div className="item_li"><div className="li_name">订单金额（元）:</div><div className="li_value">¥ {currentItem.amount?Func.price(currentItem.amount):'0'}</div></div>:''}
            <div className="item_li"><div className="li_name">订单生成时间:</div><div className="li_value">{Func.getDate_ymdhms(currentItem.create_time)}</div></div>
            <div className="item_li"><div className="li_name">订单状态:</div><div className="li_value">{statusArry[currentItem.status]}</div></div>
            {sumStatusArry===3?
            <div className="item_li"><div className="li_name">结算时间:</div><div className="li_value">{Func.getDate_ymdhms(currentItem.sum_time)}</div></div>:''}
            {/* <div className="item_li"><div className="li_name">订单状态:</div><div className="li_value">
              <Steps current={currentItem.status}>
                <Step title="新单" description="新注册的订单,未支付" />
                <Step title="支付中" description="订单正在支付中，等待支付完成" />
                <Step title="已支付" description="订单已付款，待核销" />
                <Step title="已核销" description="订单已核销" />
              </Steps>
            </div></div> */}
          </div>
        </div>
        <div className="content_item">
          <div className="item_lt">
          <div className="item_name">客户信息</div> 
          </div>
          <div className="item_rt">
            <div className="item_li"><div className="li_name">客户姓名:</div><div className="li_value">{currentItem.customer?currentItem.customer.name:'暂无'}</div></div>
            <div className="item_li"><div className="li_name">联系方式:</div><div className="li_value">{currentItem.phone?currentItem.phone:'暂无'}</div></div>
            <div className="item_li"><div className="li_name">换购商品:</div><div className="li_value">{this.getOrderGoods(currentItem)}</div></div>
          </div>
        </div>
        <div className="content_item">
          <div className="item_lt">
          <div className="item_name">支付信息</div> 
          </div> 
          <div className="item_rt">
            <div className="item_li"><div className="li_name">支付方式:</div><div className="li_value">{payTypeText[currentItem.pay_type]}</div></div>
            <div className="item_li"><div className="li_name">支付时间:</div><div className="li_value">{currentItem.pay_time?Func.getDate_ymdhms(currentItem.pay_time):'无'}</div></div>
          </div>
        </div>
        {(currentItem.status!==0&&currentItem.status!==1&&currentItem.status!==2)?
        <div className="content_item">
          <div className="item_lt">
          <div className="item_name">核销信息</div> 
          </div>
          <div className="item_rt">
            <div className="item_li"><div className="li_name">核销人:</div><div className="li_value">{this.getVerifyPeople(currentItem)}</div></div>
            <div className="item_li"><div className="li_name">核销时间:</div><div className="li_value">{currentItem.status===3?Func.getDate_ymdhms(currentItem.verify_time):'无'}</div></div>
          </div>
        </div>:''}
        {currentItem.sum_status===3?
        <div className="content_item">
          <div className="item_lt">
          <div className="item_name">结算信息</div> 
          </div>
          <div className="item_rt">
            <div className="item_li"><div className="li_name">结算时间:</div><div className="li_value">{Func.getDate_ymdhms(currentItem.sum_time)}</div></div>
          </div>
        </div>:''}
        {(currentItem.status!==0&&currentItem.status!==1&&currentItem.status!==2&&currentItem.status!==3)?
        <div className="content_item"> 
          <div className="item_lt">
          <div className="item_name">退货信息</div> 
          </div>
          <div className="item_rt">
            <div className="item_li"><div className="li_name">退款状态:</div><div className="li_value">{statusArry[currentItem.status]}</div></div>
            <div className="item_li"><div className="li_name">退款时间:</div><div className="li_value">{currentItem.refund_time?Func.getDate_ymdhms(currentItem.refund_time):'无'}</div></div>
            <div className="item_li"><div className="li_name">退款原因:</div><div className="li_value">{currentItem.refund_reason?currentItem.refund_reason:'无'}</div></div>
            <div className="item_li"><div className="li_name">退款描述:</div><div className="li_value">{currentItem.refund_desc?currentItem.refund_desc:'无'}</div></div>
            <div className="item_li"><div className="li_name">退款电话:</div><div className="li_value">{currentItem.refund_phone?currentItem.refund_phone:'无'}</div></div>
            <div className="item_li"><div className="li_name">退款地址:</div><div className="li_value">{currentItem.refund_addr?currentItem.refund_addr:'无'}</div></div>
          </div>
        </div>:''}
        <div className="content_item">
          <Button className="button" icon="left" type='primary' onClick={this.handBack}>返回</Button>
        </div>
      </div>
    );
  }
}
;

OrderShow.propTypes = {
  order: PropTypes.object,
}
export default connect(({order})=>({order}))(OrderShow)

