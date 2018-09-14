import * as service from '../services/evalGoods'
import modelExtend from 'dva-model-extend'
import { routerRedux  } from 'dva/router'
import { message  } from 'antd'

const { push} = routerRedux;
import {pageModel} from './common'

const {query, create, update, del} = service


export default modelExtend(pageModel, {
  namespace: 'evalGoods',
  state: {
    default_data: [],//其他页面中-默认显示的数据一般是10条
    search_data: [],//其他页面中-查询的数据一般是10条
    todoStatus:false,//编辑新增动作状态
    childEvalList:[],

  },
  reducers: {
  },
  effects: {
    * query ({payload = {}}, {call, put, select}) {
      const pagination = yield select(({evalGifts})=>evalGifts.pagination);
      const page = payload.page?payload.page:pagination.current;
      const limit = payload.limit?payload.limit:pagination.pageSize;
      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
          include:'eval_customer,goods,reply_user',
          is_first_eval:'1',
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
      if(payload.back)yield put(push('/shopevaluate'));
    },
    * getDetail ({payload = {}}, {call, put}) {
      const opts = {
        query: {
          include:'eval_customer',
          ...payload,
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
      message.success('回复成功!');
    },

    * update ({payload}, {select, call, put}) {
      const id = yield select(({evalGoods})=>evalGoods.currentItem.id);
      const opts = {
        id,
        ...payload
      }
      const data = yield call(update, opts)
      message.success('回复成功!');
    },
    * getEvalListDetail ({payload }, {call, put}) {
      const opts = {
        query: {
          parent_eval_id:payload.id,
        }
      }
      const data = yield call(query, opts)
      yield put({
        type: 'updateState',
        payload: {
          childEvalList:data,
        },
      })
    },
    * add ({payload }, {call, put}) {
      const opts = {
        ...payload
      }
      const data = yield call(create, opts)
      message.success('回复成功!');
      yield put({type:'query'})
      yield put(push('/shopevaluate'))
    },
  }
});
