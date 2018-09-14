import { routerRedux } from 'dva/router'
import * as service from '../services/login'
import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
const { login,getCurrent,logout} = service

const { push }  = routerRedux;
export default modelExtend( pageModel ,{
  namespace: 'login',
  state: {
    isLogin:true,
    currentUser:{},
  },
  effects: {
    * login ({
      payload,
    }, { put, call}) {
      const data = yield call(login,payload);
      yield put({
        type:'updateState',
        payload:{isLogin:true,currentUser:data}
      })
      yield put({
        type:'getCurrent',
        payload:{}
      })
    },
    * getCurrent ({
      payload,
    }, { put, call}) {
      const data = yield call(getCurrent);
      if (data) {
        yield put({
          type:'updateState',
          payload:{isLogin:true,currentUser:data}
        })
      } else {
        yield put({
          type:'updateState',
          payload:{isLogin:false,currentUser:null}
        })
      }
    },
    * logout ({
      payload,
    }, { put, call}) {
      const data = yield call(logout);

      yield put({
        type:'updateState',
        payload:{isLogin:false,currentUser:{}}
      })
      yield put(push('/'))
    },
  },

})
