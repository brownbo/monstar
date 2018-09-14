import React from 'react';
import PropTypes from 'prop-types';
import {Table, Spin, Modal, Button, Alert, Badge} from 'antd';
import {Link} from 'dva/router';
import Func from "../../utils/publicFunc"
import DropOption from '../../components/DropOption'
import styles from './app.css'
const confirm = Modal.confirm

const statusMap = ['default', 'processing'];
const statusText = ['待上架', '已上架'];
const statusArrayExam = ['新申请','申请受理', '审核失败', '审核成功'];

class DataTable extends React.Component {
  state = {
    seletedRows: [],
    showDelBtn: false,
    previewVisible: false,
    previewImage: '',
  }

  constructor(props) {
    super(props);
    const tab = this.props.tab;

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
    }else if(e.key === '3'){
      this.props.onExamineItem(record);
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
      previewImage: url,
      previewVisible: true,
    });
  }
  handleCancel = () => this.setState({previewVisible: false})
  render() {
    const {data, TableSize, loading, pagination,tab} = this.props;
    const {previewVisible, previewImage,} = this.state;
    let Columns;
    if (tab === 1) {
      Columns = [{
        title: '商户名称',
        dataIndex: 'name',
        key: 'name',
        render: (name,record)=>{
          return <Link to={`/shops/show/${record.id}`}>{name}</Link>
        }
      }, {
        title: '注册状态',
        dataIndex: 'sign_status',
        key: 'sign_status',
        render: (status)=> {
          return status == 1 ? '已注册' : '未注册'
        },
      }, {
        title: '商户类型',
        dataIndex: 'shop_type.name',
        key: 'shop_type',
      }, {
        title: '商户图片',
        dataIndex: 'shop_img',
        key: 'shop_img',
        render: (imgs)=> {
          if (imgs) {
            const imgComp = imgs.split(',').map(img=> {
              return (<img key={img} onClick={e=> {
                this.handlePreview(img)
              }} src={img} className="table_img" alt="点击预览"/>)
            })
            return imgComp;
          }
        }
      }, {
        title: '商户经营人',
        dataIndex: 'connect_person',
        key: 'connect_person',
      }, {
        title: '联系电话',
        dataIndex: 'connect_phone',
        key: 'connect_phone',
      }, {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
      }, {
        title: '启用状态',
        dataIndex: 'status',
        key: 'status',
        render: (status)=> {
          return <Badge status={statusMap[status?1:0]} text={statusText[status?1:0]}/>;
        }
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
    } else {
      Columns = [{
        title: '商户名称',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        render: (name,record)=>{
          return <Link to={`/shops/show/${record.id}`}>{name}</Link>
        }
      }, {
        title: '是否本行商户',
        dataIndex: 'is_thefamily',
        key: 'is_thefamily',
        width: 110,
        render: (is_thefamily)=> {
          return is_thefamily ? '是' : '否';
        }
      }, {
        title: '商户图片',
        dataIndex: 'shop_img',
        key: 'shop_img',
        width: 150,
        render: (imgs)=> {
          if (imgs) {
            const imgComp = imgs.split(',').map(img=> {
              return (<img key={img} onClick={e=> {
                this.handlePreview(img)
              }} src={img} className="table_img" alt="点击预览"/>)
            })
            return imgComp;
          }
        }
      }, {
        title: '营业执照图片',
        dataIndex: 'business_img',
        key: 'business_img',
        width: 150,
        render: (imgs)=> {
          if (imgs) {
            const imgComp = imgs.split(',').map(img=> {
              return (<img key={img} onClick={e=> {
                this.handlePreview(img)
              }} src={img} className="table_img" alt="点击预览"/>)
            })
            return imgComp;
          }
        }
      }, {
        title: '商户经营人',
        dataIndex: 'connect_person',
        key: 'connect_person',
        width: 100,
      }, {
        title: '经营范围',
        dataIndex: 'shop_desc',
        key: 'shop_desc',
      }, {
        title: '联系电话',
        dataIndex: 'connect_phone',
        key: 'connect_phone',
        width: 100,
      }, {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        width: 250
      }, {
        title: '发起时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (value)=> {
          return Func.getDate_ymdhms(value);
        },
        width: 140
      }, {
        title: '状态',
        dataIndex: 'examine_status',
        key: 'examine_status',
        width: 80,
        render: (stat)=> {
          return statusArrayExam[stat];
        }
      }, {
        title: '操作',
        key: 'operation',
        width: 80,
        fixed: 'right',
        render: (text, record) => {
          return <DropOption onMenuClick={e => this.handleMenuClick(record, e)}
                             menuOptions={[{key: '3', name: '审核'}, {key: '2', name: '删除'}]}/>
        },
      }];
    }
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
          columns={Columns}
          size={TableSize}
          bordered
          simple
          scroll={{x: tab===1?1500:1700}}
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
