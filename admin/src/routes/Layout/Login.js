import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Form,Icon, Input,Checkbox} from 'antd'
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
  render(){
    const { getFieldDecorator } = this.props.form;
    const loading = this.props.loading;
    return (
      <div className={styles.form}>
        <div className={styles.logo}>
          <img alt={'logo'} src={config.logo} />
          <span>{config.name}</span>
        </div>
        <form onSubmit={this.handleSubmit}>
          <FormItem hasFeedback>
            {getFieldDecorator('username', {
              rules: [{required: true}],
            })(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />}  size="large" placeholder="Username" />)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [{required: true,}],
            })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} size="large" type="password" placeholder="Password" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>记住我</Checkbox>
            )}
            <a className={styles.forgot} href="">忘记密码?</a>
            <Button htmlType="submit" type="primary" size="large" loading={loading}>
              登录
            </Button>
          </FormItem>
      </form>
      </div>
    )
  }
}

Login.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.bool.isRequired,
}
function mapStateToProps(state,dispatch) {
  return {
    dispatch,
    loading: !!state.loading.models.Login
  };
}


export default connect(mapStateToProps)(Form.create()(Login))
