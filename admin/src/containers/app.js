/**
 * Created by 郑银华 on 2017/10/11.
 */
import React from 'react';
import {connect} from 'dva';
import config from '../utils/config';

import {Layout,message,Icon} from 'antd';
const {Content} = Layout;
import Func from '../utils/publicFunc'
import Login from '../containers/Login';
import Error from '../containers/error';
import MyFooter from '../components/MyFooter';
import MyHeader from '../components/MyHeader';
import Sidebar from '../components/Sidebar';
import styles from "../components/app.css"

const getlocationPathnameKey = (menu, locationPath)=> {
  let key;
  
  const getMenuTree = (nemuObj)=> {
    nemuObj.forEach(item=> {
      if (item.router === `/${locationPath.split('/')[1]}`) {
        key = item.key;
        return;
      }
      if (item.child) {//有子菜单
        getMenuTree(item.child)
      }
    })
  }
  getMenuTree(menu);
  return key;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props.dispatch({type: 'login/getCurrent'})
  }

  state = {
    collapsed: false,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  logout = () => {
    this.props.dispatch({type: 'login/logout'})
  }

  render() {
    const {menu, locationPathname} = this.props.app;
    const {updatePwdModal} = this.props.user;
    const {isLogin, currentUser} = this.props.login;
    if (!isLogin) {
      return <Login/>
    }
    const key = getlocationPathnameKey(menu, locationPathname);
    const power = currentUser.role ? currentUser.role.power : '';
    const powerArray = power ? Func.getMenuKeyByObj(JSON.parse(power))  : [];
    const menuProps = {menu, locationPathname, power: powerArray};
    const headerProps = {
      collapsed: this.state.collapsed,
      toggle: this.toggle,
      logout: this.logout,
      currentUser,
      modalVisible:updatePwdModal,
      BtnOk:(data)=>{
        this.props.dispatch({
          type:'user/updatePassword',
          payload:{
            ...data 
          }
        })
      },
      onCancel:()=>{
        this.props.dispatch({
          type:'user/updateState',
          payload:{
            updatePwdModal:false,
          }
        })
      },
      onShowModal:()=>{
        this.props.dispatch({
          type:'user/updateState',
          payload:{
            updatePwdModal:true,
          }
        })
      },
      loading:this.props.loading.effects['user/updatePassword']
    };
    const errorProps = {
      loading:powerArray.length===0,
    }
    return (
      <div>
        <Layout className={styles.adminBody + " ant-layout-has-sider"}>
          <Sidebar {...menuProps} collapsed={this.state.collapsed}/>
          <Layout className={styles.content}>
            <MyHeader  {...headerProps} />
            <Content className={styles.content_main}>
              {this.props.children ?
                (powerArray.indexOf(key) === -1 ? <Error {...errorProps}/> : this.props.children)
                :
                <div className={styles.welcome}>
                <div className={styles.child}>
                  <div className={styles.icon}><Icon type="home"/></div>
                  <div className={styles.text}>欢迎登录{config.name}</div>
                </div>
              </div>}
            </Content>
            <MyFooter/>
          </Layout>
        </Layout>
      </div>
    )
  }
}

export default connect(({app, login,loading,user})=>({app, loading,login,user}))(App)
