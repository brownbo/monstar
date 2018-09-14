import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Breadcrumb} from 'antd';
import styles from './app.css'
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import PageModal from './PageModal'


class StockRec extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'stockRec';
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
        ExamineObj:{},
      },
    })
  }
  getDefaultDate  = ()=>{
    this.props.dispatch({type: 'gift/getDefault_data',payload:{all:true}})
    this.props.dispatch({type: 'netspot/getDefault_data',payload:{all:true}})
  }
  getSearch_dataFunc  = (type,query)=>{
    this.props.dispatch({
      type: `${type}/getSearch_data`,
      payload:{
        query:{...query,all:true}
      },
    })
  }
  getExamineDetailByID  = (id)=>{
    this.props.dispatch({
      type: `${this.api_name}/getExamineDetail`,
      payload:{
        query:{id:id}
      },
    })
  }
  searchGiftCount= (data)=> {
    this.props.dispatch({
      type: 'stock/getSearch_data',
      payload: {query:data,}
    })
  }
  render() {
    const searchProps = {
      SearchDateByQuery: this.SearchDateByQuery,
      getDefaultDate:this.getDefaultDate,
      getSearch_dataFunc:this.getSearch_dataFunc,
      default_data:[this.props.gift.default_data,this.props.netspot.default_data,],
      search_data:[this.props.gift.search_data,this.props.netspot.search_data,],
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
        this.searchGiftCount({gift_id:item.gift_id,netspot_id:item.allocation_out_id})
      },
    };
    const modalProps = {
      currentItem: this.props.currModel.modalType === 'create' ? {} : this.props.currModel.currentItem,
      modalType: this.props.currModel.modalType,
      ExamineObj:this.props.currModel.ExamineObj,
      btnDisabled:this.props.currModel.btnDisabled,
      getExamineDetailByID:this.getExamineDetailByID,
      getDefaultDate:this.getDefaultDate,
      getSearch_dataFunc:this.getSearch_dataFunc,
      default_data:[this.props.gift.default_data,this.props.netspot.default_data,],
      search_data:[this.props.gift.search_data,this.props.netspot.search_data,],
      gift_search_data:this.props.stock.search_data,
      SearchLoading:!!this.props.loading.effects[`${this.api_name}/getExamineDetail`],
      visible: this.props.currModel.modalVisible,
      maskClosable: true,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title: `${this.props.currModel.modalType === 'create' ? '新建调拨' : '更新调拨'}`,
      wrapClassName: 'vertical-center-modal',
      BtnOk: (data)=> {
        this.props.dispatch({
          type: `${this.api_name}/${this.props.currModel.modalType}`,
          payload: data,
        })
      },
      onCancel: ()=> {
        this.props.dispatch({
          type: `${this.api_name}/hideModal`,
        })
      },
      resetFileds: ()=> {
        this.props.dispatch({
          type: `${this.api_name}/updateState`,
          payload:{
            ExamineObj:{},
          }
        })
      },
      searchGiftCount: this.searchGiftCount,
      disabled:this.props.currModel.btnDisabled,
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

StockRec.propTypes = {
  currModel: PropTypes.object,
  dispatch: PropTypes.func,
  gift_type: PropTypes.object,
  gift: PropTypes.object,
  netspot: PropTypes.object,
  stock: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default connect(({stockRec,gift,netspot,app,stock, loading})=>({currModel: stockRec, gift,netspot,app,stock,loading}))(StockRec)
