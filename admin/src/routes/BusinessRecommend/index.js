import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Breadcrumb} from 'antd';
import styles from './app.css'
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import PageModal from './PageModal'
import {routerRedux} from 'dva/router'

const {push} = routerRedux;
class BusinessRecommend extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'businessRecommend';
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
    this.props.dispatch(push('/bussiness/add'))
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
      //新页面方法
      goDetail: (record)=> {
        this.props.dispatch(push(`/bussiness/${record.id}`))
      },

    };
    const modalProps = {
      item: this.props.currModel.modalType === 'create' ? {} : this.props.currModel.currentItem,
      fileList:this.props.currModel.fileList,
      modalType: this.props.currModel.modalType,
      visible: this.props.currModel.modalVisible,
      maskClosable: true,
      currentUser: this.props.login,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title: `${this.props.currModel.modalType === 'create' ? '新建推荐业务设置' :this.props.currModel.isDetail?'chakan': '更新推荐业务设置'}`,
      wrapClassName: 'vertical-center-modal',
      isDetail:this.props.currModel.isDetail,
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
        {this.props.children ? this.props.children :
          <div>
            <SearchContent {...searchProps}/>
            <DataTable {...tableProps}/>
          </div>}
        {this.props.currModel.modalVisible && <PageModal {...modalProps} />}
      </div>
    )
  }
}

BusinessRecommend.propTypes = {
  currModel: PropTypes.object,
  dispatch: PropTypes.func,
  gift_type: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default connect(({businessRecommend, app, loading,login})=>({
  currModel: businessRecommend,
  app,
  loading,
  login
}))(BusinessRecommend)
