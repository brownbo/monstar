import React from 'react';
import {Router, Route} from 'dva/router';


/**component**/
//App
import App from './routes/app'


/*礼品管理*/
import Area from './routes/Area'
import Netspot from './routes/Netspot'
import Gift_type from './routes/Gift_type'
import Gift from './routes/Gift'
import GiftDetail from './routes/Gift/Detail'
import GiftShow from './routes/Gift/Show'

import EvalGifts from './routes/EvalGifts'
import EvalGiftsDetail from './routes/EvalGifts/Detail'
import Gift_sign from './routes/Gift_sign'

/*库存管理*/
import Stock from './routes/Stock'
import StockRec from './routes/StockRec'
import Examine from './routes/Examine'

/*商户管理*/
import Shop from './routes/Shop'
import ShopDetail  from './routes/Shop/Detail'
import ShopShow  from './routes/Shop/Show'
import Shop_type from './routes/Shop_type'
import Goods from './routes/Goods'
import GoodsDetail from './routes/Goods/Detail'
import GoodsShow from './routes/Goods/Show'
import Voucher from './routes/Voucher'
import VoucherDetail from './routes/Voucher/Detail'
import VoucherShow  from './routes/Voucher/Show'
import EvalGoods from './routes/EvalGoods'
import EvalGoodsDetail from './routes/EvalGoods/Detail'

/*商户申请管理*/
import Notification from './routes/Notification'

/*系统管理*/
import Banner from './routes/Banner'
import Customer from './routes/Customer'
import Role from './routes/Role'

import Staff from './routes/Staff'
import Merchant from './routes/Merchant'

import User from './routes/User'



/*业务推荐管理*/
import BusinessReconmmend from './routes/BusinessRecommend'
import BusinessDetail from './routes/BusinessRecommend/Detail'

/*积分兑换商户结算*/
import Shop_interval from './routes/Shop_interval'
import Shop_settlement from './routes/Shop_settlement'
import ShopsettleTable from './routes/ShopsettleTable'
import UnShopsettle from './routes/UnShopsettle'


/*订单管理*/
import Order from './routes/Order'
import OrderShow from './routes/Order/Show'

/*404page*/
import Error from './routes/error'


const routerMenu = [{
  path:'/',
  breadcrumbName:'首页',
  component:App,
  child:[{
    path:'/areas',
    breadcrumbName:'区域管理',
    component:Area,
  },{
    path:'/netspot',
    breadcrumbName:'网点管理',
    component:Netspot,
  },{
    path:'/gifttype',
    breadcrumbName:'礼品分类',
    component:Gift_type,
  },{
    path:'/gift',
    breadcrumbName:'礼品列表',
    component:Gift,
    child:[{
      path:'/gift/add',
      breadcrumbName:'礼品增加',
      component:GiftDetail,
    },{
      path:'/gift/:id',
      breadcrumbName:'礼品编辑',
      component:GiftDetail,
    },{
      path:'/gift/show/:id',
      breadcrumbName:'礼品详情',
      component:GiftShow,
    }]
  },{
    path:'/giftsign',
    breadcrumbName:'礼品签收查询',
    component:Gift_sign,
  },{
    path:'/giftsevaluate',
    breadcrumbName:'礼品评价',
    component:EvalGifts,
    child:[{
      path:'/giftsevaluate/:id',
      breadcrumbName:'礼品回复',
      component:EvalGiftsDetail,
    }]
  },{
    path:'/giftsstorage',
    breadcrumbName:'礼品库存查询',
    component:Stock,
  },{
    path:'/giftsstockrec',
    breadcrumbName:'调拨明细表',
    component:StockRec,
  },{
    path:'/giftapplycheck',
    breadcrumbName:'礼品申请审核',
    component:Examine,
  },{
    path:'/shoptype',
    breadcrumbName:'商户分类',
    component:Shop_type,
  },{
    path:'/notification',
    breadcrumbName:'商户告知书',
    component:Notification,
  },{
    path:'/shops',
    breadcrumbName:'商户列表',
    component:Shop,
    child:[{
      path:'/Shops/add',
      breadcrumbName:'商户增加',
      component:ShopDetail,
    },{
      path:'/Shops/:id',
      breadcrumbName:'商户编辑',
      component:ShopDetail,
    },{
      path:'/Shops/show/:id',
      breadcrumbName:'商户详情',
      component:ShopShow,
    }]
  },{
    path:'goods',
    breadcrumbName:'商品列表',
    component:Goods,
    child:[{
      path:'/goods/add',
      breadcrumbName:'商品增加',
      component:GoodsDetail,
    },{
      path:'/goods/:id',
      breadcrumbName:'商品编辑',
      component:GoodsDetail,
    },{
      path:'/goods/show/:id',
      breadcrumbName:'商品详情',
      component:GoodsShow,
    }]
  },{
    path:'/shopinterval',
    breadcrumbName:'结算周期设置',
    component:Shop_interval,
  },{
    path:'/shopsettlement',
    breadcrumbName:'结算周期设置',
    component:Shop_settlement,
  },{
    path:'/shopsettleTable',
    breadcrumbName:'商户结算明细',
    component:ShopsettleTable,
  },{
    path:'/unshopsettle',
    breadcrumbName:'未结算',
    component:UnShopsettle,
  },{
    path:'/bussiness',
    breadcrumbName:'推荐业务',
    component:BusinessReconmmend,
    child:[{
      path:'/bussiness/add',
      breadcrumbName:'推荐业务增加',
      component:BusinessDetail,
    }, {
      path:'/bussiness/:id',
      breadcrumbName:'推荐业务编辑',
      component:BusinessDetail,
    }]
  },{
    path:'/shopevaluate',
    breadcrumbName:'商品评价',
    component:EvalGoods,
    child:[{
      path:'/shopevaluate/:id',
      breadcrumbName:'商品回复',
      component:EvalGoodsDetail,
    }]
  },{
    path:'/voucher',
    breadcrumbName:'代金券列表',
    component:Voucher,
    child:[{
      path:'/voucher/add',
      breadcrumbName:'代金券增加',
      component:VoucherDetail,
    },{
      path:'/voucher/:id',
      breadcrumbName:'代金券编辑',
      component:VoucherDetail,
    },{
      path:'/voucher/show/:id',
      breadcrumbName:'代金券详情',
      component:VoucherShow,
    }]
  },{
    path:'/banner',
    breadcrumbName:'Banner列表',
    component:Banner,
  },{
    path:'/customer',
    breadcrumbName:'客户列表',
    component:Customer,
  },{
    path:'/user',
    breadcrumbName:'系统用户列表',
    component:User,
  },{
    path:'/role',
    breadcrumbName:'角色列表',
    component:Role,
  },{
    path:'/staff',
    breadcrumbName:'员工列表',
    component:Staff,
  },{
    path:'/merchants',
    breadcrumbName:'网点员工',
    component:Merchant,
  },{
    path:'/orders',
    breadcrumbName:'订单列表',
    component:Order,
    child:[{
      path:'/orders/show/:id',
      breadcrumbName:'订单详情',
      component:OrderShow,
    }]
  },{
    path:'*',
    breadcrumbName:'',
    component:Error,
  }]
}];
//生成路由
const createRounte = (router,history)=>{
  const getRoute = (item)=>{
    return item.map(obj=>{
      if(obj.child){
        return (<Route key={obj.breadcrumbName}  path={obj.path} breadcrumbName={obj.breadcrumbName} component={obj.component}>
          {getRoute(obj.child)}
        </Route>)
      }
      return <Route key={obj.breadcrumbName} path={obj.path} breadcrumbName={obj.breadcrumbName} component={obj.component}/>
    })
  }

  return (<Router history={history}>{getRoute(router)}</Router>);

}

const RouterConfig = ({history}) =>{return (createRounte(routerMenu,history))}
export default RouterConfig;
