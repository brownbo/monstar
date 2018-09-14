import * as service from '../services/notification'
import modelExtend from 'dva-model-extend'
import { message  } from 'antd'

import {pageModel} from './common'

const {query, create, update, del} = service


export default modelExtend(pageModel, {
  namespace: 'notification',
  state: {
    default_data: [],//其他页面中-默认显示的数据一般是10条
    search_data: [],//其他页面中-查询的数据一般是10条
  },
  effects: {
    * query ({payload = {}}, {call, put, select}) {
      const pagination = yield select(({notification})=>notification.pagination);
      const page = payload.page?payload.page:pagination.current;
      const limit = payload.limit?payload.limit:pagination.pageSize;
      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
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
    },
    * getDefault_data ({payload = {}}, {call, put}) {
      const opts = {
        query: {
          page: 1,
          limit: 10,
          enabled:1,
        }
      }
      const data = yield call(query, opts)
      yield put({
        type: 'updateState',
        payload: {
          default_data:data,
          search_data:[],
        },
      })
    },
    * getSearch_data ({payload = {}}, {call, put}) {
      const opts = {
        query: {
          page: 1,
          limit: 10,
          enabled:1,
          ...payload.query
        }
      }
      const data = yield call(query, opts)
      yield put({
        type: 'updateState',
        payload: {
          search_data:data,
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
      yield put({type: 'query'})
    },
    * create ({payload}, {call, put}) {
      const opts = {
        ...payload
      }
      if(opts.enabled){//如果是启用，则需要把其它设置为禁用
        const opts = {
          query: {
            page: 1,
            limit: 100,
            enabled:1,
          }
        }
        const results = yield call(query, opts)
        for(const i in results){
          const obj = results[i];
          const opts = {
            id:obj.id,
            enabled:0,
          }
          yield call(update, opts)
        }
      }
      const data = yield call(create, opts)
      message.success('新增成功!');
      yield put({type:'hideModal'})
      yield put({type:'query'})

    },

    * update ({payload}, {select, call, put}) {
      const id = yield select(({notification})=>notification.currentItem.id);
      const opts = {
        id,
        ...payload
      }
      if(opts.enabled){//如果是启用，则需要把其它设置为禁用
        const opts = {
          query: {
            page: 1,
            limit: 100,
            enabled:1,
          }
        }
        const results = yield call(query, opts)
        for(const i in results){
          const obj = results[i];
          if(obj.id===id)continue;
          const opts = {
            id:obj.id,
            enabled:0,
          }
          yield call(update, opts)
        }
      }
      const data = yield call(update, opts)
      message.success('更新成功!');
      yield put({type:'hideModal'})
      yield put({type:'query'})
    },
  }
});
