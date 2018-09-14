import React from 'react';
import PropTypes from 'prop-types';
import {Table, Spin, Modal,Button,Alert,Badge} from 'antd';
import Func from "../../utils/publicFunc"
import DropOption from '../../components/DropOption'
import styles from './app.css'
const confirm = Modal.confirm

const statusMap = ['default','processing'];
const statusText = ['停业','营业'];


class DataTable extends React.Component {
  state = {
    seletedRows:[],
    showDelBtn:false,
  }
  constructor(props) {
    super(props);
    this.Columns = [{
      title: '网点名称',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '所属区域',
      dataIndex: 'area.name',
      key: 'area'
    },{
      title: '地址',
      dataIndex: 'address',
      key: 'address'
    },{
      title: '电话',
      dataIndex: 'phone',
      key: 'phone'
    },{
      title: '经纬度',
      dataIndex: 'long',
      key: 'longlat',
      render:(obj,record)=>{
        return obj?(record.long+','+record.lat):'';
      }
    },{
      title: '一级网点',
      dataIndex: 'is_parent',
      key: 'is_parent',
      render:(is_parent)=>{
        return is_parent?'是':'否';
      }
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render:(stat)=>{
        return <Badge status={statusMap[stat]} text={statusText[stat]} />;
      }
    }, {
      title: '操作',
      key: 'operation',
      width:80,
      render: (text, record) => {
        return <DropOption onMenuClick={e => this.handleMenuClick(record, e)}
                           menuOptions={[{key: '1', name: '编辑'}, {key: '2', name: '删除'}]}/>
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
