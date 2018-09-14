import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Breadcrumb} from 'antd';
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import PageModal from './PageModal'


class User extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'user';
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
    this.props.dispatch({
      type: `${this.api_name}/query`,
      payload: {
        page: 1,
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
  getDefault_data = ()=> {
    this.props.dispatch({type: 'role/getDefault_data'})
  }
  getRoleSearch_data = (query)=> {
    this.props.dispatch({
      type: 'role/getSearch_data',
      payload:{
        query:{name:query}
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
        this.props.dispatch({
          type: `${this.api_name}/showModal`,
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
    };
    const modalProps = {
      item: this.props.currModel.modalType === 'create' ? {} : this.props.currModel.currentItem,
      default_data:this.props.role.default_data,
      search_data:this.props.role.search_data,
      getDefault_data:this.getDefault_data,
      getRoleSearch_data:this.getRoleSearch_data,
      modalType: this.props.currModel.modalType,
      visible: this.props.currModel.modalVisible,
      maskClosable: true,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title: `${this.props.currModel.modalType === 'create' ? '新建系统用户' : '更新系统用户信息'}`,
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
    }

    return (
      <div className="data_content">
        <Breadcrumb routes={this.props.routes} params={this.props.params} />
        <SearchContent {...searchProps}/>
        <DataTable {...tableProps}/>
        {this.props.currModel.modalVisible && <PageModal {...modalProps} />}
      </div>
    )
  }
}

User.propTypes = {
  currModel: PropTypes.object,
  user: PropTypes.object,
  role: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default connect(({user,role,app, loading})=>({currModel: user,role, app,loading}))(User)
