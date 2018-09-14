import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Breadcrumb} from 'antd';
import SearchContent from './SearchContent'
import DataTable from './DataTable'

class Gift_sign extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'gift_sign';
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
  getDefaultDate  = ()=>{
    this.props.dispatch({type: 'gift/getDefault_data',payload:{all:true}})
    this.props.dispatch({type: 'netspot/getDefault_data',payload:{all:true}})
    this.props.dispatch({type: 'staff/getDefault_data'})
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
      default_data:[this.props.gift.default_data,this.props.netspot.default_data,this.props.staff.default_data],
      search_data:[this.props.gift.search_data,this.props.netspot.search_data,this.props.staff.search_data],
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
          type: `${this.api_name}/showModal`,
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
    };
    return (
      <div className="data_content">
        <Breadcrumb routes={this.props.routes} params={this.props.params} />
        <SearchContent {...searchProps}/>
        <DataTable {...tableProps}/>
      </div>
    )
  }
}

Gift_sign.propTypes = {
  currModel: PropTypes.object,
  dispatch: PropTypes.func,
  gift_type: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default connect(({gift_sign,netspot,staff,gift,app, loading})=>({currModel: gift_sign,netspot,staff,gift, app,loading}))(Gift_sign)
