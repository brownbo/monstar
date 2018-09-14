import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Breadcrumb } from 'antd';
import styles from './app.css'
import SearchContent from './SearchContent'
import DataTable from './DataTable'
import PageModal from './PageModal'

class Banner extends React.Component {
  state = {
    query: {}, //搜索条件，翻页会默认取这里的值
  }
  constructor(props) {
    super(props);
    this.api_name = 'banner';
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

  SearchDateByQuery = (query) => {
    const pagination = this.props.currModel.pagination;
    this.props.dispatch({
      type: `${this.api_name}/query`,
      payload: {
        page: 1,
        limit: pagination.pageSize,
        query
      },
    });
    this.setState({ query: query });
  }
  DeleteDate = (value) => {
    this.props.dispatch({
      type: `${this.api_name}/delete`,
      payload: value,
    });
  }
  addBtn = () => {
    this.props.dispatch({
      type: `${this.api_name}/showModal`,
      payload: {
        modalType: 'create',
      },
    })
  }

  getDefault_data = () => {
    this.props.dispatch({ type: 'shop/getDefault_data', })
    this.props.dispatch({ type: 'gift/getDefault_data', })
    this.props.dispatch({ type: 'voucher/getDefault_data', })
    this.props.dispatch({ type: 'goods/getDefault_data', })
    this.props.dispatch({ type: 'businessRecommend/getDefault_data', })
  }
  getSearch_data = (type, value) => {
    this.props.dispatch({
      type: `${type}/getSearch_data`,
      payload: {
        query: { name: value }
      }
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
              query: this.state.query,
            },
          });
        },
        onChange: (current) => {
          this.props.dispatch({
            type: `${this.api_name}/query`,
            payload: {
              page: current,
              query: this.state.query,
            },
          });
        },
      },
      onEditItem: (item) => {
        const fileList = item.img ? [{
          uid: -1,
          name: 'default.png',
          status: 'done',
          url: item.img,
          response: { success: true, url: item.img }
        }] : [];
        this.props.dispatch({
          type: `${this.api_name}/showModal`,
          payload: {
            modalType: 'update',
            currentItem: item,
            fileList
          },
        })
      },
    }; //gift,goods,voucher,shop,businessRecommend
    const modalProps = {
      item: this.props.currModel.modalType === 'create' ? {} : this.props.currModel.currentItem,
      fileList: this.props.currModel.fileList,
      modalType: this.props.currModel.modalType,
      visible: this.props.currModel.modalVisible,
      search_data: [this.props.gift.search_data, this.props.goods.search_data, this.props.voucher.search_data, this.props.shop.search_data, this.props.businessRecommend.search_data, ],
      default_data: [this.props.gift.default_data, this.props.goods.default_data, this.props.voucher.default_data, this.props.shop.default_data, this.props.businessRecommend.default_data, ],
      getDefault_data: this.getDefault_data,
      getSearch_data: this.getSearch_data,
      maskClosable: true,
      confirmLoading: this.props.loading.effects[`${this.api_name}/${this.props.currModel.modalType}`],
      title: `${this.props.currModel.modalType === 'create' ? '新建Banner' : '更新Banner'}`,
      BtnOk: (data) => {
        this.props.dispatch({
          type: `${this.api_name}/${this.props.currModel.modalType}`,
          payload: data,
        })
      },
      onCancel: () => {
        this.props.dispatch({
          type: `${this.api_name}/hideModal`,
        })
      },
      updateFile: (fileList) => {
        this.props.dispatch({
          type: `${this.api_name}/updateState`,
          payload: { fileList }
        })
      },
      //展示裁剪图片  
      showCropImg: (data, file, name) => {
        const fileList = this.props.currModel.fileList.concat([file]);
        this.props.dispatch({
          type: `${this.api_name}/updateState`,
          payload: {
            editorImg: data,
            cropModalVisible: true,
            fileName: name,
            fileList,
            oldFile:file,
          }
        })
      },
      //裁剪图片组件所需参数
      cropImgProps: {
        cropSize: 16 / 9, //裁剪比列
        editorImg: this.props.currModel.editorImg,
        visible: this.props.currModel.cropModalVisible,
        maskClosable: false,
        title: "图片裁剪-比例(16:9)",
        confirmLoading: this.props.loading.effects[`${this.api_name}/uploadCropImg`],
        BtnOk: (data) => {
          this.props.dispatch({ type: `${this.api_name}/uploadCropImg`, payload: data, })
        },
        onCancel: () => {
          this.props.dispatch({
            type: `${this.api_name}/updateState`,
            payload: {
              cropModalVisible: false, //隐藏裁剪框
              fileList: this.props.currModel.fileList.filter(item => { return item.status }),
            }
          })
        },
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

Banner.propTypes = {
  currModel: PropTypes.object,
  dispatch: PropTypes.func,
  banner: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default connect(({ banner, app, loading, gift, goods, voucher, shop, businessRecommend }) => ({ currModel: banner, app, loading, gift, goods, voucher, shop, businessRecommend }))(Banner)