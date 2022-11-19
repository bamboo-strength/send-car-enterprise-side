import { message } from 'antd';
import router from 'umi/router';
import { TRUCKDEVICE_NAMESPACE } from '../actions/truckdevice';
import { list, submit, detail, remove, relationdetail } from '../services/truckdevice';
import { dict } from '@/services/dict';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';

export default {
  namespace: TRUCKDEVICE_NAMESPACE,
  state: {
    data: {
      list: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    detail: {},
    init: {
      status : [],
      devicetypeName: [],
    }
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

    *fetchrelationdetail({ payload }, { call, put }) {
      const response = yield call(relationdetail, payload);
      if (response.success) {
        yield put({
          type: 'relationdetail1',
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
      payload.isDeleted=0;
      const response = yield call(submit, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/truckdevice/truckDevice');
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
    *fetchInit({ payload }, { call, put }) {
      const val = payload.code;
      let devicetypeName = [];
      const responseDict = yield call(dict, payload);
      for (let i=0; i<val.length; i+=1){
        const responseDict = yield call(dict, {'code': val[i]});
        if (responseDict.success) {
          if (val[i] === 'devicetype'){
            devicetypeName = responseDict.data;
          }
        }
      }
      if (responseDict.success) {
        yield put({
          type: 'saveInit',
          payload: {
            status: responseDict.data,
            devicetypeName: devicetypeName,
          },
        });
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
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload.detail,
      };
    },
    relationdetail1(state, action) {
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
    saveInit(state, action) {
      return {
        ...state,
        init: action.payload,
      };
    },
  },
};
