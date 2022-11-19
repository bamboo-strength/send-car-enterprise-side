import {getRelationTenant} from '../services/defaultShippers';


export default {
  namespace: 'defaultShippers',

  state: {
    data: {
      list: [],
    },
    init: {
    },
    detail: {},
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(getRelationTenant, payload);
      if (response.success) {
        yield put({
          type: 'saveList',
          payload: {
            list: response.data.records,
          },
        });
      }
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
