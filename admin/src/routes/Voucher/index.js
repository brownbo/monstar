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
class Voucher extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }

  constructor(props) {
    super(props);
    this.api_name = 'voucher';
  }

  componentDidMount() {
    const pagination = this.props.currModel.pagination;
    this.props.dispatch({
      type: `${this.api_name}/query`,
      payload: {
        page: pagination.current,
        limit: pagination.pageSize,
      },
    });
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
  }
  addBtn = ()=> {
    this.props.dispatch(push('/voucher/add'))
  }
  getShopDefault_data = ()=> {
    this.props.dispatch({type: 'shop/getDefault_data'})
  }
  getShopSearch_data = (query)=> {
    this.props.dispatch({
      type: 'shop/getSearch_data',
      payload:{
        query:{name:query}
      },
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
      getShopDefault_data:this.getShopDefault_data,
      getShopSearch_data:this.getShopSearch_data,
      default_data:this.props.shop.default_data,
      search_data:this.props.shop.search_data,
      tab:this.props.currModel.tab,
    };
    const tabProps = {
      tabList:[{key:'1',Icon:'skin',label:'代金券列表'},{key:'2',Icon:'filter',label:'代金券审核'}],
      changeTab: this.changeTab,
      currentTab:this.props.currModel.tab,
    };
    const tableProps = {
      TableSize: this.props.app.TableSize,
      loading: this.props.loading.effects[`${this.api_name}/query`],
      DeleteLi: this.DeleteLi,
      deleteSeletedRows: this.deleteSeletedRows,
      data: this.props.currModel.data,
      addBtn:this.addBtn,
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
      goDetail:(record)=> {
        this.props.dispatch(push(`/voucher/${record.id}`))
      },
      onEditItem: (item)=> {
        this.props.dispatch({
          type: `${this.api_name}/showModal`,
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
      DeleteLi:this.DeleteLi,
    };
    const modalProps = {
      currentItem: this.props.currModel.currentItem,
      modalType: this.props.currModel.modalType,
      visible: this.props.currModel.modalVisible,
      maskClosable: true,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title: '审核商品',
      wrapClassName: 'vertical-center-modal',
      BtnOk: (data)=> {
        this.props.dispatch({
          type: `${this.api_name}/${this.props.currModel.modalType}`,
          payload: {...data, closeModal: true},
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
            {this.props.currModel.modalVisible && <PageModal {...modalProps} />}
          </div>}
      </div>
    )
  }
}

Voucher.propTypes = {
  currModel: PropTypes.object,
  app: PropTypes.object,
  shop: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default connect(({voucher,shop, app, loading})=>({currModel: voucher, shop,app, loading}))(Voucher)
