import * as service from '../services/staff'
import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
//裁剪图片
import { uploadFile } from '../services/uploadFile'
const { goBack } = routerRedux;
import { pageModel } from './common'

const { query, create, update, del } = service

export default modelExtend(pageModel, {
  namespace: 'staff',
  state: {
    default_data: [], //其他页面中-默认显示的数据一般是10条
    search_data: [], //其他页面中-查询的数据一般是10条
    todoStatus: false, //编辑新增动作状态
    fileList: [], //已上传图片数组

    //裁剪图片所需参数
    cropModalVisible: false, //裁剪窗口
    editorImg: '', //裁剪图片之前的data base64
    fileName: '', //裁剪图片名称
    oldFile:''//裁剪之前原图片，如果不裁剪直接传原图片上去
  },
  reducers: {},
  effects: {
    * query({ payload = {} }, { call, put, select }) {
      const pagination = yield select(({ staff }) => staff.pagination);
      const page = payload.page ? payload.page : pagination.current;
      const limit = payload.limit ? payload.limit : pagination.pageSize;
      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
          include: 'netspot',
          ...payload.query,
        }
      }
      const data = yield call(query, opts)
      const list = data.rows.map(item => {
        return { ...item, key: item.id }
      })
      if (list.length === 0 && page !== 1) {
        yield put({
          type: 'query',
          payload: {
            page: page - Math.ceil(data.count / 10),
          },
        })
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            data: list,
            pagination: {
              current: page,
              pageSize: limit,
              total: data.count,
            },
          },
        })
      }
      if (payload.back) yield put(goBack());
    },
    * getDefault_data({ payload = {} }, { call, put }) {
      const opts = {
        query: {
          page: 1,
          limit: 10,
        }
      }
      const data = yield call(query, opts)
      yield put({
        type: 'updateState',
        payload: {
          default_data: data,
          search_data: [],
        },
      })
    },
    * getSearch_data({ payload = {} }, { call, put }) {
      const opts = {
        query: {
          page: 1,
          limit: 10,
          ...payload.query
        }
      }
      const data = yield call(query, opts)
      yield put({
        type: 'updateState',
        payload: {
          search_data: data,
        },
      })
    },

    * delete({ payload }, { call, put, select }) {
      const opts = {
        idArry: payload,
      }
      const data = yield call(del, opts)
      if (data === 0) {
        throw (data)
      }
      yield put({ type: 'query' })
    },
    * create({ payload }, { call, put }) {
      const opts = {
        ...payload
      }
      const results = yield call(query, {
        query: { phone: opts.phone }
      })
      if (results.length) {
        message.error('新增失败！该手机号已经注册');
      } else {
        const results_net = yield call(query, {
          query: { netspot_id: opts.netspot_id }
        })
        if (results_net.length) {
          message.error('新增失败！该网点已经有员工');
        } else {
          const data = yield call(create, opts)
          message.success('新增成功!');
          yield put({ type: 'hideModal' })
          yield put({ type: 'query' })
        }
      }
    },

    * update({ payload }, { select, call, put }) {
      const id = yield select(({ staff }) => staff.currentItem.id);
      const netspot_id = yield select(({ staff }) => staff.currentItem.netspot_id);
      const opts = {
        id,
        ...payload
      }
      if (parseInt(opts.netspot_id) !== netspot_id) {
        const results_net = yield call(query, {
          query: { netspot_id: opts.netspot_id }
        })
        if (results_net.length) {
          message.error('新增失败！该网点已经有员工');
        } else {
          const data = yield call(update, opts)
          message.success('更新成功!');
          yield put({ type: 'hideModal' })
          yield put({ type: 'query' })
        }
      } else {
        const data = yield call(update, opts)
        message.success('更新成功!');
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      }
    },
    //裁剪图片上传函数
    * uploadCropImg({ payload }, { select, call, put }) {
      const fileName = yield select(({ staff }) => staff.fileName);
      const fileList = yield select(({ staff }) => staff.fileList);
      const oldFile = yield select(({staff})=>staff.oldFile);
      const data = yield call(uploadFile, {data:payload?payload:oldFile,fileName})
      const newList = fileList.map(item => {
        if (item.status) {
          return item
        } else {
          return {
            ...item,
            status: 'done',
            name: fileName,
            url: data,
            response: { success: true, url: data }
          }
        }
      })
      yield put({
        type: 'updateState',
        payload: {
          fileList: newList,
          cropModalVisible: false,
          editorImg: '',
          fileName: '',
        },
      })
      message.success('上传成功!');
    },
  }
});