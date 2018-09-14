'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1506497392834_7040';

  // add your config here
  config.multipart={
      fileExtensions: [ '.txt' ], // 增加对 .txt 扩展名的支持
  };
  config.middleware = ['auth','wechatAuth'];
  config.auth={
    match:'/admin/api'
  }
  config.wechatAuth={
      match:'/wechat/api'
  }
  // security
  config.security = {
    csrf: false // disable csrf
  };

  // cluster
  config.cluster = {
    listen: {
      port: 3000
    }
  };

  // static
  config.static = {
    prefix: '/static/',
    dir:[path.join(appInfo.baseDir,'app/public'),path.join(appInfo.baseDir,'app/upload'),path.join(appInfo.baseDir,'app/settlement_file')],
  };
  // view
  config.view = {
    defaultExtension: '.pug',
    defaultViewEngine: 'pug',
    mapping: { '.pug': 'pug' }
  };

  //connect shenkong
  config.SKAPI='http://124.161.16.235:8280/integral-web/app';
  config.SKMSGAPI='http://124.161.16.235:8280/integral-sms/app';
  config.shopCode='917368400090306';
  config._host='http://123.207.124.91:3000';
  config.bankAPI= {
      pay: 'https://wsnx.artisangroup.cn/ps/consume/payment',
      refund: 'https://wsnx.artisangroup.cn/ps/reject/refund',
      search: 'https://wsnx.artisangroup.cn/ps/order/search',
      balance: 'https://wsnx.artisangroup.cn/ps/balance/notify',
      merchantList: 'https://wsnx.artisangroup.cn/ps/merchant/approved/list',
      signature: 'https://wsnx.artisangroup.cn/ps/signature/unsign/body'
  };
  // sequelize
  config.sequelize = {
    host: 'cd-cdb-qlcyqafi.sql.tencentcdb.com',
    port:'63872',
    database: 'zhibo1',
    username: 'manager',
    password: 'abC12345678',
    dialect: 'mysql',
    define: {
      underscored: true,
      timestamps: true
    }
  };

  return config;
};