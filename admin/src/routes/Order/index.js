import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Button,Breadcrumb} from 'antd';
import { routerRedux  } from 'dva/router'
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import styles from './app.css'
const { push } = routerRedux;
class Order extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'order';
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

  SearchDateByQuery = (query={})=> {
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
  getAllDefault_data = ()=> {
    this.props.dispatch({type: 'goods/getDefault_data',payload:{all:true}});
    this.props.dispatch({type: 'voucher/getDefault_data',payload:{all:true}});
    this.props.dispatch({type: 'gift/getDefault_data',payload:{all:true}});
    this.props.dispatch({type: 'staff/getDefault_data'});
    this.props.dispatch({type: 'merchant/getDefault_data'});
  }
  getSearch_dataFunc = (type,query)=> {
    this.props.dispatch({
      type: `${type}/getSearch_data`,
      payload:{
        query:{...query,all:true}
      },
    })
  }
  getOrderFiles = (query)=> {
    this.props.dispatch({
      type: `order/api_files`,
      payload:{
        query:{...query}
      },
    })
  }

  render() {
    const searchProps = {
      SearchDateByQuery: this.SearchDateByQuery,
      default_data:[this.props.gift.default_data,this.props.voucher.default_data,this.props.goods.default_data],
      search_data:[this.props.gift.search_data,this.props.voucher.search_data,this.props.goods.search_data],
      getAllDefault_data:this.getAllDefault_data,
      getSearch_dataFunc:this.getSearch_dataFunc,
      getOrderFiles:this.getOrderFiles,
      default_data_verify:[this.props.staff.default_data,this.props.merchant.default_data,],
      search_data_verify:[this.props.staff.search_data,this.props.merchant.search_data,],
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
        this.props.dispatch(push(`/orders/${record.id}`))
      },
      DeleteLi:this.DeleteLi,
    };
    return (
      <div className={styles.data_content}>
        <Breadcrumb  routes={this.props.routes} params={this.props.params} />
        {this.props.children?this.props.children:
          <div>
            <SearchContent {...searchProps}/>
            <DataTable {...tableProps}/>
          </div>}
      </div>
    )
  }
}

Order.propTypes = {
  currModel: PropTypes.object,
  app: PropTypes.object,
  customer: PropTypes.object,
  order: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default connect(({order,goods,voucher,gift,staff,merchant,app, loading})=>({currModel: order,goods,voucher,gift,staff,merchant,app, loading}))(Order)
