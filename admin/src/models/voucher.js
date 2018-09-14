import * as service from '../services/voucher'
import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
//裁剪图片
import { uploadFile } from '../services/uploadFile'
const { push } = routerRedux;
import { pageModel } from './common'

const { query, create, update, del } = service

export default modelExtend(pageModel, {
  namespace: 'voucher',
  state: {
    fileList: [],
    default_data: [],
    search_data: [],
    tab: 1, //选项卡选中的key

    //裁剪图片所需参数
    cropModalVisible: false, //裁剪窗口
    editorImg: '', //裁剪图片之前的data base64
    fileName: '', //裁剪图片名称
    oldFile: '' //裁剪之前原图片，如果不裁剪直接传原图片上去
  },
  reducers: {},
  effects: {
    * query({ payload = {} }, { call, put, select }) {
      const pagination = yield select(({ voucher }) => voucher.pagination);
      const tab = yield select(({ voucher }) => voucher.tab);
      const page = payload.page ? payload.page : pagination.current;
      const limit = payload.limit ? payload.limit : pagination.pageSize;

      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
          include: 'shop',
          ...payload.query,
          order: tab === 1 ? 'examine_time DESC' : 'created_at DESC',
          examine_status: tab === 1 ? '3' : '0',
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
      if (payload.back) yield put(push('/voucher'));
    },
    * getDefault_data({ payload = {} }, { call, put }) {
      const opts = {
        query: {
          page: 1,
          limit: 10,
          examine_status: 3,
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
          examine_status: 3,
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
    * getDetail({ payload = {} }, { call, put }) {
      const opts = {
        query: {
          ...payload,
          include: 'shop,activity,examine_person',
        }
      }
      const data = yield call(query, opts)
      let uid = -1;
      const fileList = data[0].img ? data[0].img.split(',').map(imgUrL => {
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
      message.success('新增成功!');
      yield put(push('/voucher'))
      yield put({ type: 'query' })
    },
    * update({ payload }, { select, call, put }) {
      const id = yield select(({ voucher }) => voucher.currentItem.id);
      const currentUser = yield select(({ login }) => login.currentUser);

      const opts = {
        id,
        ...payload,
        examine_person_id: currentUser.id,
        examine_time: new Date(),
      }
      const data = yield call(update, opts)
      message.success('更新成功!');
      if (payload.closeModal) {
        yield put({ type: 'hideModal' })
      } else {
        yield put(push('/voucher'))
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
      const fileName = yield select(({ voucher }) => voucher.fileName);
      const fileList = yield select(({ voucher }) => voucher.fileList);
      const oldFile = yield select(({ voucher }) => voucher.oldFile);
      const data = yield call(uploadFile, { data: payload ? payload : oldFile, fileName })
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