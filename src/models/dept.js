import { message } from 'antd';
import router from 'umi/router';
import { DEPT_NAMESPACE } from '../actions/dept';
import { dict } from '../services/dict';
import { list, submit, detail, remove, tree } from '../services/dept';

export default {
  namespace: DEPT_NAMESPACE,
  state: {
    data: {
      list: [],
      pagination: false,
    },
    init: {
      tree: [],
      category: [],
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
            pagination: false,
          },
        });
      }
    },
    *fetchInit({ payload }, { call, put }) {
      const responseTree = yield call(tree, payload);
      const responseDict = yield call(dict, payload);
      if (responseTree.success && responseDict.success) {
        yield put({
          type: 'saveInit',
          payload: {
            tree: responseTree.data,
            category: responseDict.data,
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
    *clearDetail({ payload }, { put }) {
      yield put({
        type: 'removeDetail',
        payload: { payload },
      });
    },
    *submit({ payload }, { call }) {
      const params = {
        ...payload,
        isDeleted: 0,
      };
      const response = yield call(submit, params);
      if (response.success) {
        message.success('提交成功');
        router.push('/system/dept');
      }
    },
    *remove({ payload }, { call }) {
      const {
        data: { keys },
        success,
      } = payload;
      const response = yield call(remove, { ids: keys });
      if (response.success) {
        success();
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
    removeDetail(state) {
      return {
        ...state,
        detail: {},
      };
    },
  },
};
