import React from 'react';
import PropTypes from 'prop-types';
import {Table, Spin, Modal, Button, Alert,Badge} from 'antd';
import {Link} from 'dva/router';
import Func from "../../utils/publicFunc"
import DropOption from '../../components/DropOption'
import styles from './app.css'
const confirm = Modal.confirm

const statusMap = ['default','processing'];
const statusText = ['禁用','启用'];
const examineStatusText = ['新单','','审核不通过','审核通过'];
const payTypeText = ['积分','支付','积分+支付'];

//商品
class DataTable extends React.Component {
  state = {
    seletedRows: [],
    showDelBtn: false,
    previewVisible: false,
    previewImage: '',
  }
  constructor(props) {
    super(props);
    this.Columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (name,record)=>{
        return <Link to={`/gift/show/${record.id}`}>{name}</Link>
      }
    }, {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    }, {
      title: '分类',
      dataIndex: 'gift_type.name',
      key: 'gift_type',
    }, {
      title: '图片',
      dataIndex: 'imgs',
      key: 'imgs',
      render:(imgs)=>{
        if(imgs){
          const imgComp =  imgs.split(',').map(img=>{
            return (<img key={img} onClick={e=>{this.handlePreview(img)}} src={img} className="table_img" alt=""/>)
          })
          return imgComp;
        }
      }
    }, {
      title: '是否热门',
      dataIndex: 'is_hot',
      key: 'is_hot',
      render: (is_hot)=> {
        return is_hot ? '热门' : '非热门';
      },
    }, {
      title: '兑换积分',
      dataIndex: 'exch_points',
      key: 'exch_points',
    }, {
      title: '金额支付',
      dataIndex: 'price',
      key: 'price',
      render:(price)=>{
        return Func.price(price)
      }
    }, {
      title: '是否是活动',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active)=> {
        return is_active ? '是' : '否';
      }
    }, {
      title: '支付方式',
      dataIndex: 'pay_type',
      key: 'pay_type',
      render: (pay_type)=> {
        return payTypeText[pay_type];
      },
    }, {
      title: '是否启用',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (stat)=> {
        return <Badge status={statusMap[stat]} text={statusText[stat]} />;
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 80,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => this.handleMenuClick(record, e)}
                           menuOptions={[{key: '1', name: '编辑'}, {key: '2', name: '删除'}]}/>
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
  handlePreview = (url) => {
    this.setState({
      previewImage:url,
      previewVisible: true,
    });
  }
  handleCancel = () => this.setState({previewVisible: false})
  render() {
    const {data, TableSize, loading, pagination} = this.props;
    const {previewVisible, previewImage,} = this.state;
    return (
      <Spin tip="加载中..." spinning={loading}>
        <div className="marginBt16px">
          <Button type='primary' className="marginRight10" icon="plus" onClick={this.props.addBtn}>新增</Button>
          {this.state.showDelBtn ?
            <Button type='danger' icon="delete" onClick={this.deleteSeletedRows}>删除</Button> : ''}
        </div>

        <Alert className="marginBt16px" message={(
          <div>
            已选择 <a style={{fontWeight: 600}}>{this.state.seletedRows.length}</a> 项
            <a onClick={this.cleanSelectedKeys} style={{marginLeft: 24}}>清空</a>
          </div>
        )} type="info" showIcon>
          <a href="">关闭</a>
        </Alert>
        <Table
          rowSelection={{
            selectedRowKeys: this.state.seletedRows,
            onChange: this.onSaveSeletedRows
          }}
          dataSource={data}
          columns={this.Columns}
          size={TableSize}
          bordered
          simple
          scroll={{x: 1700}}
          pagination={pagination}
        />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
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
