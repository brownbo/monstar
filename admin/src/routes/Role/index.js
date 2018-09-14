import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Breadcrumb} from 'antd';
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import PageModal from './PageModal'


class Role extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'role';
  }

  componentDidMount() {
    const pagination = this.props.currModel.pagination;
    this.props.dispatch({type: `${this.api_name}/query`})}

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
        checkedList:{}
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
            checkedList:item.power?JSON.parse(item.power):{},
          },
        })
      },
    };
    const modalProps = {
      item: this.props.currModel.modalType === 'create' ? {} : this.props.currModel.currentItem,
      modalType: this.props.currModel.modalType,
      visible: this.props.currModel.modalVisible,
      maskClosable: true,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title: `${this.props.currModel.modalType === 'create' ? '新建角色' : '更新角色'}`,
      wrapClassName: 'vertical-center-modal',
      checkedList:this.props.currModel.checkedList,
      checkedListChange: (checkedList)=> {
        this.props.dispatch({
          type: `${this.api_name}/updateCheckedList`,
          payload: {
            checkedList: checkedList,
          },
        })
      },
      deleteMenuChecked: (menu)=> {
        this.props.dispatch({
          type: `${this.api_name}/deleteMenuChecked`,
          payload: {
            menu,
          },
        })
      },
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
        <Breadcrumb routes={this.props.routes} params={this.props.params}/>
        <SearchContent {...searchProps}/>
        <DataTable {...tableProps}/>
        {this.props.currModel.modalVisible && <PageModal {...modalProps} />}
      </div>
    )
  }
}

Role.propTypes = {
  currModel: PropTypes.object,
  shop: PropTypes.object,
  role: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default connect(({role, app, loading})=>({currModel: role, app, loading}))(Role)
