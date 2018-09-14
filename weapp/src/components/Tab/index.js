import {Tabs, Icon} from 'antd';
import PropTypes from 'prop-types'
const TabPane = Tabs.TabPane;

class Tab extends React.Component {
  render() {
    const {tabList,changeTab,currentTab} = this.props;
    return (<Tabs defaultActiveKey={currentTab?currentTab.toString():'1'}  onChange={changeTab}>
      {tabList.map(item=>
        <TabPane tab={<span><Icon type={item.Icon}/>{item.label}</span>} key={item.key}>
        </TabPane>)}
    </Tabs>)
  }
}
Tab.propTypes = {
  changeTab: PropTypes.func,
};

export default Tab

