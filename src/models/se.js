import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';
import { detail, list, submit } from '../services/settledEnterprise';

/*  import { tree } from '@/services/dept';  */


export default {
  namespace: 'settledEnterprise',
  state: {
    data: {
      list: [],
      tenantList: [],
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
    *fetchTenantList({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.success) {
        yield put({
          type: 'saveTenantList',
          payload: {
            tenantList: response.data,
          },
        });
      }
    },
/*      *fetchInit({ payload }, { call, put }) {
      const responseDept = yield call(tree);
      if (responseDept.success) {
        yield put({
          type: 'saveInit',
          payload: {
            deptTree: responseDept.data,
          },
        });
      }
    }  ,  */
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
    *submit({ payload }, { call }) {
      payload.isDeleted=0;
      const response = yield call(submit, payload);
      if (response.success) {
        Toast.success('提交成功')
        router.push('/businessInto/settledEnterprise');
      }
    },
  },
  reducers: {
   /*   saveInit(state, action) {
      return {
        ...state,
        init: action.payload,
      };
    },  */
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
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload.detail,
      };
    },
    detailCode(state, action){
      return {
        ...state,
        detail: action.payload.detail,
      };
    },
  },
};
