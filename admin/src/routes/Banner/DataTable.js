import React from 'react';
import PropTypes from 'prop-types';
import {Table, Spin, Modal,Button,Alert,Badge} from 'antd';
import DropOption from '../../components/DropOption'
const confirm = Modal.confirm

const statusMap = ['default','processing'];
const statusText = ['禁用','启用'];
const typeText = ['礼品','商品','代金券','商户','推荐业务'];

class DataTable extends React.Component {
  state = {
    seletedRows:[],
    showDelBtn:false,
    previewVisible: false,
    previewImage: '',
  }
  constructor(props) {
    super(props);
    this.Columns = [{
      title: 'Banner名称',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '图片',
      dataIndex: 'img',
      key: 'img',
      render:(img)=>{
        return (<img onClick={e=>{this.handlePreview(img)}} src={img} className="table_img" alt="点击预览"/>)
      }
    },{
      title: '关联业务类型',
      dataIndex: 'type',
      key: 'type',
      render:(type)=>{
        return typeText[type];
      }
    },{
      title: '关联业务名称',
      dataIndex: 'type',
      key: 'biss_name',
      render:(type,record)=>{
        const obj = [record.gift,record.goods,record.voucher,record.shop,record.business_recommend][type];
         return obj?obj.name:''
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
  handlePreview = (url) => {
    this.setState({
      previewImage:url,
      previewVisible: true,
    });
  }
  handleCancel = () => this.setState({previewVisible: false})
  render() {
    const {data,TableSize,loading,pagination} = this.props;
    const {previewVisible, previewImage,} = this.state;
    return (
      <div>
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
      <Spin tip="加载中..." spinning={loading}>
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
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </Spin>
      </div>
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
