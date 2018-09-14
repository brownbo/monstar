/*
 * @Author: lkspc 
 * @Date: 2017-09-27 15:39:23 
 * @Last Modified by: lkspc
 * @Last Modified time: 2017-11-08 11:00:02
 */

'use strict';

const getBaseService = require('./lib/base_service');
const getBaseController = require('./lib/base_controller');

/**
 * app 启动入口
 */
module.exports = app => {
  app.beforeStart(async() => {
    // 同步数据库
   //  await app.model.sync();
  });
  app._Service = app.Service;
  // 扩展Service
  app.Service = getBaseService(app);
  // 扩展Controller
  app.Controller = getBaseController(app);
};