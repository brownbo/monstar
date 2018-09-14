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
const statusText = ['待上架','已上架'];
const activeType = ['日','周','月'];
const statusArrayExam = ['新申请','申请受理', '审核失败', '审核成功'];
class ShopShow extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
  }
  constructor(props) {
    super(props);
    const id = this.props.params;
    this.props.dispatch({type: `shop/getDetail`,payload: {...id}})
  }
  handlePreview = (url) => {
    this.setState({
      previewImage:url,
      previewVisible: true,
    });
  }
  handleCancel = () => this.setState({previewVisible: false})
  handBack = () => {
    this.props.dispatch(push("/shops"));
  }
  render() {
    const {currentItem = {},fileList} = this.props.shop;
    const activity =  currentItem.activity?currentItem.activity:{};
    let {previewVisible, previewImage} = this.state;
    return (
      <div className={styles.show_content}>
        {currentItem.examine_status===3?
        <div>
        <div className="content_item">
          <div className="item_lt">
          <div className="item_name">基本信息</div> 
          </div>
          <div className="item_rt">
            <div className="item_li"><div className="li_name">名称:</div><div className="li_value">{currentItem.name}</div></div>
            <div className="item_li"><div className="li_name">分类:</div><div className="li_value">{currentItem.shop_type?currentItem.shop_type.name:''}</div></div>
            <div className="item_li"><div className="li_name">注册时间:</div><div className="li_value">{Func.getDate_ymdhms(currentItem.created_at)}</div></div>
            <div className="item_li"><div className="li_name">注册状态:</div><div className="li_value">{currentItem.sign_status?'已注册':'未注册'}</div></div>
            <div className="item_li"><div className="li_name">地址:</div><div className="li_value">{currentItem.address}</div></div>
            <div className="item_li"><div className="li_name">经纬度:</div><div className="li_value">{currentItem.long? `${currentItem.long},${currentItem.lat}`:''}</div></div>
            <div className="item_li"><div className="li_name">推荐商户:</div><div className="li_value">{currentItem.is_recommend ? '是': '否'}</div></div>
            <div className="item_li"><div className="li_name">推荐业务1:</div><div className="li_value">{currentItem.recommend1 ?currentItem.recommend1.name:'无'}</div></div>
            <div className="item_li"><div className="li_name">推荐业务2:</div><div className="li_value">{currentItem.recommend2 ?currentItem.recommend2.name:'无'}</div></div>
            <div className="item_li"><div className="li_name">描述:</div><div className="li_value">{currentItem.desc}</div></div>
            <div className="item_li"><div className="li_name">图片:</div><div className="li_value">
            <div className="img_div">{
              currentItem.shop_img?currentItem.shop_img.split(',').map(img=>{
                return (<img key={img} onClick={e=>{this.handlePreview(img)}} src={img} className="show_img" alt=""/>)
              }):''}</div>
              <Alert message="第一张为封面图" type="warning" showIcon />
              </div></div>
            <div className="item_li"><div className="li_name">商户状态:</div><div className="li_value"><Badge status={statusMap[currentItem.status?currentItem.status:0]} text={statusText[currentItem.status?currentItem.status:0]} /></div></div>
          </div>
        </div>
        <div className="content_item">
          <div className="item_lt">
          <div className="item_name">用户信息</div> 
          </div>
          <div className="item_rt">
            <div className="item_li"><div className="li_name">户名:</div><div className="li_value">{currentItem.account_name}</div></div>
            <div className="item_li"><div className="li_name">账号:</div><div className="li_value">{currentItem.username}</div></div>
            <div className="item_li"><div className="li_name">联系人:</div><div className="li_value">{currentItem.connect_person}</div></div>
            <div className="item_li"><div className="li_name">联系电话:</div><div className="li_value">{currentItem.connect_phone}</div></div>
          </div>
        </div></div>:
        <div>
          <div className="content_item">
            <div className="item_lt">
            <div className="item_name">基本信息</div> 
            </div>
            <div className="item_rt">
              <div className="item_li"><div className="li_name">名称:</div><div className="li_value">{currentItem.name}</div></div>
              <div className="item_li"><div className="li_name">分类:</div><div className="li_value">{currentItem.shop_type?currentItem.shop_type.name:''}</div></div>
              <div className="item_li"><div className="li_name">是否本行商户:</div><div className="li_value">{currentItem.is_thefamily?'是':'否'}</div></div>
              <div className="item_li"><div className="li_name">商户经营人:</div><div className="li_value">{currentItem.connect_person}</div></div>
              <div className="item_li"><div className="li_name">经营范围:</div><div className="li_value">{currentItem.shop_desc}</div></div>
              <div className="item_li"><div className="li_name">联系电话:</div><div className="li_value">{currentItem.connect_phone}</div></div>
              <div className="item_li"><div className="li_name">地址:</div><div className="li_value">{currentItem.address}</div></div>
              <div className="item_li"><div className="li_name">发起时间:</div><div className="li_value">{Func.getDate_ymdhms(currentItem.created_at)}</div></div>
              <div className="item_li"><div className="li_name">营业执照图片:</div><div className="li_value">
                <div className="img_div">{
                  currentItem.business_img?currentItem.business_img.split(',').map(img=>{
                    return (<img key={img} onClick={e=>{this.handlePreview(img)}} src={img} className="show_img" alt=""/>)
                  }):''}</div>
                  </div>
              </div>
              <div className="item_li"><div className="li_name">图片:</div><div className="li_value">
                <div className="img_div">{
                  currentItem.shop_img?currentItem.shop_img.split(',').map(img=>{
                    return (<img key={img} onClick={e=>{this.handlePreview(img)}} src={img} className="show_img" alt=""/>)
                  }):''}</div>
                  <Alert message="第一张为封面图" type="warning" showIcon />
                  </div>
              </div>
              
            </div>
          </div>   
        </div>
      }
      
      <div className="content_item">
        <div className="item_lt">
        <div className="item_name">审核信息</div> 
        </div>
        <div className="item_rt">
          <div className="item_li"><div className="li_name">审核状态:</div><div className="li_value">{statusArrayExam[currentItem.examine_status]} </div></div>
          <div className="item_li"><div className="li_name">审核人:</div><div className="li_value">{(currentItem.examine_status!==0&&currentItem.examine_person)?currentItem.examine_person.username:'暂无'}</div></div>
          <div className="item_li"><div className="li_name">审核时间:</div><div className="li_value">{(currentItem.examine_status!==0&&currentItem.examine_time)?Func.getDate_ymdhms(currentItem.examine_time):'暂无'}</div></div>
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

ShopShow.propTypes = {
  shop: PropTypes.object,
}
export default connect(({shop})=>({shop}))(ShopShow)

