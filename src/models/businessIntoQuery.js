import { list,tenantList} from '../services/businessIntoQuery';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';
import { getCurrentUser } from '../utils/authority';

export default {
  namespace: 'businessIntoQuery',
  state: {
    data: {
      list: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    init: {
      telentList:[]
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
    *fetchInit({ payload }, { call, put }) {
      payload.tenantId = getCurrentUser().tenantId
      const response = yield call(tenantList, payload);
      if (response.success) {
        yield put({
          type: 'saveInit',
          payload: {
            telentList: response.data,
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
