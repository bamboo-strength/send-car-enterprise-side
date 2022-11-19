import { list } from '../services/kanban';


export default {
  namespace: 'kanban',

  state: {
     list:{},
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.success) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
