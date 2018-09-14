/**
 * Created by 郑银华 on 2017/10/18.
 */
import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import {Link} from 'dva/router';
const {  Sider } = Layout;
import styles from "./index.css"
class SiderBar extends React.Component {
  state = {
    current: [],
    openKeys: [],
  }
  render() {
    const {menu,locationPathname,power} = this.props;
    let nowRouterKey;//记录当前路由对应的菜单key
    let nowRouterParenttKey;//记录当前路由对应的祖辈菜单key
    //递归生成菜单
    const getMenuTree = (nemuObj)=>{
      return nemuObj.map(item=>{
        if(item.router == locationPathname){
          nowRouterParenttKey = item.parent;
          nowRouterKey = item.key;
        }
        if(power.indexOf(item.key)==-1){
          return undefined;
        }
        if(item.child){//有子菜单
          return (
            <Menu.SubMenu
              key={item.key}
              title={<span><Icon type={item.icon} /><span className="nav-text">{item.name}</span></span>}
            >
              {getMenuTree(item.child)}
            </Menu.SubMenu>
          )
        }

        return(
          <Menu.Item key={item.key}>
            <Link to={item.router || '#'}>
              {<Icon type={item.icon} />}
              <span className="nav-text">{item.name}</span>
            </Link>
          </Menu.Item>
        )
      })
    }
    const Menus = getMenuTree(menu);
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={this.props.collapsed}
        className={styles.leftSider}
      >
        <div className={styles.logo2} />
        {power.length?<Menu theme="dark" mode="inline"
                            defaultSelectedKeys={[nowRouterKey]}
                            defaultOpenKeys={nowRouterParenttKey}
        >
          {Menus}
        </Menu>:""}
      </Sider>
    );
  }
}
export default SiderBar;
