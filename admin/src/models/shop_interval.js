import * as service from '../services/shops'
import modelExtend from 'dva-model-extend'
import { routerRedux  } from 'dva/router'
import { message  } from 'antd'

const { goBack} = routerRedux;
import {pageModel} from './common'

const {query, create, update, del} = service


export default modelExtend(pageModel, {
  namespace: 'shop_interval',
  state: {
    tab:1,//选项卡选中的key
    modalVisible_two:false,
    seletedRows: [],//选中的table行
  },
  reducers: {
    showModal_two (state,) {
      return { ...state, modalVisible_two: true}

    },
    hideModal_two (state) {
      return { ...state, modalVisible_two: false }
    },
  },
  effects: {
    * query ({payload = {}}, {call, put, select}) {
      const pagination = yield select(({shop_interval})=>shop_interval.pagination);
      const tab = yield select(({shop_interval})=>shop_interval.tab);
      const page = payload.page?payload.page:pagination.current;
      const limit = payload.limit?payload.limit:pagination.pageSize;
      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
          examine_status:'3',
          ...payload.query,
          is_settlement:tab===1?'0':'1',
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
      if(payload.back)yield put(goBack());
    },
    * update ({payload}, {select, call, put}) {
      const id = yield select(({shop_interval})=>shop_interval.currentItem.id);
      const opts = {
        id,
        ...payload
      }
      yield call(update, opts)
      message.success('更新成功!');
      yield put({type:'hideModal'})
      yield put({type:'query'})
    },
    * update_cancle_cycle ({payload}, {call, put}) {
      const {id,...data} = payload;
      const id_array = id.toString().split(',');
      let opts = {
        ...data,
      }
      for (const item in id_array){
        opts.id = id_array[item];
        yield call(update, opts)
      }
      message.success('更新成功!');
      if(data.settlement_cycle!=undefined){
        yield put({type:'hideModal_two'})
      }else{
        yield put({type:'hideModal'})
      }
      yield put({type:'query'})
    },
    * changeTab ({payload = {}}, {put}) {
      yield put({
        type: 'updateState',
        payload: {
          seletedRows:[],
          ...payload
        },
      })
      yield put({type:'query'})
    },
  }
});
