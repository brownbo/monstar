import * as service from '../services/examine'
import * as stockRecService from '../services/stockRec'
import modelExtend from 'dva-model-extend'
import { routerRedux  } from 'dva/router'
import { message  } from 'antd'

import {pageModel} from './common'

const {query, create, update, del} = service
const stockRecCreate = stockRecService.create


export default modelExtend(pageModel, {
  namespace: 'examine',
  state: {
    default_data: [],//其他页面中-默认显示的数据一般是10条
    search_data: [],//其他页面中-查询的数据一般是10条
    doType:null,//页面额外的变量，记录调拨动作
  },
  reducers: {
  },
  effects: {
    * query ({payload = {}}, {call, put, select}) {
      const pagination = yield select(({examine})=>examine.pagination);
      const page = payload.page?payload.page:pagination.current;
      const limit = payload.limit?payload.limit:pagination.pageSize;
      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
          order:'application_time DESC',
          include:'gift,sub_netspot,applicant,examine_person',
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
      const id = yield select(({examine})=>examine.currentItem.id);
      const currentUser = yield select(({login})=>login.currentUser);
      let opts = {
        id,
        ...payload,
      }
      if(payload.status===1||payload.status===2){//审核通过
        opts.examine_person_id = currentUser.id;
        opts.examine_time =  new Date();
      }
      const data = yield call(update, opts);
      if(payload.is_allocation){//调拨操作
        message.success('审核完成，正在进行调拨...');
        const {examine_id,gift_id,allocation_in_id,allocation_out_id ,allocation_count,} = payload;
        const opts_rec = {
          examine_id,
          gift_id,
          allocation_in_id,
          allocation_out_id,
          allocation_count,
          active_type:0,
          create_time:new Date().getTime(),
          status:0
        }
        const data = yield call(stockRecCreate, opts_rec);
        message.success('调拨完成!');
        yield put({type:'hideModal'})
        yield put({type:'query'})
      }else{
        message.success('审核完成!');
        yield put({type:'hideModal'})
        yield put({type:'query'})
      }
    },
  }
});
