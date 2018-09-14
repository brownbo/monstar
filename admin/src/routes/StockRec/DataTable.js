import React from 'react';
import PropTypes from 'prop-types';
import {Table, Spin, Modal,Button,Alert} from 'antd';
import Func from "../../utils/publicFunc"
import DropOption from '../../components/DropOption'
import styles from './app.css'
const confirm = Modal.confirm

const statusArray = ['正在调拨','已签收','部分签收','拒绝签收']

class DataTable extends React.Component {
  state = {
    seletedRows:[],
    showDelBtn:false,
  }
  constructor(props) {
    super(props);
    this.Columns = [{
      title: '申请编号',
      dataIndex: 'examine_id',
      key: 'examine_id'
    },{
      title: '礼品名称',
      dataIndex: 'gift.name',
      key: 'giftname'
    }, {
      title: '调拨方式',
      dataIndex: 'active_type',
      key: 'active_type',
      render:(active_type)=>{
        return active_type?'退还':'调拨';
      }
    },{
      title: '调入网点',
      dataIndex: 'allocation_in.name',
      key: 'allocation_inname'
    },{
      title: '调出网点',
      dataIndex: 'allocation_out.name',
      key: 'allocation_outname'
    },{
      title:'调入数量',
      dataIndex: 'allocation_count',
      key: 'allocation_count'
    },{
      title:'调拨时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render:(create_time)=>{
        return Func.getDate_ymdhms(create_time);
      }
    },{
      title:'签收/拒绝时间',
      dataIndex: 'sign_time',
      key: 'sign_time',
      render:(create_time)=>{
        return create_time?Func.getDate_ymdhms(create_time):'';
      }
    },{
      title:'签收数量',
      dataIndex: 'sign_count',
      key: 'sign_count',
    },{
      title:'调拨状态',
      dataIndex: 'status',
      key: 'status',
      render:(status)=>{
        return statusArray[status];
      }
    }, {
      title: '操作',
      key: 'operation',
      width:80,
      render: (text, record) => {
        if(record.status==0) return  <DropOption onMenuClick={e => this.handleMenuClick(record, e)}
                           menuOptions={[{key: '2', name: '删除'}]}/>
      },
    }];
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      this.props.onEditItem(record);
    } else if (e.key === '2') {
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
  }
  onSaveSeletedRows = (keys)=> {
    this.setState({
      seletedRows:keys,
      showDelBtn: keys.length > 0,
    })
  }
  deleteSeletedRows = ()=> {
    confirm({
      title: '确定删除吗?',
      onOk: ()=> {
        this.props.DeleteDate(this.state.seletedRows);
        this.setState({
          showDelBtn: false,
          seletedRows:[],
        })
      },
    })
  }
  cleanSelectedKeys = (event) =>{
    event.preventDefault();
    this.setState({
      seletedRows:[],
      showDelBtn: false,
    })
  }
  render() {
    const {data,TableSize,loading,pagination} = this.props;
    return (
      <Spin tip="加载中..." spinning={loading}>
        <div className="marginBt16px">
          <Button type='primary' className="marginRight10" icon="plus" onClick={this.props.addBtn}>新增</Button>
          {this.state.showDelBtn?<Button type='danger' icon="delete" onClick={this.deleteSeletedRows}>删除</Button>:''}
        </div>

        <Alert className="marginBt16px" message={(
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{this.state.seletedRows.length}</a> 项
            <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
          </div>
        )} type="info" showIcon >
          <a href="">关闭</a>
        </Alert>
        <Table
          rowSelection={{
            selectedRowKeys:this.state.seletedRows,
            onChange: this.onSaveSeletedRows}}
          dataSource={data}
          columns={this.Columns}
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
