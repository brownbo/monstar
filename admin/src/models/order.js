import * as service from '../services/order'
import modelExtend from 'dva-model-extend'
import {routerRedux} from 'dva/router'
import {message} from 'antd'

const {push} = routerRedux;
import {pageModel} from './common'

const {query, del,getFiles} = service


export default modelExtend(pageModel, {
  namespace: 'order',
  state: {
    default_data: [],//其他页面中-默认显示的数据一般是10条
    search_data: [],//其他页面中-查询的数据一般是10条
    todoStatus: false,//编辑新增动作状态

    query:{},//搜索条件，在翻页时默认是上次查询条件，除非点击重置
  },
  reducers: {},
  effects: {
    * query ({payload = {}}, {call, put, select}) {
      const pagination = yield select(({order})=>order.pagination);
      const page = payload.page ? payload.page : pagination.current;
      const limit = payload.limit ? payload.limit : pagination.pageSize;
      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
          order:"created_at DESC",
          include: 'goods,gift,customer,netspot,shop,voucher,verify_staff,verify_merchant',
          ...payload.query,
        }
      }
      const data = yield call(query, opts)

      const list = data.rows.map(item=> {
        return {...item, key: item.id}
      })
      if(list.length===0&&page!==1){
        yield put({
          type: 'query',
          payload: {
            page: page-Math.ceil(data.count/10),
          },
        })
      }else{
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

      if (payload.back)yield put(push('/orders'));
    },
    *api_files ({payload = {}}, {call, put, select}) {
      const opts = {
        query: {
          ...payload.query,
        }
      }
      const data = yield call(getFiles, opts)
      message.success('导出成功!');
    },
    * getDefault_data ({payload = {}}, {call, put}) {
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
    * getSearch_data ({payload = {}}, {call, put}) {
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
    * getDetail ({payload = {}}, {call, put}) {
      const opts = {
        query: {
          ...payload,
          include: 'goods,gift,customer,netspot,shop,voucher,verify_staff,verify_merchant',
        }
      }
      const data = yield call(query, opts)
      yield put({
        type: 'updateState',
        payload: {
          currentItem: data[0],
          modalType: 'update',
        },
      })
    },
    * delete ({payload}, {call, put, select}) {
      const opts = {
        idArry: payload,
      }
      const data = yield call(del, opts)
      if (data === 0) {
        throw (data)
      }
      message.success('删除成功!');
      yield put({type: 'query'})
    },
  }
});
