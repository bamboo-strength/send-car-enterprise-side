import { list,tenantList} from '../services/tenantRelation';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';

export default {
  namespace: 'tenantRelation',
  state: {
    data: {
      list: [],
      tenantList:[],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    init: {

    },
    detail: {},
  },
  effects: {

    *fetchList({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.success) {
        yield put({
          type: 'saveList',
          payload: {
            list: response.data,
          },
        });
      }
    },
    *fetchTenantList({ payload }, { call, put }) {
      const response = yield call(tenantList, payload);
      if (response.success) {
        yield put({
          type: 'saveTenantList',
          payload: {
            tenantList: response.data,
          },
        });
      }
    },
  },
  reducers: {
    saveInit(state, action) {
      return {
        ...state,
        init: action.payload,
      };
    },
    saveList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveTenantList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
