import React from 'react';
import { Layout, Icon, Menu, Modal, Form, Input,Dropdown } from 'antd';
const { Header } = Layout;
import styles from "./index.css"
import publicFunc from "../../utils/publicFunc"
import formRules from "../../utils/formRules"
const FormItem = Form.Item;
const SubMenu = Menu.SubMenu;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
class MyHeader extends React.Component {
  state = {
    time: publicFunc.getNowTimeForHeader(),
    confirmDirty: false,
  }
  handleClickMenu = e => {
    if (e.key === 'logout') {
      this.props.logout();
    } else if (e.key === 'editpassword') {
      this.props.onShowModal();
    }
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ time: publicFunc.getNowTimeForHeader() })
    }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...this.props.form.getFieldsValue(),
      }

      this.props.BtnOk(data)
    })
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['password'], { force: true });
    }
    callback();
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value === form.getFieldValue('oldPassword')) {
      callback('旧密码不能和新密码相同!');
    } else {
      callback();
    }
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  render() {
    const { currentUser, modalVisible, loading, BtnOk, onCancel } = this.props;
    const { getFieldDecorator } = this.props.form;
    const modalOpts = {
      visible: modalVisible,
      maskClosable: true,
      confirmLoading: loading,
      title: "修改密码",
      onOk: this.handleOk,
      onCancel,
    }
    const menu = (
      <Menu size="small" onClick={this.handleClickMenu}>
        <Menu.Item key="logout">
          登出
        </Menu.Item>
        <Menu.Item key="editpassword">
          修改密码
        </Menu.Item>
      </Menu>
    );
    return (
      <Header className="admin_header" style={{ background: '#fff', padding: 0 }}>
        <div className={styles.welcome}>
          <span>{this.state.time[0]}</span>
          <span>{'今天是:'+this.state.time[1]}</span>
        </div>
        <div className={styles.rightWarpper}>
          <span><Icon className={styles.header_icon} type="user" />{`${currentUser.role?currentUser.role.name:''}：`}</span>
          <Dropdown  overlay={menu}>
            <a className="ant-dropdown-link" href="#">
              {currentUser.username} <Icon type="down" />
            </a>
          </Dropdown>
          {/* <Menu size="small" mode="horizontal" onClick={this.handleClickMenu}>
            <SubMenu
              style={{
                float: 'right',
              }}
              title={<span>
              <span>{currentUser.username}</span>
            </span>}
            >
              <Menu.Item key="logout">
                登出
              </Menu.Item>
              <Menu.Item key="editpassword">
                修改密码
              </Menu.Item>
            </SubMenu>
          </Menu> */}
        </div>
        {modalVisible?
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="旧密码" hasFeedback {...formItemLayout}>
                {getFieldDecorator('oldPassword', {
                  rules: [
                    formRules.require,{
                      validator: this.validateToNextPassword,
                    }
                  ],
                })(<Input type="password" placeholder="输入旧密码"/>)}
            </FormItem>
            <FormItem label="新密码" hasFeedback {...formItemLayout}>
                {getFieldDecorator('password', {
                  rules: [
                    formRules.require,{
                      validator: this.compareToFirstPassword,
                    }
                  ],
                })(<Input type="password" onBlur={this.handleConfirmBlur} placeholder="输入新密码"/>)}
            </FormItem>
          </Form>
        </Modal>:''}
      </Header>
    );
  }
}

export default Form.create()(MyHeader);