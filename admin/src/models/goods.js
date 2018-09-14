import * as service from '../services/goods'
import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'

const { push } = routerRedux;
import { pageModel } from './common'
//裁剪图片
import { uploadFile } from '../services/uploadFile'
const { query, create, update, del } = service

export default modelExtend(pageModel, {
  namespace: 'goods',
  state: {
    default_data: [], //其他页面中-默认显示的数据一般是10条
    search_data: [], //其他页面中-查询的数据一般是10条
    fileList: [],
    tab: 1, //选项卡选中的key

    //裁剪图片所需参数
    cropModalVisible:false,//裁剪窗口
    editorImg:'',//裁剪图片之前的data base64
    fileName:'',//裁剪图片名称
    oldFile:''//裁剪之前原图片，如果不裁剪直接传原图片上去
  },
  reducers: {},
  effects: {
    * query({ payload = {} }, { call, put, select }) {
      const pagination = yield select(({ goods }) => goods.pagination);
      const tab = yield select(({ goods }) => goods.tab);
      const page = payload.page ? payload.page : pagination.current;
      const limit = payload.limit ? payload.limit : pagination.pageSize;
      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
          include: 'shop,activity,examine_person',
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
      if (payload.back) yield put(push('/goods'));
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
      const fileList_pre = data[0].previews ? data[0].previews.split(',').map(imgUrL => {
        return {
          uid: uid--,
          name: imgUrL.split('/')[2],
          status: 'done',
          url: imgUrL,
          response: { success: true, url: imgUrL }
        };
      }) : [];
      const fileList = fileList_pre.concat(data[0].goods_detail ? data[0].goods_detail.split(',').map(imgUrL => {
        return {
          uid: uid--,
          name: imgUrL.split('/')[2],
          status: 'done',
          url: imgUrL,
          response: { success: true, url: imgUrL }
        };
      }) : []);
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
      yield put(push('/goods'))
      message.success('新增成功!');
    },
    * update({ payload }, { select, call, put }) {
      const id = yield select(({ goods }) => goods.currentItem.id);
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
        yield put(push('/goods'))
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
      const fileName = yield select(({ goods }) => goods.fileName);
      const fileList = yield select(({ goods }) => goods.fileList);
      const oldFile = yield select(({goods})=>goods.oldFile);
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