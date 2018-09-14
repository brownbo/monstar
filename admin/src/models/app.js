import menu from '../utils/menu';
//根据屏幕高度，判断使用table的默认大小 small，middle，
const getTableSize = (height)=>{
  if(height>=798){
    return 'default';
  }else if(height>=600){
    return 'middle';
  }else{
    return 'small';
  }
}

export default {

  namespace: 'app',

  state: {
    locationPathname:'',
    menu:menu,
    TableSize:getTableSize(document.documentElement.clientHeight),
  },

  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
          },
        })
      })
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },

};
