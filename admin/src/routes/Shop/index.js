import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Button,Breadcrumb} from 'antd';
import { routerRedux  } from 'dva/router'
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import PageModal from './PageModal'
import Tab from '../../components/Tab'
import styles from './app.css'
const { push } = routerRedux;
class Shop extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'shop';
  }
  componentDidMount() {
    this.props.dispatch({type: `${this.api_name}/query`});
  }
  SearchDateByQuery = (query)=> {
    this.props.dispatch({
      type: `${this.api_name}/query`,
      payload: {
        page: 1,
        query
      },
    });
    this.setState({query:query});
  }
  DeleteLi = (id)=> {
    this.props.dispatch({
      type: `${this.api_name}/delete`,
      payload: [id],
    });
  }

  deleteSeletedRows = (keys)=> {
    this.props.dispatch({
      type: `${this.api_name}/delete`,
      payload: keys,
    });
    this.setState({
      showDelBtn: false,
    })
  }
  changeTab = (key)=> {
    this.props.dispatch({
      type: `${this.api_name}/changeTab`,
      payload: {
        tab:parseInt(key),
      },
    });
  }
  render() {
    const searchProps = {
      SearchDateByQuery: this.SearchDateByQuery,
      tab:this.props.currModel.tab,
    };
    const tabProps = {
      tabList:[{key:'1',Icon:'skin',label:'商户列表'},{key:'2',Icon:'filter',label:'商户审核'}],
      changeTab: this.changeTab,
      currentTab:this.props.currModel.tab,
    };
    const tableProps = {
      TableSize: this.props.app.TableSize,
      loading: this.props.loading.effects[`${this.api_name}/query`],
      DeleteLi: this.DeleteLi,
      deleteSeletedRows: this.deleteSeletedRows,
      addBtn: this.addBtn,
      tab:this.props.currModel.tab,
      data: this.props.currModel.data,
      pagination: {
        ...this.props.currModel.pagination,
        onShowSizeChange: (current, pageSize) => {
          this.props.dispatch({
            type: `${this.api_name}/query`,
            payload: {
              page: current,
              limit: pageSize,
              query:this.state.query,
            },
          });

        },
        onChange: (current) => {
          this.props.dispatch({
            type: `${this.api_name}/query`,
            payload: {
              page: current,
              query:this.state.query,
            },
          });
        },
      },
      onExamineItem: (item)=> {
        this.props.dispatch({
          type: `${this.api_name}/showModal`,
          payload: {
            modalType:'update',
            currentItem: item,
          },
        })
      },
      goDetail:(record)=> {
        this.props.dispatch(push(`/shops/${record.id}`))
      },

    };
    const modalProps = {
      currentItem: this.props.currModel.currentItem,
      visible: this.props.currModel.modalVisible,
      maskClosable: true,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title:'商户审核',
      wrapClassName: 'vertical-center-modal',
      BtnOk: (data)=> {
        this.props.dispatch({
          type: `${this.api_name}/update`,
          payload: data,
        })
      },
      onCancel: ()=> {
        this.props.dispatch({
          type: `${this.api_name}/hideModal`,
        })
      },
    }
    return (
      <div className={styles.data_content}>
        <Breadcrumb  routes={this.props.routes} params={this.props.params} />

        {this.props.children?this.props.children:
          <div>
            <Tab {...tabProps}/>
            <SearchContent {...searchProps}/>
            <DataTable {...tableProps}/>
          </div>}
        {this.props.currModel.modalVisible && <PageModal {...modalProps} />}
      </div>
    )
  }
}

Shop.propTypes = {
  currModel: PropTypes.object,
  shop: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default connect(({shop, app, loading})=>({currModel: shop, app, loading}))(Shop)
