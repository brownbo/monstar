import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Button,Breadcrumb} from 'antd';
import styles from './app.css'
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import PageModal from './PageModal'


class Area extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'area';
  }
  componentDidMount() {
    this.props.dispatch({type: `${this.api_name}/query`,});
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
  addAreaBtn = ()=> {
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
      addAreaBtn: this.addAreaBtn,
      delLoading: this.props.loading.effects[`${this.api_name}/delete`],
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
          type: `${this.api_name}/showParentArea`,
          payload: {},
        })
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
      currentItem: this.props.currModel.modalType === 'create' ? {} : this.props.currModel.currentItem,
      default_data: this.props.currModel.default_data,
      search_data: this.props.currModel.search_data,
      modalType: this.props.currModel.modalType,
      visible: this.props.currModel.modalVisible,
      maskClosable: true,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title: `${this.props.currModel.modalType === 'create' ? '新建区域' : '更新区域'}`,
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
      default_model_func: (value) => {
        this.props.dispatch({type: `${this.api_name}/getDefault_data`,})
      },
      search_model_func: (value) => {
        this.props.dispatch({
          type: `${this.api_name}/getSearch_data`,
          payload: {
            query: {name: value}
          }
        })
      }
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

Area.propTypes = {
  currModel: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default connect(({area, app, loading})=>({currModel: area, app, loading}))(Area)
