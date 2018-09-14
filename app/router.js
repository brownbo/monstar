'use strict';
module.exports = app => {

  app.get('/admin/', 'user.showAdmin');
  app.get('/admin/api/areas', 'area.list');
  app.get('/admin/api/areas/:id', 'area.show');
  app.post('/admin/api/areas/', 'area.create');
  app.put('/admin/api/areas/:id', 'area.update');
  app.delete('/admin/api/areas/', 'area.destroy');
  app.delete('/admin/api/areas/:id', 'area.destroy');
  
  //roles
  app.get('/admin/api/roles', 'role.list');
  app.get('/admin/api/roles/:id', 'role.show');
  app.post('/admin/api/roles/', 'role.create');
  app.put('/admin/api/roles/:id', 'role.update');
  app.delete('/admin/api/roles/', 'role.destroy');
  app.delete('/admin/api/roles/:id', 'role.destroy');
  
  //user
  app.get('/admin/api/users', 'user.list');
  app.get('/admin/api/users/:id', 'user.show');
  app.post('/admin/api/users/', 'user.create');
  app.put('/admin/api/users/:id', 'user.update');
  app.delete('/admin/api/users/', 'user.destroy');
  app.delete('/admin/api/users/:id', 'user.destroy');
  
  //user
  app.post('/api/login', 'user.login'); //登录接口
  app.put('/admin/api/changePass/:id', 'user.changePass'); //修改密码
  app.get('/admin/api/getCurrent', 'user.getCurrent'); //获取当前
  app.post('/admin/api/logout', 'user.logout'); //注销
};