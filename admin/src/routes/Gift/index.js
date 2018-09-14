import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Button,Breadcrumb} from 'antd';
import { routerRedux  } from 'dva/router'
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import styles from './app.css'
const { push } = routerRedux;
class Gift extends React.Component {
  state = {
    query:{},//搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'gift';
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
  DeleteLi = (id)=> {
    this.props.dispatch({
      type: `${this.api_name}/delete`,
      payload: [id],
    });
  }

  deleteSeletedRows = (keys)=> {
    this.props.dispatch({
      type: `${this.api_name}/delete`,
      payload: keys,
    });
    this.setState({
      showDelBtn: false,
    })
  }
  addBtn = ()=> {
    this.props.dispatch(push('/gift/add'))
  }
  getGiftTypeDefalut_data = ()=> {
    this.props.dispatch({type: 'gift_type/getDefault_data'})
  }
  getGiftTypeSearch_data = (query)=> {
    this.props.dispatch({
      type: 'gift_type/getSearch_data',
      payload:{
        query:{name:query}
      },
    })
  }

  render() {
    const searchProps = {
      SearchDateByQuery: this.SearchDateByQuery,
      getGiftTypeDefalut_data:this.getGiftTypeDefalut_data,
      getGiftTypeSearch_data:this.getGiftTypeSearch_data,
      default_data:this.props.gift_type.default_data,
      search_data:this.props.gift_type.search_data,
      addBtn: this.addBtn,
    };
    const tableProps = {
      TableSize: this.props.app.TableSize,
      loading: this.props.loading.effects[`${this.api_name}/query`],
      DeleteLi: this.DeleteLi,
      deleteSeletedRows: this.deleteSeletedRows,
      data: this.props.currModel.data,
      addBtn:this.addBtn,
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
            },
          });
        },
      },
      goDetail:(record)=> {
        this.props.dispatch(push(`/gift/${record.id}`))
      },
      DeleteLi:this.DeleteLi,
    };
    return (
      <div className={styles.data_content}>
        <Breadcrumb  routes={this.props.routes} params={this.props.params} />
        {this.props.children?this.props.children:
          <div>
            <SearchContent {...searchProps}/>
            <DataTable {...tableProps}/>
          </div>}
      </div>
    )
  }
}

Gift.propTypes = {
  currModel: PropTypes.object,
  app: PropTypes.object,
  gift: PropTypes.object,
  gift_type: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default connect(({gift,gift_type,app, loading})=>({currModel: gift,gift_type,app, loading}))(Gift)
