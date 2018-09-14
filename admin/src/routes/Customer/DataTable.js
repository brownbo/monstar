import React from 'react';
import PropTypes from 'prop-types';
import {Table, Spin, Modal,Button,Alert} from 'antd';
import Func from "../../utils/publicFunc"
import DropOption from '../../components/DropOption'
import styles from './app.css'
const confirm = Modal.confirm


const typeArray = ['','普通客户','pos商户'];
class DataTable extends React.Component {
  state = {
    seletedRows:[],
    showDelBtn:false,
  }
  constructor(props) {
    super(props);
    this.Columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '客户类型',
      dataIndex: 'user_type',
      key: 'user_type',
      render:(type,record)=>{
        return `${typeArray[type]}-${type===1?record.customer_code:record.merchant_code}`;
      }
    }, {
      title: '商户',
      dataIndex: 'shop.name',
      key: 'shop',
    },{
      title: '证件编号',
      dataIndex: 'certificate_code',
      key: 'certificate_code'
    }, {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    }, {
      title: '密码',
      dataIndex: 'password',
      key: 'password',

    },
      /*{
      title: '操作',
      key: 'operation',
      width:80,
      render: (text, record) => {
        return '';
        //return <DropOption onMenuClick={e => this.handleMenuClick(record, e)}
         //                  menuOptions={[{key: '1', name: '编辑'}, {key: '2', name: '删除'}]}/>
      },
    }*/];
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
        maskClosable: true,
        confirmLoading:this.props.delLoading,
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
      confirmLoading:this.props.delLoading,
      maskClosable:true,
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
          bordered
          simple
          pagination={pagination}
        />
      </Spin>
    );
  }
};

DataTable.propTypes = {
  onEditItem: PropTypes.func,
  loading: PropTypes.bool,
  data: PropTypes.array,
  TableSize: PropTypes.string,
  deleteSeletedRows: PropTypes.func,
  pagination: PropTypes.object,
  delLoading: PropTypes.bool,
};

export default DataTable;
