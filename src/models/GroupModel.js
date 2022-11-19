import { message } from 'antd';
import router from 'umi/router';
import { detail, list, add} from '../services/GroupServices';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';

export default {
  namespace: 'group',
  state: {
    data: {
      list: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    init: {
      deptTree: [],
    },
    detail: {},
  },
  effects: {
    *fetchInit({ payload }, { call, put }) {
      // const responseTree = yield call(tree,payload);
      // const codes = payload.code;
      //
      // yield put({
      //   type: 'saveInit',
      //   payload: {
      //     deptTree: responseTree.data,
      //   },
      // });

    },
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
    *submit({ payload }, { call }) {
      const response = yield call(add, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/base/group');
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
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload.detail,
      };
    },
  },
}
