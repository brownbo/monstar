import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button,Spin, Form,Icon, Input,Checkbox,message} from 'antd'
import  config  from '../../utils/config'
import styles from './Login.css'

const FormItem = Form.Item

class Login extends React.Component{

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({ type: 'login/login', payload: values })
    });
  }
  fargetPsw = (e) => {
    message.info('请联系管理员。');
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const loading = this.props.loading.effects['login/login'];
    return (
      <div className = {styles.body} >
        <div className={styles.logo_div}>
            <div className={styles.logo_img}>
            </div>
          </div>
        <div className={styles.center_div}>
        <div className={styles.sysname}>
           
        </div>
      
        <div className={styles.flex_center}>
          <div className={styles.form}>
            <form className={styles.flex} onSubmit={this.handleSubmit} >
              <div className={styles.form_left}>
                <FormItem className={styles.my_input_u}  hasFeedback>
                  {getFieldDecorator('username', {
                    rules: [{
                      required: true,
                      message:'用户名不能为空'
                    }],
                  })(<Input  size="large" placeholder="请输入用户名" />)}
                </FormItem>
                <FormItem className={styles.my_input_p} hasFeedback>
                  {getFieldDecorator('password', {
                    rules: [{
                      required: true,
                      message:'密码不能为空'
                    }],
                  })(<Input size="large" type="password" placeholder="请输入密码" />)}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(
                    <Checkbox>记住我</Checkbox>
                  )}
                  <a className={styles.forgot} onClick={this.fargetPsw}>忘记密码?</a>
                  
                </FormItem>
              </div>
                           
                <div className = {styles.form_right}>
                <Spin spinning={loading?loading:false}>  
                  <div className = {styles.sub_btn} onClick={this.handleSubmit}/>
                  </Spin>  
                </div>
            </form>
          </div>
        </div> 
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  login: PropTypes.object,
}



export default connect(({login,loading})=>({login,loading}))(Form.create()(Login))
