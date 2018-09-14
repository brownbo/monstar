import React from 'react';
import PropTypes from 'prop-types';
import {Table, Spin, Modal, Button, Alert, Badge} from 'antd';
import Func from "../../utils/publicFunc"
import DropOption from '../../components/DropOption'
import PageModal from './PageModal'
import styles from './app.css'
const confirm = Modal.confirm

const settlement_cycle_array = ['日结算', '周结算','月结算'];


class DataTable extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
  }
  constructor(props) {
    super(props);

  }

  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      this.props.onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: '确定删除该商户周期设置吗?',
        onOk: ()=> {
          this.props.DeleteSettlement(record.id,{is_settlement:0});
        },
        maskClosable: true,
      })
    }
  }
  onSaveSeletedRows = (keys)=> {
    this.props.onSeletedKeys(keys);
  }
  deleteSeletedRows = ()=> {
    confirm({
      title: '确定删除吗?',
      onOk: ()=> {
        this.props.DeleteSettlement(this.props.seletedRows.toString(),{is_settlement:0});
        this.props.onSeletedKeys([]);
      },
      maskClosable: true,
    })
  }
  cleanSelectedKeys = (event) => {
    event.preventDefault();
    this.props.onSeletedKeys([]);
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
    const Columns = [{
      title: '商户名称',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '结算周期',
      dataIndex: 'settlement_cycle',
      key: 'settlement_cycle',
      render:(settlement_cycle,record)=>{
        return record.is_settlement===1?settlement_cycle_array[settlement_cycle]:'未设置';
      }
    }, {
      title: '联系人',
      dataIndex: 'connect_person',
      key: 'connect_person',
    }, {
      title: '联系电话',
      dataIndex: 'connect_phone',
      key: 'connect_phone',
    }, {
      title: '操作',
      key: 'operation',
      width: 80,
      fixed: 'right',
      render: (text, record) => {
        const menus = tab===1?[{key: '1', name: '设置'}]:[{key: '1', name: '编辑'}, {key: '2', name: '删除'}];
        return <DropOption onMenuClick={e => this.handleMenuClick(record, e)}
                           menuOptions={menus}/>
      },
    }];
    const {onShowModal_two,modalVisible,confirmLoading,BtnOk,onCancel,seletedRows} = this.props;
    const {previewVisible, previewImage,} = this.state;
    const modalProps = {
      currentItem: {},
      visible: modalVisible,
      maskClosable: true,
      confirmLoading: confirmLoading,
      title:'结算周期设置',
      wrapClassName: 'vertical-center-modal',
      BtnOk: (data)=>{
        BtnOk(seletedRows.toString(),data);
      },
      onCancel:onCancel,
    }

    return (
      <Spin tip="加载中..." spinning={loading}>
        <div className="marginBt16px">
          {seletedRows.length ?
          tab===1?<Button type='primary' icon="setting" onClick={onShowModal_two}>设置</Button>
            :
          <Button type='danger' icon="delete" onClick={this.deleteSeletedRows}>删除</Button>

            : ''}
        </div>

        <Alert className="marginBt16px" message={(
          <div>
            已选择 <a style={{fontWeight: 600}}>{seletedRows.length}</a> 项
            <a onClick={this.cleanSelectedKeys} style={{marginLeft: 24}}>清空</a>
          </div>
        )} type="info" showIcon>
          <a href="">关闭</a>
        </Alert>
        <Table
          rowSelection={{
            selectedRowKeys: seletedRows,
            onChange: this.onSaveSeletedRows
          }}
          dataSource={data}
          columns={Columns}
          size={TableSize}
          bordered
          simple
          pagination={pagination}
        />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
        {modalVisible && <PageModal {...modalProps} />}
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
