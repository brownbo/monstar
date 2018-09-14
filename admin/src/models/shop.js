import * as service from '../services/shops'
import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'

const { push } = routerRedux;
import { pageModel } from './common'
//裁剪图片
import { uploadFile } from '../services/uploadFile'
const { query, create, update, del } = service

export default modelExtend(pageModel, {
  namespace: 'shop',
  state: {
    default_data: [], //其他页面中-默认显示的数据一般是10条
    search_data: [], //其他页面中-查询的数据一般是10条
    fileList: [],
    todoStatus: false, //编辑新增动作状态
    tab: 1, //选项卡选中的key

    //裁剪图片所需参数
    cropModalVisible: false, //裁剪窗口
    editorImg: '', //裁剪图片之前的data base64
    fileName: '', //裁剪图片名称
    oldFile:''//裁剪之前原图片，如果不裁剪直接传原图片上去
  },
  reducers: {},
  effects: {
    * query({ payload = {} }, { call, put, select }) {
      const pagination = yield select(({ shop }) => shop.pagination);
      const tab = yield select(({ shop }) => shop.tab);
      const page = payload.page ? payload.page : pagination.current;
      const limit = payload.limit ? payload.limit : pagination.pageSize;
      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
          include: 'shop_type,examine_person',
          ...payload.query,
          examine_status: tab === 1 ? '3' : '0,1',
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
      if (payload.back) yield put(push('/shops'));
    },
    * getDefault_data({ payload = {} }, { call, put }) {
      const opts = {
        query: {
          page: 1,
          limit: 10,
          enabled: 1,
          examine_status: 3,
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
          enabled: 1,
          examine_status: 3,
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
    * getDetail({ payload = {} }, { call, put }) {
      const opts = {
        query: {
          ...payload,
          include: 'shop_type,recommend1,recommend2,examine_person',
        }
      }
      const data = yield call(query, opts)
      let uid = -1;
      const fileList = data[0].shop_img ? data[0].shop_img.split(',').map(imgUrL => {
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

    * delete({ payload }, { call, put, select }) {
      const opts = {
        idArry: payload,
      }
      const data = yield call(del, opts)
      if (data === 0) {
        throw (data)
      }
      message.success('删除成功!');
      yield put({ type: 'query' })
    },
    * create({ payload }, { call, put }) {
      const opts = {
        ...payload
      }
      const data = yield call(create, opts)
      yield put(push('/shops'))
      message.success('新增成功!');
    },

    * update({ payload }, { select, call, put }) {
      const id = yield select(({ shop }) => shop.currentItem.id);
      const currentUserID = yield select(({ login }) => login.currentUser.id);
      const opts = {
        id,
        ...payload
      }
      if (payload.closeModal) {
        opts.examine_person_id = currentUserID;
        opts.examine_time = new Date().getTime();

      }
      const data = yield call(update, opts)
      message.success('更新成功!');
      if (payload.closeModal) {
        yield put({ type: 'hideModal' })
      } else {
        yield put(push('/shops'))
      }
      yield put({ type: 'query' })
    },
    * changeTab({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          ...payload
        },
      })
      yield put({ type: 'query' })
    },
    //裁剪图片上传函数
    * uploadCropImg({ payload }, { select, call, put }) {
      const fileName = yield select(({ shop }) => shop.fileName);
      const fileList = yield select(({ shop }) => shop.fileList);
      const oldFile = yield select(({shop})=>shop.oldFile);
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