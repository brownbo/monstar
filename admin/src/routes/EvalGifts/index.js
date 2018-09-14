import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Breadcrumb} from 'antd';
import styles from './app.css'
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import PageModal from './PageModal'
import {routerRedux} from 'dva/router'
const {push} = routerRedux;

class EvalGifts extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'evalGifts';
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
    const pagination = this.props.currModel.pagination;
    this.props.dispatch({
      type: `${this.api_name}/query`,
      payload: {
        page: 1,
        limit: pagination.pageSize,
        query
      },
    });
    this.setState({query:query});
  }
  DeleteDate = (value)=> {
    this.props.dispatch({
      type: `${this.api_name}/delete`,
      payload: value,
    });
  }
  addBtn = ()=> {
    this.props.dispatch({
      type: `${this.api_name}/showModal`,
      payload: {
        modalType: 'create',
      },
    })
  }
  getGiftDefault_data = ()=> {
    this.props.dispatch({type: 'gift/getDefault_data'})
  }
  getGiftSearch_data = (query)=> {
    this.props.dispatch({
      type: 'gift/getSearch_data',
      payload: {
        query: {name: query}
      },
    })
  }
  getCustomerDefault_data = ()=> {
    this.props.dispatch({type: 'customer/getDefault_data'})
  }
  getCustomerSearch_data = (query)=> {
    this.props.dispatch({
      type: 'customer/getSearch_data',
      payload: {
        query: {name: query}
      },
    })
  }

  render() {
    const searchProps = {
      SearchDateByQuery: this.SearchDateByQuery,
      getGiftDefault_data: this.getGiftDefault_data,
      getGiftSearch_data: this.getGiftSearch_data,
      search_data_gift: this.props.gift.search_data,
      default_data_gift: this.props.gift.default_data,
      //评价人
      getCustomerDefault_data: this.getCustomerDefault_data,
      getCustomerSearch_data: this.getCustomerSearch_data,
      search_data_customer: this.props.customer.search_data,
      default_data_customer: this.props.customer.default_data,

    };
    const tableProps = {
      TableSize: this.props.app.TableSize,
      loading: this.props.loading.effects[`${this.api_name}/query`],
      DeleteDate: this.DeleteDate,
      deleteSeletedRows: this.deleteSeletedRows,
      delLoading: this.props.loading.effects[`${this.api_name}/delete`],
      addBtn: this.addBtn,
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
      //新页面方法
      goDetail: (record)=> {
        this.props.dispatch(push(`/giftsevaluate/${record.id}`))
      },
    };

    return (
      <div className={styles.data_content}>
        <Breadcrumb routes={this.props.routes} params={this.props.params}/>
        {this.props.children ? this.props.children :
          <div>
            <SearchContent {...searchProps}/>
            <DataTable {...tableProps}/>
          </div>}
      </div>
    )
  }
}

EvalGifts.propTypes = {
  currModel: PropTypes.object,
  dispatch: PropTypes.func,
  gift_type: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default connect(({evalGifts, gift, customer, app, loading})=>({
  currModel: evalGifts,
  gift,
  customer,
  app,
  loading
}))(EvalGifts)
