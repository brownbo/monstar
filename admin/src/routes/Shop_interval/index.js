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
class Shop_interval extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'shop_interval';
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
  DeleteSettlement = (id,query)=> {
    this.props.dispatch({
      type: `${this.api_name}/update_cancle_cycle`,
      payload: {id,...query},
    })
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
  addBtn = ()=> {
    this.props.dispatch(push('/shops/add'))
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
      tab:this.props.currModel.tab,
      SearchDateByQuery: this.SearchDateByQuery,
    };
    const tabProps = {
      tabList:[{key:'1',Icon:'close',label:'未设置列表'},{key:'2',Icon:'check',label:'已设置列表'}],
      changeTab: this.changeTab
    };
    const tableProps = {
      tab:this.props.currModel.tab,
      seletedRows:this.props.currModel.seletedRows,
      TableSize: this.props.app.TableSize,
      loading: this.props.loading.effects[`${this.api_name}/query`],
      deleteSeletedRows: this.deleteSeletedRows,
      addBtn: this.addBtn,
      data: this.props.currModel.data,
      onSeletedKeys: (seletedkeys)=> {
        this.props.dispatch({
          type: `${this.api_name}/updateState`,
          payload: {
            seletedRows: seletedkeys,
          },
        })
      },
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
      onEditItem: (item)=> {
        this.props.dispatch({
          type: `${this.api_name}/showModal`,
          payload: {
            modalType:'update',
            currentItem: item,
          },
        })
      },
      onShowModal_two: ()=> {
        this.props.dispatch({type: `${this.api_name}/showModal_two`,})
      },
      DeleteSettlement: this.DeleteSettlement,
      modalVisible:this.props.currModel.modalVisible_two,
      confirmLoading:this.props.loading.effects[`${this.api_name}/update_cancle_cycle`],
      BtnOk: (id,query)=> {
        this.DeleteSettlement(id,query);
      },
      onCancel: ()=> {
        this.props.dispatch({
          type: `${this.api_name}/hideModal_two`,
        })
      },
    };
    const modalProps = {
      currentItem: this.props.currModel.currentItem,
      visible: this.props.currModel.modalVisible,
      maskClosable: true,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title:'结算周期设置',
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

Shop_interval.propTypes = {
  currModel: PropTypes.object,
  shop_interval: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default connect(({shop_interval, app, loading})=>({currModel: shop_interval, app, loading}))(Shop_interval)
