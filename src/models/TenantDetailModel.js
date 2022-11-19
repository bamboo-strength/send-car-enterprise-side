import { message } from 'antd';
import router from 'umi/router';
import { TENANTDETAIL_NAMESPACE } from '../actions/TenantDetailActions';
import { dict } from '../services/dict';
import { list, submit, detail, remove } from '../services/TenantDetailServices';

export default {
  namespace: TENANTDETAIL_NAMESPACE,
  state: {
    data: {
      list: [],
      pagination: {},
    },
    init: {
      companyType: [],
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
      console.log(payload)
      // const response = yield call(dict, payload);
      // if (response.success) {
      //   console.log(response.data)
      //   yield put({
      //     type: 'saveInit',
      //     payload: {
      //       companyType: response.data,
      //     },
      //   });
      // }
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
      const response = yield call(submit, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/console/homepage');
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
  },
};
