import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Breadcrumb} from 'antd';
import styles from './app.css'
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import PageModal from './PageModal'


class Merchant extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'merchant';
  }

  componentDidMount() {
    const pagination = this.props.currModel.pagination;
    this.props.dispatch({
      type: `${this.api_name}/query`,
      payload: {
        page: pagination.current,
        limit: pagination.pageSize,
      },
    });
  }

  SearchDateByQuery = (query)=> {
    const pagination = this.props.currModel.pagination;
    this.props.dispatch({
      type: `${this.api_name}/query`,
      payload: {
        page: 1,
        limit: pagination.pageSize,
        query
      },
    });
    this.setState({query:query});
  }
  DeleteDate = (value)=> {
    this.props.dispatch({
      type: `${this.api_name}/delete`,
      payload: value,
    });
  }
  addBtn = ()=> {
    this.props.dispatch({
      type: `${this.api_name}/showModal`,
      payload: {
        modalType: 'create',
      },
    })
  }

  render() {
    const searchProps = {
      SearchDateByQuery: this.SearchDateByQuery,
    };
    const tableProps = {
      TableSize: this.props.app.TableSize,
      loading: this.props.loading.effects[`${this.api_name}/query`],
      DeleteDate: this.DeleteDate,
      deleteSeletedRows: this.deleteSeletedRows,
      delLoading: this.props.loading.effects[`${this.api_name}/delete`],
      addBtn: this.addBtn,
      data: this.props.currModel.data,
      pagination: {
        ...this.props.currModel.pagination,
        onShowSizeChange: (current, pageSize) => {
          this.props.dispatch({
            type: `${this.api_name}/query`,
            payload: {
              page: current,
              limit: pageSize,
              query:this.state.query,
            },
          });
        },
        onChange: (current) => {
          this.props.dispatch({
            type: `${this.api_name}/query`,
            payload: {
              page: current,
              query:this.state.query,
            },
          });
        },
      },
      onEditItem: (item)=> {
        const fileList = item.img?[{
          uid: -1,
          name: 'default.png',
          status: 'done',
          url: item.img,
          response:{success:true,url:item.img}
        }]:[];
        this.props.dispatch({
          type: `${this.api_name}/showModal`,
          payload: {
            modalType: 'update',
            currentItem: item,
            fileList
          },
        })
      },
    };
    const modalProps = {
      item: this.props.currModel.modalType === 'create' ? {} : this.props.currModel.currentItem,
      fileList:this.props.currModel.fileList,
      modalType: this.props.currModel.modalType,
      visible: this.props.currModel.modalVisible,
      maskClosable: true,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title: `${this.props.currModel.modalType === 'create' ? '新建员工设置' : '更新员工设置'}`,
      wrapClassName: 'vertical-center-modal',
      BtnOk: (data)=> {
        this.props.dispatch({
          type: `${this.api_name}/${this.props.currModel.modalType}`,
          payload: data,
        })
      },
      onCancel: ()=> {
        this.props.dispatch({
          type: `${this.api_name}/hideModal`,
        })
      },
      updateFile:(fileList)=>{
        this.props.dispatch({
          type: `${this.api_name}/updateState`,
          payload:{fileList}
        })

      }
    }
    return (
      <div className="data_content">
        <Breadcrumb routes={this.props.routes} params={this.props.params}/>
        <SearchContent {...searchProps}/>
        <DataTable {...tableProps}/>
        {this.props.currModel.modalVisible && <PageModal {...modalProps} />}
      </div>
    )
  }
}

Merchant.propTypes = {
  currModel: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default connect(({merchant, app, loading})=>({
  currModel: merchant,
  app,
  loading
}))(Merchant)
