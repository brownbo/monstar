import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Breadcrumb} from 'antd';
import styles from './app.css'
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import PageModal from './PageModal'


class UnShopsettle extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'unShopsettle';
  }
  componentDidMount() {
    const pagination = this.props.currModel.pagination;
    this.props.dispatch({
      type: `${this.api_name}/query`,
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
  getDefaultDate  = ()=>{
    this.props.dispatch({type: 'shop/getDefault_data'})
  }
  getSearch_dataFunc  = (type,query)=>{
    this.props.dispatch({
      type: `${type}/getSearch_data`,
      payload:{
        query:{name:query}
      },
    })
  }
  render() {
    const searchProps = {
      SearchDateByQuery: this.SearchDateByQuery,
      getDefaultDate:this.getDefaultDate,
      getSearch_dataFunc:this.getSearch_dataFunc,
      default_data:this.props.shop.default_data,
      search_data:this.props.shop.search_data,
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
      onEditItem: (item)=> {
        this.props.dispatch({
          type: `${this.api_name}/getDetail`,
          payload: {
            ...item,
          },
        })
      },
    };
    const modalProps = {
      currentItem:this.props.currModel.currentItem,
      modalType: this.props.currModel.modalType,
      visible: this.props.currModel.modalVisible,
      maskClosable: true,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title:'结算详情',
      width:670,
      wrapClassName: 'vertical-center-modal',
      BtnOk: (data)=> {
        this.props.dispatch({
          type: `${this.api_name}/hideModal`,
        })
      },
      onCancel: ()=> {
        this.props.dispatch({
          type: `${this.api_name}/hideModal`,
        })
      },
    }
    return (
      <div className="data_content">
        <Breadcrumb routes={this.props.routes} params={this.props.params} />
        <SearchContent {...searchProps}/>
        <DataTable {...tableProps}/>
        {this.props.currModel.modalVisible && <PageModal {...modalProps} />}
      </div>
    )
  }
}

UnShopsettle.propTypes = {
  currModel: PropTypes.object,
  dispatch: PropTypes.func,
  shop_settlement: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default connect(({unShopsettle,shop,app, loading})=>({currModel: unShopsettle,shop,app,loading}))(UnShopsettle)
