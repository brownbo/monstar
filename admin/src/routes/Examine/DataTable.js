import React from 'react';
import PropTypes from 'prop-types';
import {Table, Spin, Modal,Button,Alert} from 'antd';
import Func from "../../utils/publicFunc"
import DropOption from '../../components/DropOption'
import styles from './app.css'
const confirm = Modal.confirm


const statusArray = ['申请发起','申请通过','申请不通过'];
const allocationArray = ['未调拨','已调拨',];
class DataTable extends React.Component {
  state = {
    seletedRows:[],
    showDelBtn:false,
  }
  constructor(props) {
    super(props);
    this.Columns = [{
      title: '申请编号',
      dataIndex: 'id',
      key: 'id'
    },{
      title: '礼品名称',
      dataIndex: 'gift.name',
      key: 'gift'
    },{
      title: '申请网点',
      dataIndex: 'sub_netspot.name',
      key: 'sub_netspot'
    },{
      title:'申请数量',
      dataIndex: '_count',
      key: '_count'
    },{
      title:'通过数量',
      dataIndex: 'pass_count',
      key: 'pass_count'
    },{
      title: '申请人',
      dataIndex: 'applicant.name',
      key: 'applicant_id'
    },{
      title:'申请时间',
      dataIndex: 'application_time',
      key: 'application_time',
      render:(time)=>{
        return Func.getDate_ymdhms(time);
      }
    },{
      title:'审核人',
      dataIndex: 'examine_person.username',
      key: 'examine_person',
    },{
      title:'审核意见',
      dataIndex: 'option',
      key: 'option',
      render:(option,record)=>{
        return option?option:(record.status===1?'审核通过':'');

      }
    },{
      title:'审核时间',
      dataIndex: 'examine_time',
      key: 'examine_time',
      render:(time)=>{
        return time?Func.getDate_ymdhms(time):'';
      }
    },{
      title:'申请状态',
      dataIndex: 'status',
      key: 'status',
      render:(status)=>{
        return statusArray[status];
      }
    },{
      title:'是否调拨',
      dataIndex: 'is_allocation',
      key: 'is_allocation',
      render:(is_allocation,record)=>{
        return record.status===1?allocationArray[is_allocation]:'';
      }
    }, {
      title: '操作',
      key: 'operation',
      width:80,
      render: (text, record) => {
        let menu = [];
        if(record.status===0){//已申请
          menu = [{key: '1', name: '审核'},{key: '2', name: '删除'}];
        }else if(record.status===1&&!record.is_allocation){//通过
          menu = [{key: '3', name: '调拨'},{key: '2', name: '删除'}];
        }else{//不通过
          menu = [{key: '2', name: '删除'}];
        }
        return  <DropOption onMenuClick={e => this.handleMenuClick(record, e)}
                           menuOptions={menu}/>
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
    }else{
      this.props.onAllocaItem(record);
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
          scroll={{x:1300}}
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
