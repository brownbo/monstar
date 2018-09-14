import modelExtend from 'dva-model-extend'

const model = {
  state:{
    modalVisible:false,//弹出框是否显示
    currentItem: {},//当前编辑的哪条数据
    modalType: 'create',//弹出框或者新建页面对应工作  create 还是update

  },
  reducers: {
    showModal (state, { payload }) {
      const modalType = payload.modalType;
      if(modalType==='create')return { ...state, ...payload, modalVisible: true ,fileList:[]}
      if(modalType==='update')return { ...state, ...payload, modalVisible: true ,}
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

const pageModel = modelExtend(model, {

  state: {
    data: [],
    pagination: {
      size:'default',
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `总共 ${total} 条数据`,
      current: 1,
      pageSize:10,
      total: 0,
    },
  },

  reducers: {

    querySuccess (state, { payload }) {
      const { data, pagination } = payload
      return {
        ...state,
        data,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
  },
})


module.exports = {
  model,
  pageModel,
}
