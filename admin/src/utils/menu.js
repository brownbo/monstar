// 定义siderbar菜单
const Menu = [
  // {
  //   key: 'RecommendBusinessMenu',  // route时url中的值
  //   name: '推荐业务管理',  // 在菜单中显示的名称
  //   icon: 'file-text',  // 图标是可选的
  //   router: '/bussiness',
  // },
  // {
  //   key: 'GiftsMenu',  // route时url中的值
  //   name: '礼品管理',  // 在菜单中显示的名称
  //   icon: 'gift',  // 图标是可选的
  //   child: [
  //     {
  //       parent: ['GiftsMenu'],
  //       key: 'GiftType',
  //       name: '礼品分类与预警',
  //       icon: 'filter',
  //       router: '/gifttype',
  //     },
  //     {
  //       parent: ['GiftsMenu'],
  //       key: 'Gift',
  //       name: '礼品信息',
  //       icon: 'gift',
  //       router: '/gift',
  //     },
  //     {
  //       parent: ['GiftsMenu'],
  //       key: 'Netspot',
  //       name: '兑换网点管理',
  //       icon: 'share-alt',
  //       router: '/netspot',
  //     },
  //     {
  //       parent: ['GiftsMenu'],
  //       key: 'Area',
  //       name: '网点区域管理',
  //       icon: 'global',
  //       router: '/areas',
  //     },
  //     {
  //       parent: ['GiftsMenu'],
  //       key: 'GiftsEvaluate',
  //       name: '礼品评价',
  //       icon: 'star-o',
  //       router: '/giftsevaluate',
  //     },
  //   ],
  // },
  // {
  //   key: 'StockMenu',
  //   name: '库存管理',
  //   icon: 'database',
  //   child: [
  //     {
  //       parent: ['StockMenu'],
  //       key: 'GiftsStorage',
  //       name: '礼品库存查询',
  //       icon: 'database',
  //       router: '/giftsstorage',
  //     },
  //     {
  //       parent: ['StockMenu'],
  //       key: 'GiftsApplyCheck',
  //       name: '礼品申请审核',
  //       icon: 'inbox',
  //       router: '/giftapplycheck',
  //     },
  //     {
  //       parent: ['StockMenu'],
  //       key: 'GiftSign',
  //       name: '礼品签收查询',
  //       icon: 'edit',
  //       router: '/giftsign',
  //     },
  //     {
  //       parent: ['StockMenu'],
  //       key: 'GiftsInventoryDetails',
  //       name: '调拨明细表',
  //       icon: 'search',
  //       router: '/giftsstockrec',
  //     }
  //   ],
  // },
  // {
  //   key: 'ShopMenu',
  //   name: '商户管理',
  //   icon: 'shop',
  //   child: [
  //     {
  //       parent: ['ShopMenu'],
  //       key: 'ShopType',
  //       name: '商户分类',
  //       icon: 'filter',
  //       router: '/shoptype',
  //     },
  //     {
  //       parent: ['ShopMenu'],
  //       key: 'ShopList',
  //       name: '商户管理',
  //       icon: 'shop',
  //       router: '/shops',
  //     },
  //     {
  //       parent: ['ShopMenu'],
  //       key: 'ShopVoucher',
  //       name: '代金券',
  //       icon: 'red-envelope',
  //       router: '/voucher',
  //     },
  //     {
  //       parent: ['ShopMenu'],
  //       key: 'ShopEvaluate',
  //       name: '商品评价',
  //       icon: 'star-o',
  //       router: '/shopevaluate',
  //     },
  //     {
  //       parent: ['ShopMenu'],
  //       key: 'ShopGoods',
  //       name: '商品管理',
  //       icon: 'skin',
  //       router: '/goods',
  //     }, {
  //       parent: ['ShopApplyMenu'],
  //       key: 'ShopNotification',
  //       name: '商户告知书',
  //       icon: 'notification',
  //       router: '/notification',
  //     },
  //   ],
  // },
  // {
  //   key: 'ShopAccountMenu',
  //   name: '积分兑换商户结算',
  //   icon: 'calculator',
  //   child: [
  //     // {
  //     //   parent: ['ShopAccountMenu'],
  //     //   key: 'AccountSetting',
  //     //   name: '结算周期设置',
  //     //   icon: 'setting',
  //     //   router: '/shopinterval',
  //     // },
  //     {
  //       parent: ['ShopAccountMenu'],
  //       key: 'ShopAccount',
  //       name: '商户结算',
  //       icon: 'calculator',
  //       router: '/shopsettlement',
  //     },
  //     {
  //       parent: ['ShopAccountMenu'],
  //       key: 'ShopsettleTable',
  //       name: '商户结算明细',
  //       icon: 'database',
  //       router: '/shopsettleTable',
  //     },
  //     /* {
  //       parent: ['ShopAccountMenu'],
  //       key: 'UnShopsettle',
  //       name: '未结算',
  //       icon: 'database',
  //       router: '/unshopsettle',
  //     } , */
  //   ],
  // },
  // {
  //   key: 'OrderMenu',
  //   name: '订单管理',
  //   icon: 'shopping-cart',
  //   router: '/orders',
  // },
  {
    key: 'SystemSettingMenu',
    name: '系统管理',
    icon: 'lock',
    child: [{
      parent: ['SystemSettingMenu'],
      key: 'User',
      name: '系统用户管理1',
      icon: 'user',
      router: '/user',
    }, {
      parent: ['SystemSettingMenu'],
      key: 'Role',
      name: '角色与权限管理',
      icon: 'user',
      router: '/role',
    },
    //  {
    //   parent: ['SystemSettingMenu'],
    //   key: 'Banner',
    //   name: 'Banner设置',
    //   icon: 'appstore-o',
    //   router: '/banner',
    // }
  ],
  },
  //  {
  //   key: 'people',
  //   name: '人员管理',
  //   icon: 'user',
  //   child: [{
  //     parent: ['people'],
  //     key: 'Staff',
  //     name: '员工管理',
  //     icon: 'smile-o',
  //     router: '/staff',
  //   }
  // ]
  // }
  // , {
  //   key: 'ReportQueryMenu',
  //   name: '报表查询',
  //   icon: 'pie-chart',
  //   router: '/query',
  // },
];


export default Menu;
