// host
//const host = '192.168.2.121:3000';
//const host = '192.168.99.104:3000';
const host = '123.207.124.91:3000';
const root = `http://${host}`;
const prefix = '/wechat/api'

// api
const api = {
  banners: '/banners',
  goods: '/goods',
  shop: '/shops/:id',
  shops: '/shops',
  gifts: '/gifts',
  gift: '/gifts/:id',
  giftTypes: '/giftTypes',

  shopTypes: '/shopTypes',

  staff: '/staffs/:id',
  staffPwd: '/staffChangePass/:id',
  customer: '/customers/:id',
  merchant: '/customers/:id',
  merchantPwd: '/merchantChangePass/:id',
  //----zyh----
  merchantIndex: '/ordersSum',
  customerDetail: '/customerDetail',
  customerDetailList: '/customerDetailList',
  merchantDetailList: '/merchantDetailList',
  merchantDetail: '/merchantDetail',
  //----zyh----
  orders: '/orders',
  order: '/orders/:id',
  ordersStat: '/ordersStat',
  stocks: '/stock',
  stockRec: '/stockRec/:id',
  stockRecs: '/stockRec',

  examines: '/examines',
  examine: '/examines/:id',
  netspots: '/netSpots',

  giftEvals: '/evaluateGifts',

  goodsEvals: '/evaluateGoods',
  upload: '/upload',

  business: '/businessRecommends',
  vouchers: '/vouchers',
  voucher: '/vouchers/:id',

  //告知书
  notification: '/notification/:id',
  notifications: '/notification',

  shopTypes: '/shopTypes',

  customerLogin: '/customerLogin',
  customerSign: '/customerRegister ',
  merchantLogin: '/merchantLogin',
  // merchants: '/getMerchantListByPhone',
  customerList: '/getCustomerListByPhone',
  merchantSign: '/merchantRegister',
  staffLogin: '/staff/login',

  currentCustomer: '/getCurrentCus',
  currentMerchant: '/getCurrentMer',
  currentStaff: '/getCurrentStaff',

  openid: '/onLogin',
  resetCus: '/forgetPass',
  resetMer: '/forgetMerchantPass',

  payback: '/payback',
  payfront: '/payfront',

  // 支付相关接口
  payment: {
    pay: 'https://wsnx.artisangroup.cn/payment'
  },

  // 退款
  refund: '/refund/:id',

  // 短信
  sendSms: '/sendSmsApi',
  checkSms: '/checkAuthCodeApi'
};

for (let key in api) {
  if (typeof api[key] === 'string')
    api[key] = root + prefix + api[key];
}

export {
  host,
  root,
  prefix,
  api
};