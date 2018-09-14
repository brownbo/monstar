import React from 'react';
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
const {goBack, push} = routerRedux;
import PropTypes from 'prop-types'
import {Row, Col, Icon,Badge,Modal,Button,Alert,} from 'antd'
import Func from "../../utils/publicFunc"
import styles from './app.css'

const payTypeText = ['积分','支付','积分+支付'];
const statusMap = ['default','processing'];
const statusText = ['禁用','启用'];
const activeType = ['日','周','月'];
const weeks = ['周日','周一','周二','周三','周四','周五','周六'];
const statusArray = ['新单','','审核不通过','审核通过'];
class VoucherShow extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
  }
  constructor(props) {
    super(props);
    const id = this.props.params;
    this.props.dispatch({type: `voucher/getDetail`,payload: {...id}})
  }
  handlePreview = (url) => {
    this.setState({
      previewImage:url,
      previewVisible: true,
    });
  }
  handleCancel = () => this.setState({previewVisible: false})
  handBack = () => {
    this.props.dispatch(push("/voucher"));
  }
  render() {
    
    const {currentItem = {},fileList} = this.props.voucher;
    const activity =  currentItem.activity?currentItem.activity:{};
    let {previewVisible, previewImage} = this.state;
    return (
      <div className={styles.show_content}>
        <div className="content_item">
          <div className="item_lt">
          <div className="item_name">基本信息</div> 
          </div>
          <div className="item_rt">
            <div className="item_li"><div className="li_name">名称:</div><div className="li_value">{currentItem.name}</div></div>
            <div className="item_li"><div className="li_name">商户:</div><div className="li_value">{currentItem.shop?currentItem.shop.name:''}</div></div>
            <div className="item_li"><div className="li_name">面值（元）:</div><div className="li_value">¥{Func.price(currentItem.value)}</div></div>
            <div className="item_li"><div className="li_name">数量:</div><div className="li_value">{currentItem.sum_count?currentItem.sum_count:0}</div></div>
            <div className="item_li"><div className="li_name">支付方式:</div><div className="li_value">{payTypeText[currentItem.pay_type?currentItem.pay_type:0]}</div></div>
            {currentItem.pay_type!==1?<div className="item_li"><div className="li_name">支付积分:</div><div className="li_value">{currentItem.exch_points?currentItem.exch_points:0}</div></div>:''}
            {currentItem.pay_type!==0?<div className="item_li"><div className="li_name">支付金额（元）:</div><div className="li_value">¥{Func.price(currentItem.price)}</div></div>:''}
            <div className="item_li"><div className="li_name">描述:</div><div className="li_value">{currentItem.desc}</div></div>
            <div className="item_li"><div className="li_name">图片:</div><div className="li_value">
            <div className="img_div">{
              currentItem.img?currentItem.img.split(',').map(img=>{
                return (<img key={img} onClick={e=>{this.handlePreview(img)}} src={img} className="show_img" alt=""/>)
              }):''}</div>
              <Alert message="第一张为封面图" type="warning" showIcon />
              </div></div>
            <div className="item_li"><div className="li_name">启用状态:</div><div className="li_value"><Badge status={statusMap[currentItem.enabled?currentItem.enabled:0]} text={statusText[currentItem.enabled?currentItem.enabled:0]} /></div></div>
          </div>
        </div>
        {currentItem.is_active?
        <div className="content_item">
          <div className="item_lt">
          <div className="item_name">活动信息</div> 
          </div>
          <div className="item_rt">
          <div className="item_li">
            <div className="li_name">活动支付方式:</div><div className="li_value">{payTypeText[activity.pay_type?activity.pay_type:0]}</div></div>
            {activity.pay_type!==1?<div className="item_li"><div className="li_name">活动兑换积分:</div><div className="li_value">{activity.exch_points?activity.exch_points:0}</div></div>:''}
            {activity.pay_type!==0?<div className="item_li"><div className="li_name">活动金额支付（元）:</div><div className="li_value">¥{Func.price(activity.price)}</div></div>:''}
            
            <div className="item_li"><div className="li_name">活动开始时间:</div><div className="li_value">{Func.getDate_ymdhms(activity.start_at)}</div></div>
            <div className="item_li"><div className="li_name">活动结束时间:</div><div className="li_value">{Func.getDate_ymdhms(activity.end_at)}</div></div>
            <div className="item_li"><div className="li_name">活动周期类型:</div><div className="li_value">{activeType[activity.time_type?activity.time_type:0]}</div></div>
            <div className="item_li"><div className="li_name">活动周期:</div><div className="li_value">{
              activity.active_days?activity.active_days.split(',').map(item=>{
                if(activity.time_type===0)return item+'号, ';   
                if(activity.time_type===1)return weeks[item]+", ";
                if(activity.time_type===2)return item+'月, ';   
              }):''

            }</div></div>
          </div>
        </div>
        :''}
        <div className="content_item">
          <div className="item_lt">
            <div className="item_name">审核信息</div> 
          </div>
          <div className="item_rt">
            <div className="item_li"><div className="li_name">审核状态:</div><div className="li_value">{statusArray[currentItem.examine_status]}</div></div>
            <div className="item_li"><div className="li_name">审核人:</div><div className="li_value">{currentItem.examine_person ? currentItem.examine_person.username : '无'}</div></div>
            <div className="item_li"><div className="li_name">审核时间:</div><div className="li_value">{currentItem.examine_time?Func.getDate_ymdhms(currentItem.examine_time):'无'}</div></div>
          </div> 
        </div>
        <div className="content_item">
          <Button className="button" icon="left" type='primary' onClick={this.handBack}>返回</Button>
        </div> 
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    );
  }
}
;

VoucherShow.propTypes = {
  voucher: PropTypes.object,
}
export default connect(({voucher})=>({voucher}))(VoucherShow)

