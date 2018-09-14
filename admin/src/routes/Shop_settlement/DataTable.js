import React from 'react';
import PropTypes from 'prop-types';
import {Table, Spin, Modal,Button,Alert} from 'antd';
import Func from "../../utils/publicFunc"
import DropOption from '../../components/DropOption'
import styles from './app.css'
const confirm = Modal.confirm


class DataTable extends React.Component {
  state = {
    seletedRows:[],
    showDelBtn:false,
  }
  constructor(props) {
    super(props);

  }
  handleMenuClick = (record, e) => {
    confirm({
      title: '确定删除该条数据吗?',
      onOk: ()=> {

        this.props.DeleteDate([record.id]);
        const newArray = this.state.seletedRows.filter(item=>item !== record.id);
        this.setState({
          showDelBtn: newArray.length > 0,
          seletedRows: newArray,
        })
      },
    })
  }
  onSaveSeletedRows = (keys)=> {
    this.props.getDefaultRow(keys)
    this.setState({
      seletedRows:keys,
      showDelBtn: keys.length > 0,
    })

  }
  addBtn = ()=> {
    this.props.onEditItem();
  }

  render() {
    const {data,TableSize,rowkey,type,loading,pagination} = this.props;
    let Columns;
    if(type==1){
      Columns= [{
        title: '代金券名称',
        dataIndex: 'voucher.name',
        key: 'voucher.name',
        width: 250,
      },{
        title:'价格',
        dataIndex: 'voucher.price',
        key: 'voucher.price',
        width: 160,
        render:(price)=>{
          return Func.price(price)
        }
      },{
        title:'积分',
        dataIndex: 'voucher.exch_points',
        key: 'voucher.exch_points',
        width: 160,
      },{
        title:'待结算笔数',
        dataIndex: 'count',
        key: 'count',
        width: 160,
      },{
          title:'代金券描述',
          dataIndex: 'voucher.desc',
          key: 'voucher.desc',
        }];
    }else{
      Columns = [{
        title: '商品名称',
        dataIndex: 'goods.name',
        key: 'goods.name',
        width: 250,
      },{
        title:'价格',
        dataIndex: 'goods.price',
        key: 'goods.price',
        width: 160,
        render:(price)=>{
          return Func.price(price)
        }
      },{
        title:'积分',
        dataIndex: 'goods.exch_points',
        key: 'goods.exch_points',
        width: 160,
      },{
        title:'待结算笔数',
        dataIndex: 'count',
        key: 'count',
        width: 160,
      },{
          title:'商品描述',
          dataIndex: 'goods.desc',
          key: 'goods.desc',
        }];
    }
    if(rowkey.rowkey){
      var length=rowkey.rowkey.length||0;
    }
    return (
      <Spin tip="加载中..." spinning={loading}>
        <div className="marginBt16px">
          {length?<Button type='primary' icon="plus" onClick={this.addBtn}>确认结算</Button>:''}
        </div>

        <Alert className="marginBt16px" message={(
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{length}</a> 项
            <a onClick={this.props.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
          </div>
        )} type="info" showIcon >
          <a href="">关闭</a>
        </Alert>
           <Table
           rowSelection={{
             selectedRowKeys:rowkey.rowkey,
             onChange: this.onSaveSeletedRows}}
           dataSource={data}
           columns={Columns}
           size={TableSize}
           bordered
           simple
           pagination={pagination}
         />
      </Spin>
    );
  }
};

DataTable.propTypes = {
  DeleteArea: PropTypes.func,
  onEditItem: PropTypes.func,
  loading: PropTypes.bool,
  data: PropTypes.array,
  TableSize: PropTypes.string,
  deleteSeletedRows: PropTypes.func,
  pagination: PropTypes.object,
  delLoading: PropTypes.bool,
};

export default DataTable;
