import React from 'react'

import {connect} from 'dva'

const refHoc = WrappedComponent => class extends WrappedComponent {

  componentDidMount() {

  }
  render() {
    return (<WrappedComponent
      {...this.props}
    />);
  }
};
class Base extends React.Component {
  state = {
    name:'zhangsan',
  }
  constructor(props) {
    super(props);
  }
  render(){
    return <div>Basetest</div>
  }
}
const Test = refHoc(Base);
class BaseIndex extends React.Component {
  state = {
    name:'lisi'
  }
  constructor(props) {
    super(props);
  }
  render(){
    return <Test/>
  }
}
export default refHoc(connect()(BaseIndex))
