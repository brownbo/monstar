import React from 'react';
import {Router, Route} from 'dva/router';


/**component**/
//App
import App from './containers/app'





import Role from './containers/Role'



import User from './containers/User'




/*404page*/
import Error from './containers/error'


const routerMenu = [{
  path:'/',
  breadcrumbName:'首页',
  component:App,
  child:[
 {
    path:'/user',
    breadcrumbName:'系统用户列表1',
    component:User,
  },{
    path:'/role',
    breadcrumbName:'角色列表',
    component:Role,
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
