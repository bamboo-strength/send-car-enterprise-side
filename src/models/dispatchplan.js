import { message } from 'antd';
import router from 'umi/router';
import { list, submit, detail,submitByOrder } from '../services/dispatchplan';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';
import { tree } from '@/services/dept';
import { dict } from '../services/dict';
import func from '../utils/Func';

export default {
  namespace: 'dispatchplan',
  state: {
    data: {
      list: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    init: {
      deptTree: [],
      auditStatusName: [],
    },
    detail: {},
    submitLoading: false
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.success) {
        const respDate = response.data.records
        for (let i = 0; i <respDate.length; i += 1) { // 吨数
          if(respDate[i].controltype === 2 || respDate[i].controltype === '2'){
            respDate[i].shipmentamount = respDate[i].shipmentamount.toFixed(2);
            respDate[i].addamount = respDate[i].addamount.toFixed(2);
            respDate[i].planamount = respDate[i].planamount.toFixed(2);
          }
        }
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
      const responseDept = yield call(tree);
      let auditStatusName = [];
      const val = payload.code;
      for (let i=0; i<val.length; i+=1) {
        const responseDict = yield call(dict, { 'code': val[i] });
        if (val[i] === 'auditStatus'){
          auditStatusName = responseDict.data;
        }
      }
      if (responseDept.success) {
        yield put({
          type: 'saveInit',
          payload: {
            deptTree: responseDept.data,
            auditStatusName,
          },
        });
      }
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(detail, payload);
      if (response.success) {
        const respDate = response.data
        if(respDate.controltype === 2 || respDate.controltype === '2'){ // 吨数
          respDate.planamount = respDate.planamount.toFixed(2);
          respDate.shipmentamount = respDate.shipmentamount.toFixed(2);
          const  sub =respDate.sublist;
          if (func.notEmpty(sub)) {
            for (let i = 0; i <sub.length; i += 1) {
              sub[i].planamount = func.notEmpty(sub[i].planamount)?sub[i].planamount.toFixed(2):undefined;
              sub[i].addamount = func.notEmpty(sub[i].addamount)?sub[i].addamount.toFixed(2):undefined;
            }
          }
        }

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
    *submit({ payload }, { call,put }) {
      payload.isDeleted=0;
      const response = yield call(submit, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/dispatch/dispatchplan');
      }
      yield put({
        type: 'updateState',
        payload: { submitLoading: false },
      });
    },*submitByOrder({ payload }, { call,put }) {
      payload.isDeleted=0;
      const response = yield call(submitByOrder, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/dispatch/dispatchplanByorder');
      }
      yield put({
        type: 'updateState',
        payload: { submitLoading: false },
      });
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
    detailCode(state, action){
      return {
        ...state,
        detail: action.payload.detail,
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
