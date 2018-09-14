import React from 'react'
import { Icon,Spin } from 'antd'
import styles from './index.less'



class Error extends React.Component {
  state = {
    loading:this.props.loading,
  }
  componentDidMount(){
    this.timer = setTimeout(()=>{
      this.setState({loading:false})
    },2000)
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  render(){
    return (<div className={styles.flex_parent}>
      <div className={styles.error}>
        {this.state.loading?<Spin size="large" />:
          <div>
            <Icon type="frown-o" />
            <h1>404 Not Found</h1>
          </div>
        }
      </div>
    </div>)
  }
}


export default Error
