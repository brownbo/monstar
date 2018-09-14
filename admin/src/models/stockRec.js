import * as service from '../services/stockRec'
import * as examineService from '../services/examine'
import modelExtend from 'dva-model-extend'
import {routerRedux} from 'dva/router'
import {message} from 'antd'

import {pageModel} from './common'

const {query, create, update, del} = service
const query_examine = examineService.query;
const update_examine = examineService.update;


export default modelExtend(pageModel, {
  namespace: 'stockRec',
  state: {
    default_data: [],//其他页面中-默认显示的数据一般是10条
    search_data: [],//其他页面中-查询的数据一般是10条
    ExamineObj: {},
    btnDisabled: true,//model确定按钮是否禁用
  },
  reducers: {},
  effects: {
    * query ({payload = {}}, {call, put, select}) {
      const pagination = yield select(({stockRec})=>stockRec.pagination);
      const page = payload.page ? payload.page : pagination.current;
      const limit = payload.limit ? payload.limit : pagination.pageSize;
      const opts = {
        query: {
          page: page,
          limit: limit,
          count: 'true',
          order:'create_time DESC',
          include: 'gift,allocation_in,allocation_out',
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
    * getExamineDetail ({payload = {}}, {call, put}) {
      const opts = {
        query: {
          ...payload.query,
          include: 'gift,sub_netspot',
        }
      }
      const data = yield call(query_examine, opts);
      let ExamineObj = {};
      let btnDisabled = false;
      if (data.length === 0) {
        message.info('申请单不存在，请重新输入!')
      } else {
        const obj = data[0];
        if (obj.status != 1) {
          message.info('该申请单未通过审核或已签收无法调拨，请重新输入!')
        } else if (obj.is_allocation != 0) {
          message.info('该申请单已调拨，请重新输入!')
        } else {
          ExamineObj = data.length ? data[0] : {};
          btnDisabled = data.length ? false : true;
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          ExamineObj: ExamineObj,
          btnDisabled: btnDisabled,
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
    * create ({payload}, {call, put}) {//新建调拨
      const opts = {
        status:0,
        ...payload,
        create_time:new Date(),
      }
      if(opts.examine_id){
        const data_examine = yield call(update_examine, {id:opts.examine_id,is_allocation:1})
      }
      const data = yield call(create, opts)
      message.success('调拨成功!');
      yield put({type: 'hideModal'})
      yield put({type: 'query'})

    },

    * update ({payload}, {select, call, put}) {
      const id = yield select(({stockRec})=>stockRec.currentItem.id);
      const opts = {
        id,
        ...payload
      }

      const data = yield call(update, opts)
      message.success('更新成功!');
      yield put({type: 'hideModal'})
      yield put({type: 'query'})
    },

  }
});
