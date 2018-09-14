import React from 'react';
import { Layout, Icon } from 'antd';
const { Footer} = Layout;

import config from '../../utils/config';
import styles from './index.css';

/**
 * 定义Footer组件
 */
class MyFooter extends React.PureComponent {
  render() {
    const text = config.footerText || 'footer被弄丢啦!';
    return (
      <Footer className={styles.admin_footer} style={{ textAlign: 'center' }}>
        <div dangerouslySetInnerHTML={{ __html: text }}/>
      </Footer>
    );
  }

}

export default MyFooter;
