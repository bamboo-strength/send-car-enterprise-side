import { LISTQUERY_NAMESPACE } from '../actions/listQuery';
import { list,listWithoutPage} from '../services/listQuery';
import { dict } from '../services/dict';


export default {
  namespace: LISTQUERY_NAMESPACE,
  state: {
    data: {
      list: [],
      pagination: {},
    },
    listData:[],
    init: {},
    detail: {},
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.success) {
        yield put({
          type: 'saveList',
          payload: {
            list: response.data.records,
            pagination: {
              total: response.data.total,
              current: response.data.current,
              pageSize: response.data.size,
            },
          },
        });
      }
    },
    *fetchListWithoutPage({ payload }, { call, put }) {
      const response = yield call(listWithoutPage, payload);
      if (response.success) {
        yield put({
          type: 'saveListTwo',
          payload: {
            listData: response.data,
          },
        });
      }
    },
    *fetchInit({ payload }, { call, put }) {
      const val = payload.code;
      for (let i=0; i<val.length; i+=1){
        const responseDict = yield call(dict, {'code': val[i]});
        if (responseDict.success) {

        }
      }
      yield put({
        type: 'saveInit',
        payload: {

        },
      });
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveListTwo(state, action) {
    //  console.log(state, action)
      return {
        ...state,
        listData: action.payload.listData,
      };
    },
    saveInit(state, action) {
      return {
        ...state,
        init: action.payload,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload.detail,
      };
    },
  },
};
