import React from 'react';
import PropTypes from 'prop-types';
import {Table, Spin, Modal, Button, Alert} from 'antd';
import Func from "../../utils/publicFunc"
import {Link} from 'dva/router';
import DropOption from '../../components/DropOption'
import styles from './app.css'
const confirm = Modal.confirm;
const typeArry = ['礼品','代金券','商品'];
const statusArry = {'-4':'退货中','-3':'退货成功','-2':'退货失败','-1':'申请退货','0':'新建','1':'支付中','2':'支付完成','3':'已核销'};
const sumStatusArry = ['支付','待结算','生成结算文件','已结算'];
//订单
class DataTable extends React.Component {
  state = {
    seletedRows: [],
    showDelBtn: false,
  }
  constructor(props) {
    super(props);
    this.Columns = [{
      title: '订单号',
      dataIndex: 'order_no',
      key: 'order_no', 
      render: (name,record)=>{
        return <Link className="order_no" to={`/orders/show/${record.id}`}>{name}</Link>
      }
    }, {
      title: '订单类型',
      dataIndex: 'type',
      key: 'type',
      render:(type)=>{
        return typeArry[type];
      }
    }, {
      title: '网点/商户',
      dataIndex: '',
      key: 'net_shop',
      render:(text,record)=>{
        if(record.type===0)return '(网点)'+(record.netspot?record.netspot.name:'');
        return '(商户)'+(record.shop?record.shop.name:'');
      }
    }, {
      title: '礼品/代金卷/商品',
      dataIndex: 'goods_id',
      key: 'goods',
      render:(text,record)=>{
        if(record.type===0)return '(礼品)'+(record.gift?record.gift.name:'');
        if(record.type===1)return '(代金券)'+(record.voucher?record.voucher.name:'');
        if(record.type===2)return '(商品)'+(record.goods?record.goods.name:'');
      }
    }, {
      title: '数量',
      dataIndex: '_count',
      key: '_count',
    }, {
      title: '兑换积分',
      dataIndex: 'exch_points',
      key: 'exch_points',
    }, {
      title: '金额支付',
      dataIndex: 'amount',
      key: 'amount',
      render:(price)=>{
        return Func.price(price)
      }
    }, {
      title: '支付方式',
      dataIndex: 'pay_type',
      key: 'pay_type',
      render: (pay_type)=> {
        if (pay_type === 0) return '积分';
        if (pay_type === 1) return '支付';
        if (pay_type === 2) return '积分+支付';
      },
    }, {
      title: '客户姓名',
      dataIndex: 'customer.name',
      key: 'customername',
    }, {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '核销人',
      dataIndex: 'verify_people_type',
      key: 'verify',
      render:(verify_people_type,record)=>{
        if(verify_people_type===1){//商户
          return record.verify_merchant?record.verify_merchant.name:'';
        }else{
          return record.verify_staff?record.verify_staff.name:'';
        }
      }
    }, {
      title: '生成时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render:(time)=>{
        return Func.getDate_ymdhms(time);
      }
    }, {
      title: '支付时间',
      dataIndex: 'pay_time',
      key: 'pay_time',
      render:(time)=>{
        return time?Func.getDate_ymdhms(time):'';
      }
    }, {
      title: '核销时间',
      dataIndex: 'verify_time',
      key: 'verify_time',
      render:(time)=>{
        return time?Func.getDate_ymdhms(time):'';
      }
    }, {
      title: '结算时间',
      dataIndex: 'sum_time',
      key: 'sum_time',
      render:(time)=>{
        return time?Func.getDate_ymdhms(time):'';
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status)=> {
        return statusArry[status];
      },
    }];
  }

  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      this.props.goDetail(record);
    } else if (e.key === '2') {
      confirm({
        title: '确定删除该条数据吗?',
        onOk: ()=> {
          this.props.DeleteLi(record.id);
        },
        maskClosable: true,
      })
    }
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
        this.props.deleteSeletedRows(this.state.seletedRows);
        this.setState({
          showDelBtn: false,
          seletedRows: [],
        })
      },
      maskClosable: true,
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
          {this.state.showDelBtn ?
            <Button type='danger' icon="delete" onClick={this.deleteSeletedRows}>删除</Button> : ''}
        </div>

        <Table
          dataSource={data}
          columns={this.Columns}
          size={TableSize}
          bordered
          simple
          scroll={{x: 1700}}
          pagination={pagination}
        />
      </Spin>
    );
  }
}

DataTable.propTypes = {
  DeleteArea: PropTypes.func,
  onEditItem: PropTypes.func,
  loading: PropTypes.bool,
  data: PropTypes.array,
  TableSize: PropTypes.string,
  onSaveSeletedRows: PropTypes.func,
  pagination: PropTypes.object,
  delLoading: PropTypes.bool,
};

export default DataTable;
