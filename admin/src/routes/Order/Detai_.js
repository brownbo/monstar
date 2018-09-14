import React from 'react';
import {connect} from 'dva'
import PropTypes from 'prop-types'
import {routerRedux} from 'dva/router'
import {Button, Row, Col} from 'antd'
import Func from "../../utils/publicFunc"

import styles from './index.less'
const {push} = routerRedux;
const typeArry = ['礼品','代金券','商品'];
const payTypeArry = ['积分','支付','积分+支付'];
const statusArry = ['新建','支付中','支付完成','已核销'];
const sumStatusArry = ['支付','待结算','生成结算文件','已结算'];
class OrderDetail extends React.Component {
  state = {}

  constructor(props) {
    super(props);
    this.api_name = 'order';
  }

  componentDidMount() {
    const id = this.props.params;
    this.props.dispatch({
      type: `${this.api_name}/getDetail`,
      payload: {
        ...id,
      },
    })
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
  handBack =  ()=>{
    this.props.dispatch(push("/orders"))
  }
  render() {
    const {currentItem = {}} = this.props.order;
    return (
      <div>
        <div className={styles.pageHeader}>
          <div className={styles.detail}>
            <div className={styles.logo}>
              <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"/>
            </div>
            <div className={styles.main}>
              <div className={styles.row}>
                <h1 className={styles.title}>
                  单号：{currentItem.order_no}
                </h1>
              </div>
              <div className={styles.row}>
                <div className={styles.content}>
                   <Row gutter={16}>
                     <Col xs={24} sm={12}>
                       <div className={styles.term}>订单类型</div>
                       <div className={styles.term_detail}>{typeArry[currentItem.type]}</div>
                     </Col>
                     <Col xs={24} sm={12}>
                       <div className={styles.term}>客户姓名</div>
                       <div className={styles.term_detail}>{currentItem.customer?currentItem.customer.name:'暂无'}</div>
                     </Col>
                     <Col xs={24} sm={12}>
                       <div className={styles.term}>客户联系方式</div>
                       <div className={styles.term_detail}>{currentItem.phone?currentItem.phone:'暂无'}</div>
                     </Col>
                     <Col xs={24} sm={12}>
                       <div className={styles.term}>换购商品</div>
                       <div className={styles.term_detail}>{
                         this.getOrderGoods(currentItem)
                       }</div>
                     </Col>
                     <Col xs={24} sm={12}>
                       <div className={styles.term}>数量</div>
                       <div className={styles.term_detail}>{currentItem._count}</div>
                     </Col>
                     <Col xs={24} sm={12}>
                       <div className={styles.term}>支付方式</div>
                       <div className={styles.term_detail}>{payTypeArry[currentItem.pay_type]}</div>
                     </Col>
                     <Col xs={24} sm={12}>
                       <div className={styles.term}>核销人</div>
                       <div className={styles.term_detail}>{this.getVerifyPeople(currentItem)}</div>
                     </Col>
                     <Col xs={24} sm={12}>
                       <div className={styles.term}>订单生成时间</div>
                       <div className={styles.term_detail}>{Func.getDate_ymdhms(currentItem.create_time)}</div>
                     </Col>

                     <Col xs={24} sm={12}>
                       <div className={styles.term}>订单支付时间</div>
                       <div className={styles.term_detail}>{(currentItem.status===2||currentItem.status===3)?Func.getDate_ymdhms(currentItem.pay_time):'无'}</div>
                     </Col>
                     <Col xs={24} sm={12}>
                       <div className={styles.term}>订单核销时间</div>
                       <div className={styles.term_detail}>{currentItem.status===3?Func.getDate_ymdhms(currentItem.verify_time):'无'}</div>
                     </Col>
                   </Row>
                </div>
                <div className={styles.extraContent}>
                    <Row>
                      <Col xs={24} sm={8}>
                        <div className={styles.textSecondary}>状态</div>
                        <div className={styles.heading}>{statusArry[currentItem.status]}</div>
                      </Col>
                      <Col xs={24} sm={8}>
                        <div className={styles.textSecondary}>订单金额</div>
                        <div className={styles.heading}>¥ {currentItem.amount?Func.price(currentItem.amount):'0'}</div>
                      </Col>
                      <Col xs={24} sm={8}>
                        <div className={styles.textSecondary}>订单积分</div>
                        <div className={styles.heading}>{currentItem.exch_points?currentItem.exch_points:0}</div>
                      </Col>
                    </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button type="primary" className={styles.backBt} icon="left" onClick={this.handBack}>返回</Button>
      </div>
    );
  }
}
;

OrderDetail.propTypes = {
  order: PropTypes.object,
  dispatch: PropTypes.func,
}
export default connect(({order, loading})=>({order, loading}))(OrderDetail)



