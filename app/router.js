'use strict';
module.exports = app => {

  app.get('/admin/', 'user.showAdmin');
  app.get('/admin/api/areas', 'area.list');
  app.get('/admin/api/areas/:id', 'area.show');
  app.post('/admin/api/areas/', 'area.create');
  app.put('/admin/api/areas/:id', 'area.update');
  app.delete('/admin/api/areas/', 'area.destroy');
  app.delete('/admin/api/areas/:id', 'area.destroy');
  //customer
  app.get('/admin/api/customers', 'customer.list');
  app.get('/admin/api/customers/:id', 'customer.show');
  app.post('/admin/api/customers/', 'customer.create');
  app.put('/admin/api/customers/:id', 'customer.update');
  app.delete('/admin/api/customers/', 'customer.destroy');
  app.delete('/admin/api/customers/:id', 'customer.destroy');
  //shop

  app.get('/admin/api/shops', 'shop.list');
  app.get('/admin/api/shops/:id', 'shop.show');
  app.post('/admin/api/shops/', 'shop.create');
  app.put('/admin/api/shops/:id', 'shop.update');
  app.delete('/admin/api/shops/', 'shop.destroy');
  app.delete('/admin/api/shops/:id', 'shop.destroy');
  //shopType
  app.get('/admin/api/shopTypes', 'shopType.list');
  app.get('/admin/api/shopTypes/:id', 'shopType.show');
  app.post('/admin/api/shopTypes/', 'shopType.create');
  app.put('/admin/api/shopTypes/:id', 'shopType.update');
  app.delete('/admin/api/shopTypes/', 'shopType.destroy');
  app.delete('/admin/api/shopTypes/:id', 'shopType.destroy');
  //good
  app.get('/admin/api/goods', 'goods.list');
  app.get('/admin/api/goods/:id', 'goods.show');
  app.post('/admin/api/goods/', 'goods.create');
  app.put('/admin/api/goods/:id', 'goods.update');
  app.delete('/admin/api/goods/', 'goods.destroy');
  app.delete('/admin/api/goods/:id', 'goods.destroy');
  //banner
  app.get('/admin/api/banners', 'banner.list');
  app.get('/admin/api/banners/:id', 'banner.show');
  app.post('/admin/api/banners/', 'banner.create');
  app.put('/admin/api/banners/:id', 'banner.update');
  app.delete('/admin/api/banners/', 'banner.destroy');
  app.delete('/admin/api/banners/:id', 'banner.destroy');
  //businessRecommend
  app.get('/admin/api/businessRecommends', 'businessRecommend.list');
  app.get('/admin/api/businessRecommends/:id', 'businessRecommend.show');
  app.post('/admin/api/businessRecommends/', 'businessRecommend.create');
  app.put('/admin/api/businessRecommends/:id', 'businessRecommend.update');
  app.delete('/admin/api/businessRecommends/', 'businessRecommend.destroy');
  app.delete('/admin/api/businessRecommends/:id', 'businessRecommend.destroy');
  //gifts
  app.get('/admin/api/gifts', 'gift.list');
  app.get('/admin/api/gifts/:id', 'gift.show');
  app.post('/admin/api/gifts/', 'gift.create');
  app.put('/admin/api/gifts/:id', 'gift.update');
  app.delete('/admin/api/gifts/', 'gift.destroy');
  app.delete('/admin/api/gifts/:id', 'gift.destroy');
  //giftType
  app.get('/admin/api/giftTypes', 'giftType.list');
  app.get('/admin/api/giftTypes/:id', 'giftType.show');
  app.post('/admin/api/giftTypes/', 'giftType.create');
  app.put('/admin/api/giftTypes/:id', 'giftType.update');
  app.delete('/admin/api/giftTypes/', 'giftType.destroy');
  app.delete('/admin/api/giftTypes/:id', 'giftType.destroy');
  //evalGifts
  app.get('/admin/api/evaluateGifts', 'evaluateGift.list');
  app.get('/admin/api/evaluateGifts/:id', 'evaluateGift.show');
  app.post('/admin/api/evaluateGifts/', 'evaluateGift.create');
  app.put('/admin/api/evaluateGifts/:id', 'evaluateGift.update');
  app.delete('/admin/api/evaluateGifts/', 'evaluateGift.destroy');
  app.delete('/admin/api/evaluateGifts/:id', 'evaluateGift.destroy');
  app.get('/admin/api/evalGiftsToExcel', 'evaluateGift.exportExcel');//
  //evalGoods
  app.get('/admin/api/evaluateGoods', 'evaluateGoods.list');
  app.get('/admin/api/evaluateGoods/:id', 'evaluateGoods.show');
  app.post('/admin/api/evaluateGoods/', 'evaluateGoods.create');
  app.put('/admin/api/evaluateGoods/:id', 'evaluateGoods.update');
  app.delete('/admin/api/evaluateGoods/', 'evaluateGoods.destroy');
  app.delete('/admin/api/evaluateGoods/:id', 'evaluateGoods.destroy');
  app.get('/admin/api/evalGoodsToExcel', 'evaluateGoods.exportExcel');//
  //examine
  app.get('/admin/api/examines', 'examine.list');
  app.get('/admin/api/examines/:id', 'examine.show');
  app.post('/admin/api/examines/', 'examine.create');
  app.put('/admin/api/examines/:id', 'examine.update');
  app.delete('/admin/api/examines/', 'examine.destroy');
  app.delete('/admin/api/examines/:id', 'examine.destroy');
  //netSpots
  app.get('/admin/api/netSpots', 'netSpot.list');
  app.get('/admin/api/netSpots/:id', 'netSpot.show');
  app.post('/admin/api/netSpots/', 'netSpot.create');
  app.put('/admin/api/netSpots/:id', 'netSpot.update');
  app.delete('/admin/api/netSpots/', 'netSpot.destroy');
  app.delete('/admin/api/netSpots/:id', 'netSpot.destroy');
  //orders
  app.get('/admin/api/orders', 'orders.list');
  app.get('/admin/api/ordersToExcel', 'orders.exportExcel');//

  app.get('/admin/api/orders/:id', 'orders.show');
  app.post('/admin/api/orders/', 'orders.create');
  app.put('/admin/api/orders/:id', 'orders.update');
  app.delete('/admin/api/orders/', 'orders.destroy');
  app.delete('/admin/api/orders/:id', 'orders.destroy');
  //roles
  app.get('/admin/api/roles', 'role.list');
  app.get('/admin/api/roles/:id', 'role.show');
  app.post('/admin/api/roles/', 'role.create');
  app.put('/admin/api/roles/:id', 'role.update');
  app.delete('/admin/api/roles/', 'role.destroy');
  app.delete('/admin/api/roles/:id', 'role.destroy');
  //stock
  app.get('/admin/api/stock', 'stock.list');
  app.get('/admin/api/stock/:id', 'stock.show');
  app.post('/admin/api/stock/', 'stock.create');
  app.put('/admin/api/stock/:id', 'stock.update');
  app.delete('/admin/api/stock/', 'stock.destroy');
  app.delete('/admin/api/stock/:id', 'stock.destroy');
  //stockRec
  app.get('/admin/api/stockRec', 'stockRec.list');
  app.get('/admin/api/stockRec/:id', 'stockRec.show');
  app.post('/admin/api/stockRec/', 'stockRec.create');
  app.put('/admin/api/stockRec/:id', 'stockRec.update');
  app.delete('/admin/api/stockRec/', 'stockRec.destroy');
  app.delete('/admin/api/stockRec/:id', 'stockRec.destroy');
  //voucher
  app.get('/admin/api/vouchers', 'voucher.list');
  app.get('/admin/api/vouchers/:id', 'voucher.show');
  app.post('/admin/api/vouchers/', 'voucher.create');
  app.put('/admin/api/vouchers/:id', 'voucher.update');
  app.delete('/admin/api/vouchers/', 'voucher.destroy');
  app.delete('/admin/api/vouchers/:id', 'voucher.destroy');
  //staff
  app.post('/admin/api/staff/login', 'staff.login');
  app.post('/admin/api/staff/changePass', 'staff.changePass');
  app.get('/admin/api/staffs', 'staff.list');
  app.get('/admin/api/staffs/:id', 'staff.show');
  app.post('/admin/api/staffs/', 'staff.create');
  app.put('/admin/api/staffs/:id', 'staff.update');
  app.delete('/admin/api/staffs/', 'staff.destroy');
  app.delete('/admin/api/staffs/:id', 'staff.destroy');
  //merchants
  app.get('/admin/api/merchants', 'merchant.list');
  app.get('/admin/api/merchants/:id', 'merchant.show');
  app.post('/admin/api/merchants/', 'merchant.create');
  app.put('/admin/api/merchants/:id', 'merchant.update');
  app.delete('/admin/api/merchants/', 'merchant.destroy');
  app.delete('/admin/api/merchants/:id', 'merchant.destroy');
  //giftSign
  app.get('/admin/api/giftSign', 'giftSign.list');
  app.get('/admin/api/giftSign/:id', 'giftSign.show');
  app.post('/admin/api/giftSign/', 'giftSign.create');
  app.put('/admin/api/giftSign/:id', 'giftSign.update');
  app.delete('/admin/api/giftSign/', 'giftSign.destroy');
  app.delete('/admin/api/giftSign/:id', 'giftSign.destroy');
  //notification
  app.get('/admin/api/notification', 'notification.list');
  app.get('/admin/api/notification/:id', 'notification.show');
  app.post('/admin/api/notification/', 'notification.create');
  app.put('/admin/api/notification/:id', 'notification.update');
  app.delete('/admin/api/notification/', 'notification.destroy');
  app.delete('/admin/api/notification/:id', 'notification.destroy');
  //user
  app.get('/admin/api/users', 'user.list');
  app.get('/admin/api/users/:id', 'user.show');
  app.post('/admin/api/users/', 'user.create');
  app.put('/admin/api/users/:id', 'user.update');
  app.delete('/admin/api/users/', 'user.destroy');
  app.delete('/admin/api/users/:id', 'user.destroy');
  //businessSettlement
  app.post('/admin/api/uploadAndSettle', 'businessSettlement.uploadAndSettle');
  app.get('/admin/api/businessSettlement', 'businessSettlement.list');
  app.get('/admin/api/businessSettlement/:id', 'businessSettlement.show');
  app.post('/admin/api/businessSettlement/', 'businessSettlement.create');
  app.put('/admin/api/businessSettlement/:id', 'businessSettlement.update');
  app.delete('/admin/api/businessSettlement/', 'businessSettlement.destroy');
  app.delete('/admin/api/businessSettlement/:id', 'businessSettlement.destroy');
    //settleTable

  app.get('/admin/api/settlesStat', 'settleTable.stat');
  app.get('/admin/api/settles', 'settleTable.list');
  app.get('/admin/api/settles/:id', 'settleTable.show');
  app.post('/admin/api/settles/', 'settleTable.create');
  app.put('/admin/api/settles/:id', 'settleTable.update');
  app.delete('/admin/api/settles/', 'settleTable.destroy');
  app.delete('/admin/api/settles/:id', 'settleTable.destroy');
  //activity
  app.get('/admin/api/activity', 'activity.list');
  app.get('/admin/api/activity/:id', 'activity.show');
  app.post('/admin/api/activity/', 'activity.create');
  app.put('/admin/api/activity/:id', 'activity.update');
  app.delete('/admin/api/activity/', 'activity.destroy');
  app.delete('/admin/api/activity/:id', 'activity.destroy');
    //user
  app.post('/api/login', 'user.login'); //登录接口
  app.put('/admin/api/changePass/:id', 'user.changePass'); //修改密码
  app.get('/admin/api/getCurrent', 'user.getCurrent'); //获取当前
  app.post('/admin/api/logout', 'user.logout'); //注销

    /*获取短信*/
    app.get('/wechat/api/sendSmsApi', 'user.sendSmsApi'); //获取短信
    app.get('/wechat/api/checkAuthCodeApi', 'user.checkAuthCodeApi'); //验证短信
  //staff
  app.put('/wechat/api/staffChangePass/:id','staff.changePass')
  //uploadA
  app.post('/admin/api/upload', 'upload.upload'); //上传接口
  //


  //

  //wechat
    app.get('/wechat/api/onLogin', 'customer.onLogin'); //小程序获取微信openid
    app.get('/wechat/api/payment', 'orders.payment'); //支付前端
    app.get('/payment', 'orders.payment'); //支付前端
    app.get('/wechat/api/payfront', 'orders.payfront'); //支付前端
    app.all('/wechat/api/payback', 'orders.payback'); //支付后台
    app.put('/wechat/api/refund/:id', 'orders.refund'); //支付后台
    app.post('/wechat/api/upload', 'upload.upload'); //上传接口
    //SKAPI
    //商户客户登录
    app.get('/wechat/api/getCustomerListByPhone','customer.getMerchantListByPhone');//登录时候商户列表
    app.post('/wechat/api/forgetPass','customer.forgetPass');//忘记密码
    app.post('/wechat/api/customerLogin','customer.judgeCusOrMerForLogin');//客户登录
    app.get('/wechat/api/getCurrentCus', 'customer.judgeCusOrMerForGetCurrent');//获取当前客户信息

    app.post('/wechat/api/customerRegister','customer.judgeCusOrMerForRegister');//客户注册
    app.get('/wechat/api/customerDetailList','customer.detailList');//客户积分详细信息
   // app.get('/wechat/api/checkCustomer','customer.checkCustomer');//检测客户是否存在
   // app.post('/wechat/api/customerResetPwd','customer.resetPwd');//客户重置密码

   // app.post('/wechat/api/exchangeScore','customer.exchangeScore');//客户兑换积分
   // app.get('/wechat/api/customerDetail','customer.customerDetail');//客户兑换积分



    app.get('/wechat/api/test', 'shop.test');

    //注册不管先
    app.put('/wechat/api/merchantChangePass/:id', 'merchant.changePass');  //用put改密码
    app.post('/wechat/api/merchantLogin', 'merchant.login');
    app.get('/wechat/api/getCurrentMer', 'merchant.getCurrent');
    //商户客户登录
/*

    app.post('/wechat/api/merchantRegister','customer.merchantRegister');//商户注册
    app.post('/wechat/api/merchantLogin','customer.merchantLogin');//商户登录
    app.get('/wechat/api/checkMerchant','customer.checkMerchant');//检测商户是否存在
    app.post('/wechat/api/merchantResetPwd','customer.merchantResetPwd');//商户重置密码
    app.get('/wechat/api/merchantDetailList','customer.merchantDetailList');//商户积分详细信息
    app.post('/wechat/api/merchantExchangeScore','customer.merchantExchangeScore');//商户兑换积分
    app.get('/wechat/api/merchantDetail','customer.merchantDetail');//商户兑换积分

    app.post('/wechat/api/forgetPass','customer.forgetPass');//商户重置密码*/
    app.post('/wechat/api/merchantRegister','merchant.sign');//商户注册
    app.post('/wechat/api/userSignUp','user.userRegister');//用户注册
    //good
    app.get('/wechat/api/areas', 'area.list');
    app.get('/wechat/api/areas/:id', 'area.show');
    app.post('/wechat/api/areas/', 'area.create');
    app.put('/wechat/api/areas/:id', 'area.update');
    app.delete('/wechat/api/areas/', 'area.destroy');
    app.delete('/wechat/api/areas/:id', 'area.destroy');
    //customer

    app.get('/wechat/api/checkMerchantExist', 'customer.checkMerchantExist');
    app.get('/wechat/api/customers', 'customer.list');
    app.get('/wechat/api/customers/:id', 'customer.show');
    app.post('/wechat/api/customers/', 'customer.create');
    app.put('/wechat/api/customers/:id', 'customer.update');
    app.delete('/wechat/api/customers/', 'customer.destroy');
    app.delete('/wechat/api/customers/:id', 'customer.destroy');
    //shop
    app.get('/wechat/api/shops', 'shop.list');
    app.get('/wechat/api/shops/:id', 'shop.show');
    app.post('/wechat/api/shops/', 'shop.create');
    app.put('/wechat/api/shops/:id', 'shop.update');
    app.delete('/wechat/api/shops/', 'shop.destroy');
    app.delete('/wechat/api/shops/:id', 'shop.destroy');
    //shopType
    app.get('/wechat/api/shopTypes', 'shopType.list');
    app.get('/wechat/api/shopTypes/:id', 'shopType.show');
    app.post('/wechat/api/shopTypes/', 'shopType.create');
    app.put('/wechat/api/shopTypes/:id', 'shopType.update');
    app.delete('/wechat/api/shopTypes/', 'shopType.destroy');
    app.delete('/wechat/api/shopTypes/:id', 'shopType.destroy');
    //good
    app.get('/wechat/api/goods', 'goods.list');
    app.get('/wechat/api/goods/:id', 'goods.show');
    app.post('/wechat/api/goods/', 'goods.create');
    app.put('/wechat/api/goods/:id', 'goods.update');
    app.delete('/wechat/api/goods/', 'goods.destroy');
    app.delete('/wechat/api/goods/:id', 'goods.destroy');
    //banner
    app.get('/wechat/api/banners', 'banner.list');
    app.get('/wechat/api/banners/:id', 'banner.show');
    app.post('/wechat/api/banners/', 'banner.create');
    app.put('/wechat/api/banners/:id', 'banner.update');
    app.delete('/wechat/api/banners/', 'banner.destroy');
    app.delete('/wechat/api/banners/:id', 'banner.destroy');
    //businessRecommend
    app.get('/wechat/api/businessRecommends', 'businessRecommend.list');
    app.get('/wechat/api/businessRecommends/:id', 'businessRecommend.show');
    app.post('/wechat/api/businessRecommends/', 'businessRecommend.create');
    app.put('/wechat/api/businessRecommends/:id', 'businessRecommend.update');
    app.delete('/wechat/api/businessRecommends/', 'businessRecommend.destroy');
    app.delete('/wechat/api/businessRecommends/:id', 'businessRecommend.destroy');
    //gifts
    app.get('/wechat/api/gifts', 'gift.list');
    app.get('/wechat/api/gifts/:id', 'gift.show');
    app.post('/wechat/api/gifts/', 'gift.create');
    app.put('/wechat/api/gifts/:id', 'gift.update');
    app.delete('/wechat/api/gifts/', 'gift.destroy');
    app.delete('/wechat/api/gifts/:id', 'gift.destroy');
    //giftType
    app.get('/wechat/api/giftTypes', 'giftType.list');
    app.get('/wechat/api/giftTypes/:id', 'giftType.show');
    app.post('/wechat/api/giftTypes/', 'giftType.create');
    app.put('/wechat/api/giftTypes/:id', 'giftType.update');
    app.delete('/wechat/api/giftTypes/', 'giftType.destroy');
    app.delete('/wechat/api/giftTypes/:id', 'giftType.destroy');
    //evalGifts
    app.get('/wechat/api/evaluateGifts', 'evaluateGift.list');
    app.get('/wechat/api/evaluateGifts/:id', 'evaluateGift.show');
    app.post('/wechat/api/evaluateGifts/', 'evaluateGift.create');
    app.put('/wechat/api/evaluateGifts/:id', 'evaluateGift.update');
    app.delete('/wechat/api/evaluateGifts/', 'evaluateGift.destroy');
    app.delete('/wechat/api/evaluateGifts/:id', 'evaluateGift.destroy');
    //evalGoods
    app.get('/wechat/api/evaluateGoods', 'evaluateGoods.list');
    app.get('/wechat/api/evaluateGoods/:id', 'evaluateGoods.show');
    app.post('/wechat/api/evaluateGoods/', 'evaluateGoods.create');
    app.put('/wechat/api/evaluateGoods/:id', 'evaluateGoods.update');
    app.delete('/wechat/api/evaluateGoods/', 'evaluateGoods.destroy');
    app.delete('/wechat/api/evaluateGoods/:id', 'evaluateGoods.destroy');

    //examine
    app.get('/wechat/api/examines', 'examine.list');
    app.get('/wechat/api/examines/:id', 'examine.show');
    app.post('/wechat/api/examines/', 'examine.create');
    app.put('/wechat/api/examines/:id', 'examine.update');
    app.delete('/wechat/api/examines/', 'examine.destroy');
    app.delete('/wechat/api/examines/:id', 'examine.destroy');
    //netSpots
    app.get('/wechat/api/netSpots', 'netSpot.list');
    app.get('/wechat/api/netSpots/:id', 'netSpot.show');
    app.post('/wechat/api/netSpots/', 'netSpot.create');
    app.put('/wechat/api/netSpots/:id', 'netSpot.update');
    app.delete('/wechat/api/netSpots/', 'netSpot.destroy');
    app.delete('/wechat/api/netSpots/:id', 'netSpot.destroy');
    //orders
    app.get('/wechat/api/orders', 'orders.list');
    app.get('/wechat/api/ordersSum/:shopId/', 'orders.sum');
    app.get('/wechat/api/ordersStat', 'orders.stat');
    app.get('/wechat/api/orders/:id', 'orders.show');
    app.post('/wechat/api/orders/', 'orders.create');
    app.put('/wechat/api/orders/:id', 'orders.update');
    app.delete('/wechat/api/orders/', 'orders.destroy');
    app.delete('/wechat/api/orders/:id', 'orders.destroy');
    //roles
    app.get('/wechat/api/roles', 'role.list');
    app.get('/wechat/api/roles/:id', 'role.show');
    app.post('/wechat/api/roles/', 'role.create');
    app.put('/wechat/api/roles/:id', 'role.update');
    app.delete('/wechat/api/roles/', 'role.destroy');
    app.delete('/wechat/api/roles/:id', 'role.destroy');
    //stock
    app.get('/wechat/api/stock', 'stock.list');
    app.get('/wechat/api/stock/:id', 'stock.show');
    app.post('/wechat/api/stock/', 'stock.create');
    app.put('/wechat/api/stock/:id', 'stock.update');
    app.delete('/wechat/api/stock/', 'stock.destroy');
    app.delete('/wechat/api/stock/:id', 'stock.destroy');
    //stockRec
    app.get('/wechat/api/stockRec', 'stockRec.list');
    app.get('/wechat/api/stockRec/:id', 'stockRec.show');
    app.post('/wechat/api/stockRec/', 'stockRec.create');
    app.put('/wechat/api/stockRec/:id', 'stockRec.update');
    app.delete('/wechat/api/stockRec/', 'stockRec.destroy');
    app.delete('/wechat/api/stockRec/:id', 'stockRec.destroy');
    //voucher
    app.get('/wechat/api/vouchers', 'voucher.list');
    app.get('/wechat/api/vouchers/:id', 'voucher.show');
    app.post('/wechat/api/vouchers/', 'voucher.create');
    app.put('/wechat/api/vouchers/:id', 'voucher.update');
    app.delete('/wechat/api/vouchers/', 'voucher.destroy');
    app.delete('/wechat/api/vouchers/:id', 'voucher.destroy');
    //staff
    app.get('/wechat/api/getCurrentStaff', 'staff.getCurrent');
    app.post('/wechat/api/staff/login', 'staff.login');
    app.get('/wechat/api/staffs', 'staff.list');
    app.get('/wechat/api/staffs/:id', 'staff.show');
    app.post('/wechat/api/staffs/', 'staff.create');
    app.put('/wechat/api/staffs/:id', 'staff.update');
    app.delete('/wechat/api/staffs/', 'staff.destroy');
    app.delete('/wechat/api/staffs/:id', 'staff.destroy');
    //merchants


    app.post('/wechat/api/forgetMerchantPass','merchant.forgetPass');//忘记密码
    app.get('/wechat/api/merchants', 'merchant.list');
    app.get('/wechat/api/merchants/:id', 'merchant.show');
    app.post('/wechat/api/merchants/', 'merchant.create');
    app.put('/wechat/api/merchants/:id', 'merchant.update');
    app.delete('/wechat/api/merchants/', 'merchant.destroy');
    app.delete('/wechat/api/merchants/:id', 'merchant.destroy');
    //giftSign
    app.get('/wechat/api/giftSign', 'giftSign.list');
    app.get('/wechat/api/giftSign/:id', 'giftSign.show');
    app.post('/wechat/api/giftSign/', 'giftSign.create');
    app.put('/wechat/api/giftSign/:id', 'giftSign.update');
    app.delete('/wechat/api/giftSign/', 'giftSign.destroy');
    app.delete('/wechat/api/giftSign/:id', 'giftSign.destroy');
    //notification
    app.get('/wechat/api/notification', 'notification.list');
    app.get('/wechat/api/notification/:id', 'notification.show');
    app.post('/wechat/api/notification/', 'notification.create');
    app.put('/wechat/api/notification/:id', 'notification.update');
    app.delete('/wechat/api/notification/', 'notification.destroy');
    app.delete('/wechat/api/notification/:id', 'notification.destroy');

    //activity
    app.get('/wechat/api/activity', 'activity.list');
    app.get('/wechat/api/activity/:id', 'activity.show');
    app.post('/wechat/api/activity/', 'activity.create');
    app.put('/wechat/api/activity/:id', 'activity.update');
    app.delete('/wechat/api/activity/', 'activity.destroy');
    app.delete('/wechat/api/activity/:id', 'activity.destroy');
};