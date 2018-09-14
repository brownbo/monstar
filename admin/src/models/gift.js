import * as service from '../services/gift'
import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
//裁剪图片
import { uploadFile } from '../services/uploadFile'
import { pageModel } from './common'
const { push } = routerRedux;
const { query, create, update, del } = service

export default modelExtend(pageModel, {
  namespace: 'gift',
  state: {
    default_data: [],
    search_data: [],
    fileList: [],
    default_data: [], //其他页面中-默认显示的数据一般是10条
    search_data: [], //其他页面中-查询的数据一般是10条

    //裁剪图片所需参数
    cropModalVisible: false, //裁剪窗口
    editorImg: '', //裁剪图片之前的data base64
    fileName: '', //裁剪图片名称
    oldFile:''//裁剪之前原图片，如果不裁剪直接传原图片上去
  },
  reducers: {},
  effects: {
    * query({ payload = {} }, { call, put, select }) {
      const pagination = yield select(({ gift }) => gift.pagination);
      const page = payload.page ? payload.page : pagination.current;
      const limit = payload.limit ? payload.limit : pagination.pageSize;
      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
          include: 'gift_type',
          order: 'created_at DESC',
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
      if (payload.back) yield put(push('/gift'));
    },
    * getDetail({ payload = {} }, { call, put }) {
      const opts = {
        query: {
          ...payload,
          include: 'gift_type,activity'
        }
      }
      const data = yield call(query, opts)
      let uid = -1;
      const fileList = data[0].imgs ? data[0].imgs.split(',').map(imgUrL => {
        return {
          uid: uid--,
          name: imgUrL.split('/')[2],
          status: 'done',
          url: imgUrL,
          response: { success: true, url: imgUrL }
        };
      }) : [];
      yield put({
        type: 'updateState',
        payload: {
          currentItem: data[0],
          modalType: 'update',
          fileList,
        },
      })
    },
    * getDefault_data({ payload = {} }, { call, put }) {
      const opts = {
        query: {
          page: 1,
          limit: 10,
        }
      }
      if (payload.all) {} else {
        opts.query.enabled = 1;
      };
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
      if (payload.query.all) {} else {
        opts.query.enabled = 1;
      };

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
      const data = yield call(create, opts)
      message.success('新增成功!');
      yield put({ type: 'hideModal' })
      yield put(push('/gift'))
      yield put({ type: 'query' })

    },

    * update({ payload }, { select, call, put }) {
      const id = yield select(({ gift }) => gift.currentItem.id);
      const opts = {
        id,
        ...payload
      }
      const data = yield call(update, opts)
      message.success('更新成功!');
      yield put(push('/gift'))
      yield put({ type: 'query' })
    },

    //裁剪图片上传函数
    * uploadCropImg({ payload }, { select, call, put }) {
      const fileName = yield select(({ gift }) => gift.fileName);
      const fileList = yield select(({ gift }) => gift.fileList);
      const oldFile = yield select(({gift})=>gift.oldFile);
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