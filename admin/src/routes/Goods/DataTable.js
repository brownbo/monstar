import React from 'react';
import PropTypes from 'prop-types';
import {Table, Spin, Modal, Button, Alert,Badge} from 'antd';
import {Link} from 'dva/router';
import Func from "../../utils/publicFunc"
import DropOption from '../../components/DropOption'
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
        return <Link to={`/goods/show/${record.id}`}>{name}</Link>
      }
    }, {
      title: '商户',
      dataIndex: 'shop.name',
      key: 'shop',
    }, {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '首页图',
      dataIndex: 'previews',
      key: 'previews',
      width:120,
      render:(imgs)=>{
        if(imgs){
          const imgComp =  imgs.split(',').map(img=>{
            return (<img key={img} onClick={e=>{this.handlePreview(img)}} src={img} className="table_img" alt="点击预览"/>)
          })
          return imgComp;
        }
      }
    }, {
      title: '详情图',
      dataIndex: 'goods_detail',
      key: 'goods_detail',
      width:120,
      render:(imgs)=>{
        if(imgs){
          const imgComp =  imgs.split(',').map(img=>{
            return (<img key={img} onClick={e=>{this.handlePreview(img)}} src={img} className="table_img" alt="点击预览"/>)
          })
          return imgComp;
        }
      }
    }, {
      title: '数量',
      dataIndex: 'sum_count',
      key: 'sum_count',

    }, {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render:(price)=>{
        return Func.price(price)
      }
    }, {
      title: '兑换积分',
      dataIndex: 'exch_points',
      key: 'exch_points',
    }, {
      title: '支付方式',
      dataIndex: 'pay_type',
      key: 'pay_type',
      render: (pay_type)=> {
        return payTypeText[pay_type];
      },
    }, {
      title: '发起时间',
      dataIndex: 'commit_time',
      key: 'commit_time',
      render:(time)=>{
          return Func.getDate_ymdhms(time);
      }
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
        let menu = [];
        if(record.examine_status===0) {
          menu = [{key: '3', name: '审核'},{key: '2', name: '删除'}];
        }else if(record.examine_status===3){
          menu = [{key: '1', name: '编辑'}, {key: '2', name: '删除'},];
        }else{
          menu = [{key: '2', name: '删除'}];
        }
        return <DropOption onMenuClick={e => this.handleMenuClick(record, e)}
                           menuOptions={menu}/>
      },
    }];
  }
  componentDidMount(){
    this.props.getDefaultDate();
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
    }else{
      this.props.onEditItem(record);
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
          scroll={{x: 1500}}
          pagination={pagination}
        />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
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
  onSaveSeletedRows: PropTypes.func,
  pagination: PropTypes.object,
  delLoading: PropTypes.bool,
};

export default DataTable;
