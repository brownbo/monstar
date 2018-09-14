import * as service from '../services/user'
import modelExtend from 'dva-model-extend'
import { message  } from 'antd'
import {pageModel} from './common'

const {query, create, update, del,updatePassword} = service


export default modelExtend(pageModel, {
  namespace: 'user',
  state: {
    default_data: [],//其他页面中-默认显示的数据一般是10条
    search_data: [],//其他页面中-查询的数据一般是10条
    updatePwdModal:false,//更新密码弹出框
  },
  reducers: {
  },
  effects: {
    * query ({payload = {}}, {call, put, select}) {
      const pagination = yield select(({user})=>user.pagination);
      const page = payload.page?payload.page:pagination.current;
      const limit = payload.limit?payload.limit:pagination.pageSize;
      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
          include:'role',
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
      const data = yield call(create, opts)
      message.success('新增成功!');
      yield put({type:'hideModal'})
      yield put({type:'query'})
    },

    * update ({payload}, {select, call, put}) {
      const id = yield select(({user})=>user.currentItem.id);
      const opts = {
        id,
        ...payload
      }
      const data = yield call(update, opts)
      message.success('更新成功!');
      yield put({type:'hideModal'})
      yield put({type:'query'})
    },
    * updatePassword ({payload}, {select, call, put}) {
      const id = yield select(({login})=>login.currentUser.id);
      const opts = {
        id,
        ...payload
      }
      const data = yield call(updatePassword, opts)
      message.success('修改成功,请重新登录!');
      yield put({type:'updateState',payload:{
        updatePwdModal:false,
      }})
      yield put({type:'login/logout'})
    },
  }
});
