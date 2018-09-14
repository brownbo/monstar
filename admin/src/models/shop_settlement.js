import * as service from '../services/shop_settlement'
import modelExtend from 'dva-model-extend'
import {routerRedux} from 'dva/router'
import {message} from 'antd'

import {pageModel} from './common'

const {query, query2, create, update, del} = service

export default modelExtend(pageModel, {
  namespace: 'shop_settlement',
  state: {
    default_data: [],//其他页面中-默认显示的数据一般是10条
    search_data: [],//其他页面中-查询的数据一般是10条
    totalPoint: '',
    flag: false,
    rowkey:[],
    type:0,
  },
  reducers: {},
  effects: {
    * query ({payload = {}}, {call, put, select}) {
      const pagination = yield select(({shop_settlement})=>shop_settlement.pagination);
      const page = payload.page ? payload.page : pagination.current;
      const limit = payload.limit ? payload.limit : pagination.pageSize;
      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
          include: 'shop',
          ...payload.query,
        }
      }
      if(payload.first){
        var  data={count: 0, rows: []};
      }else {
        var data = yield call(query, opts)
      }
    
     data.rows.forEach((item,index) => {
        item.count=data.count[index].count;
     });
      const list = data.rows.map(item=> {
        return {...item, key:payload.query.verify_vouchers?item.voucher_id:item.goods_id}
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
              total: data.count.length,
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
      yield put({type: 'hideModal'})
      yield put({type: 'query'})

    },

    * update ({payload}, {select, call, put}) {
      const id = yield select(({shop_settlement})=>shop_settlement.currentItem.id);
      const opts = {
        id,
        ...payload
      }
      const data = yield call(update, opts)
      message.success('更新成功!');
      yield put({type: 'hideModal'})
      yield put({type: 'query'})
    },
    * getGoods({payload}, {call, put}){

      const opts = {
        query: {
          sum: true,
          limit:1000,
          status:3,
          ...payload
        }
      }
     
      const data = yield call(query, opts)
      if(data[0].total_points!=0&&data[0].total_points!=null){
        var modalVisible=true;
      }else{
        message.warning('未统计到数据');
        var modalVisible=false;
      }
      yield put({
        type: 'updateState',
        payload: {
          totalPoint: data[0].total_points,
          modalVisible:modalVisible,
        },
      })
    },
    * createtable ({payload}, {call, put}) {
      const opts = {
        ...payload
      }
      const data = yield call(create, opts)
      message.success('结算成功!');
      yield put({type: 'hideModal'})
      yield put({type: 'query',
        payload: {
        first: true,
      },})
      yield put({
        type: 'updateState',
        payload: {
          rowkey: '',
        },
      })

    },
    * getrow ({payload}, {call, put}) {
      const opts = {
        ...payload
      }
      yield put({
        type: 'updateState',
        payload: {
          rowkey: payload,
        },
      })

    },
    * changeType ({payload}, {call, put}) {
    const opts = {
      ...payload
    }
    yield put({
      type: 'updateState',
      payload: {
        type: payload.type,
      },
    })

  },


  }
});