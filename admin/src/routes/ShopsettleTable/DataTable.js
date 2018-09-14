import React from 'react';
import PropTypes from 'prop-types';
import {Table, Spin, Modal, Button, Alert} from 'antd';
import Func from "../../utils/publicFunc"
import DropOption from '../../components/DropOption'
import styles from './app.css'
const confirm = Modal.confirm


class DataTable extends React.Component {
  state = {
    seletedRows: [],
    showDelBtn: false,
  }

  constructor(props) {
    super(props);
    this.Columns = [{
      title: '商户名称',
      dataIndex: 'shop.name',
      key: 'shopname'
    }, {
      title: '总积分',
      dataIndex: 'total_points',
      key: 'total_points'
    }, {
      title: '折扣',
      dataIndex: 'discount',
      key: 'discount'
    }, {
      title: '实际积分',
      dataIndex: 'real_points',
      key: 'real_points'
    }, {
      title: '实际金额(单位:元)',
      dataIndex: 'amount',
      key: 'amount',
      render:(amount)=>{
        return Func.price(amount)
      }
    }, {
      title: '结算时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time)=> {
        return Func.getDate_ymdhms(time);
      },
      width: 140
    }, {
      title: '操作',
      key: 'operation',
      width: 80,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => this.handleMenuClick(record, e)}
                           menuOptions={[{key: '1', name: '查看'}]}/>
      },
    }];
  }

  handleMenuClick = (record, e) => {

    this.props.onEditItem(record);

  }
  onSaveSeletedRows = (keys)=> {
    this.setState({
      seletedRows: keys,
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
          seletedRows: [],
        })
      },
    })
  }
  cleanSelectedKeys = (event) => {
    event.preventDefault();
    this.setState({
      seletedRows: [],
      showDelBtn: false,
    })
  }

  render() {
    const {data, TableSize, loading, pagination} = this.props;

    return (
      <Spin tip="加载中..." spinning={loading}>
        <div className="marginBt16px">
          {/*  {this.state.showDelBtn?<Button type='danger' icon="delete" onClick={this.deleteSeletedRows}>删除</Button>:''}*/}
        </div>

        {/*<Alert className="marginBt16px" message={(
         <div>
         已选择 <a style={{ fontWeight: 600 }}>{this.state.seletedRows.length}</a> 项
         <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
         </div>
         )} type="info" showIcon >
         <a href="">关闭</a>
         </Alert>*/}
        <Table

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
}
;

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
