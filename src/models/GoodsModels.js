
import router from 'umi/router';
import { message } from 'antd/es';
import { list,add,detail } from '../services/GoodsServices';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';

export default {
  namespace: 'GoodsModels',
  state: {
    data: {
      list: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    init: {
      packagingName: [],
      deptTree: [],
    },
    detail: {},
    submitLoading: false,
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

    *clearDetail({ payload }, { put }) {
      yield put({
        type: 'removeDetail',
        payload: { payload },
      });
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
    *fetchDetailCode({ payload }, { call, put }){
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
    *submit({ payload }, { call,put }) {
      payload.isDeleted=0;
      const response = yield call(add, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/base/goods');
      }
      yield put({
        type: 'updateState',
        payload: { submitLoading: false },
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
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload.detail,
      };
    },

    removeDetail(state) {
      return {
        ...state,
        detail: {},
      };
    },
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
