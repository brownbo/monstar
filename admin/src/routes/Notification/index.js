import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Breadcrumb} from 'antd';
import styles from './app.css'
import DataTable from './DataTable'
import PageModal from './PageModal'


class Gift_type extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'notification';
  }
  componentDidMount() {
    this.props.dispatch({
      type: `${this.api_name}/query`,
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
      modalType: this.props.currModel.modalType,
      visible: this.props.currModel.modalVisible,
      maskClosable: true,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title: `${this.props.currModel.modalType === 'create' ? '新建告知书' : '更新告知书'}`,
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
        <div className="marginTop10"></div>
        <DataTable {...tableProps}/>
        {this.props.currModel.modalVisible && <PageModal {...modalProps} />}
      </div>
    )
  }
}

Gift_type.propTypes = {
  currModel: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default connect(({notification,app, loading})=>({currModel: notification, app,loading}))(Gift_type)
