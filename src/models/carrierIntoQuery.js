import { list,tenantList} from '../services/carrierIntoQuery';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';
import { getCurrentUser } from '../utils/authority';

export default {
  namespace: 'carrierIntoQuery',
  state: {
    data: {
      list: [],
      telentList: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    init: {
      relationTelentList:[]
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
    *fetchTelentList({ payload }, { call, put }) {
      const response = yield call(tenantList, payload);
      if (response.success) {
        yield put({
          type: 'saveTelentList',
          payload: {
            telentList: response.data,
          },
        });
      }
    },
    *fetchInit({ payload }, { call, put }) {
      payload.relationTenantId = getCurrentUser().tenantId
      const response = yield call(tenantList, payload);
      if (response.success) {
        yield put({
          type: 'saveInit',
          payload: {
            relationTelentList: response.data,
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
    saveTelentList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
