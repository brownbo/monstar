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
    this.Columns = [{
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 140
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 140
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 140
    }, , {
      title: '商品编号',
      dataIndex: 'shop_code',
      key: 'shop_code',
      width: 140
    },{
      title: '图片',
      dataIndex: 'img',
      key: 'img',
      width:140,
      render:(imgs)=>{
        if(imgs){
          const imgComp =  imgs.split(',').map(img=>{
            return (<img key={img} onClick={e=>{this.handlePreview(img)}} src={img} className="table_img" alt="点击预览"/>)
          })
          return imgComp;
        }
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
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
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
