import { message } from 'antd';
import router from 'umi/router';
import { list,detail,relationTelentList,add} from '../services/auditvehicle';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';
import { tree } from '@/services/dept';
import { getCurrentUser } from '../utils/authority';

export default {
  namespace: 'auditvehicle',
  state: {
    data: {
      list: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    init: {
      relationTelentList:[],
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
/*       *fetchRelationTelentList({ payload }, { call, put }) {
      const response = yield call(relationTelentList, payload);
      if (response.success) {
        yield put({
          type: 'saveRelationTelentList',
          payload: {
            relationTelentList: response.data,
          },
        });
      }
    },   */
    *fetchInit({ payload }, { call, put }) {
      payload.relationTenantId = getCurrentUser().tenantId
      const response = yield call(relationTelentList, payload);
      if (response.success) {
        yield put({
          type: 'saveInit',
          payload: {
            relationTelentList: response.data,
          },
        });
      }
    },


    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(detail, payload);
      if (response.success) {
        yield put({
          type: 'saveDetail',
          payload: {
            detail: response.data,
          },
        });
      }
    },
    *fetchDetailCode({ payload }, { call, put }) {
      const response = yield call(detail, payload);
      if (response.success) {
        yield put({
          type: 'detailCode',
          payload: {
            detail: response.data,
          },
        });
      }
    },
    *add({ payload }, { call }) {
      payload.isDeleted=0;
      const response = yield call(add, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/businessInto/auditvehicle');
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
    saveRelationTelentList(state, action) {
      return {
        ...state,
        data: action.payload,
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
