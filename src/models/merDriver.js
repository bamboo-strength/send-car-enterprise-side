import { message } from 'antd';
import router from 'umi/router';
import { MERDRIVER_NAMESPACE } from '../actions/merDriver';
import { list, submit, detail, remove, update, listWithoutPage, shipperDetail } from '../services/merDriver';
import { dict } from '../services/dict';


export default {
  namespace: MERDRIVER_NAMESPACE,
  state: {
    data: {
      list: [],
      pagination: {},
    },
    listData:[],
    init: {},
    detail: {},
    shipperDetail: {},
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
    *fetchListWithoutPage({ payload }, { call, put }) {
      const response = yield call(listWithoutPage, payload);
      if (response.success) {
        yield put({
          type: 'saveListTwo',
          payload: {
            listData: response.data,
          },
        });
      }
    },
    *fetchInit({ payload }, { call, put }) {
      const val = payload.code;
      for (let i=0; i<val.length; i+=1){
        const responseDict = yield call(dict, {'code': val[i]});
        if (responseDict.success) {

        }
      }
      yield put({
        type: 'saveInit',
        payload: {

        },
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
    *fetchShipperDetail({ payload }, { call, put }) {
      const response = yield call(shipperDetail, payload);
      if (response.success) {
        yield put({
          type: 'unloadState',
          payload: {
            shipperDetail: response.data,
          },
        });
      }
    },
    *submit({ payload }, { call }) {
      const response = yield call(submit, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/driverSide/personal/personalCenter');
      }
    },
    *update({ payload }, { call }) {
      const response = yield call(update, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/dispatch/dispatchbillbyorder');
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
    unloadState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveListTwo(state, action) {
    //  console.log(state, action)
      return {
        ...state,
        listData: action.payload.listData,
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
