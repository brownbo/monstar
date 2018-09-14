import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Breadcrumb, message} from 'antd';
import styles from './app.css'
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import PageModal from './PageModal'


class Shop_settlement extends React.Component {
  state = {
    query: {},//搜索条件，翻页会默认取这里的值
    startTime: '',
    endTime: '',
    goodsList: '',
    vouchers_list:'',
    shop_id: '',
    shop_name: '',
    verify_vouchers:'',
    verify_goods:'',
  }

  constructor(props) {
    super(props);
    this.api_name = 'shop_settlement';
  }

  componentDidMount() {
    const pagination = this.props.currModel.pagination;
    this.props.dispatch({
      type: `${this.api_name}/query`,
      payload: {
        first: true,
      },
    });
    this.props.dispatch({
      type: `${this.api_name}/getrow`,
      payload: {
        rowkey: [],
      },
    });
  }

  SearchDateByQuery = (query)=> {
    if(!query.first){
      if(!query.shop_id){
        message.warning('请选择商户!');
        return;
      }else{
        this.setState({shop_id: query.shop_id})
        this.setState({shop_name: query.shop_name})
      }
      if(!query.created_at){
        message.warning('请选择时间!');
        return;
      }else{
        this.setState({endTime: query.created_at})
      }
      if(!query.verify_goods&&!query.verify_vouchers){
        message.warning('请选择类型!');
        return;
      }
    }
  this.props.dispatch({
    type: `${this.api_name}/query`,
    payload: {
      page: 1,
      query,
      first:query.first?query.rest:query.first,    
    },
  });
  this.setState({query: query});
  }
  DeleteDate = (value)=> {
    this.props.dispatch({
      type: `${this.api_name}/delete`,
      payload: value,
    });
  }

  /*  getTime = (time, dateString)=> {
     //console.log(dateString)
      //this.setState({startTime: dateString[0]})
     // this.setState({endTime: dateString})
  }  */
  getType=(value)=>{
    if(value==1){
      this.setState({verify_vouchers:value})
      this.setState({verify_goods:''})
    }else{
      this.setState({verify_vouchers:''})
      this.setState({verify_goods:value})
    }
    this.props.dispatch({
      type: `${this.api_name}/changeType`,
      payload: {
        type: value,
      },
    });
  }
  handleReset=()=>{
    this.props.dispatch({
      type: `${this.api_name}/getrow`,
      payload: {
        rowkey: [],
      },
    });
    this.setState({startTime: ''})
    this.setState({endTime: ''})
  }
  getDefaultDate = ()=> {
    this.props.dispatch({type: 'shop/getDefault_data'})
  }
  getSearch_dataFunc = (type, query)=> {
    this.props.dispatch({
      type: `${type}/getSearch_data`,
      payload: {
        query: {name: query}
      },
    })
  }
  getDefaultRow=(keys)=>{

    this.props.dispatch({
      type: `${this.api_name}/getrow`,
      payload: {
        rowkey: keys,
      },
    });
  }
  //清空
  cleanSelectedKeys=()=>{
    this.props.dispatch({
      type: `${this.api_name}/getrow`,
      payload: {
        rowkey: [],
      },
    });
  }

  render() {
    const searchProps = {
      SearchDateByQuery: this.SearchDateByQuery,
      getDefaultDate: this.getDefaultDate,
      getSearch_dataFunc: this.getSearch_dataFunc,
      default_data: this.props.shop.default_data,
      search_data: this.props.shop.search_data,
      //getTime: this.getTime,
      data: this.props.currModel.data,
      handleRese:this.handleReset,
      getType:this.getType, 
      cleanSelectedKeys:this.cleanSelectedKeys,
    };
    const tableProps = {
      TableSize: this.props.app.TableSize,
      loading: this.props.loading.effects[`${this.api_name}/query`],
      DeleteDate: this.DeleteDate,
      getDefaultRow:this.getDefaultRow,
      cleanSelectedKeys:this.cleanSelectedKeys,
      rowkey:this.props.currModel.rowkey,
      type:this.props.currModel.type,
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
              query: this.state.query,
            },
          });
        },
        onChange: (current) => {
          this.props.dispatch({
            type: `${this.api_name}/query`,
            payload: {
              page: current,
              query: this.state.query,
            },
          });
        },
      },
      onEditItem: ()=> {
        var item=this.props.currModel.rowkey.rowkey;
    
        if(this.state.verify_vouchers==1){
          this.setState({voucher_list: item.join()})
          this.setState({goodsList: ''})
          var  data = {
            pay_time: this.state.endTime,
            voucher_list:item.join(),
            verify_vouchers:this.state.verify_vouchers,
          }
        }else{
          this.setState({goodsList: item.join()})
          this.setState({voucher_list: ''})
          var  data = {
            pay_time: this.state.endTime,
            goods_list:item.join(),
            verify_goods:this.state.verify_goods,
          }
        }
        this.props.dispatch({
          type: `${this.api_name}/getGoods`,
          payload: {
            ...data,
          },
        })
      },
    };

    const modalProps = {
      currentItem: this.props.currModel.totalPoint,
      modalType: this.props.currModel.modalType,
      visible: this.props.currModel.modalVisible,
      maskClosable: true,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title: `${this.props.currModel.modalType ='商户结算'}`,
      wrapClassName: 'vertical-center-modal',
      BtnOk: (data)=> {
        if(this.state.verify_vouchers==1){
          var datas = {
            shop_id: this.state.shop_id,
            shop_name: this.state.shop_name,
            pay_time: this.state.endTime,
            discount: data.discount,
            total_points: data.total_points,
            status:3,
            verify_vouchers:this.state.verify_vouchers,
            voucher_list:this.state.voucher_list,
          }
        }else {
          var datas = {
            shop_id: this.state.shop_id,
            shop_name: this.state.shop_name,
            pay_time: this.state.endTime,
            discount: data.discount,
            total_points: data.total_points,
            status:3,
            verify_goods:this.state.verify_goods,
            goods_list:this.state.goodsList,
          }
        }

        this.props.dispatch({
          type: `${this.api_name}/createtable`,
          payload: datas,
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
        <Breadcrumb routes={this.props.routes} params={this.props.params}/>
        <SearchContent {...searchProps}/>
        <DataTable {...tableProps}/>
        {this.props.currModel.modalVisible && <PageModal {...modalProps} />}
      </div>
    )
  }
}

Shop_settlement.propTypes = {
  currModel: PropTypes.object,
  dispatch: PropTypes.func,
  shop_settlement: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default connect(({shop_settlement, shop, app, loading})=>({
  currModel: shop_settlement,
  shop,
  app,
  loading
}))(Shop_settlement)
