import { message } from 'antd';
import router from 'umi/router';
import { TRUCKINFO_NAMESPACE } from '../actions/truckinfo';
import { list, submit, detail, remove, detailM } from '../services/truckinfo';
import { dict } from '@/services/dict';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';
import { getCurrentUser } from '../utils/authority';

export default {
  namespace: TRUCKINFO_NAMESPACE,
  state: {
    data: {
      list: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    detail: {},
    init: {
      trucktypeName: [],
      paytypeName: [],
      truckStatusName: [],
      deviceStatusName: [],
      moinDeviceTypeName:[],
      approved:[],
    },
    submitLoading: false
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
    *fetchDetailM({ payload }, { call, put }) {
      const response = yield call(detailM, payload);
      if (response.success) {
        yield put({
          type: 'saveDetailM',
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
    *submit({ payload }, { call,put }) {
      const response = yield call(submit, payload);

      if (response.success) {
  /*      if (getCurrentUser().tenantId === '948728'){
          const truckMineral = {
            truckno: payload.truckno,
            approvedLoad: payload.loadCapacity,
          };
          yield call(updateTruckMineral, truckMineral);
        } */
        message.success('提交成功');
        router.push('/base/truckinfo');
      }
      yield put({
        type: 'updateState',
        payload: { submitLoading: false },
      });
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
    *fetchInit({ payload }, { call, put ,select}) {
      const val = payload.code;
      let trucktypeName = [];
      let paytypeName = [];
      let truckStatusName = [];
      let deviceStatusName = [];
      let moinDeviceTypeName = [];
      let approved = [];
      for (let i=0; i<val.length; i+=1){
        const responseDict = yield call(dict, {'code': val[i]});
        if (responseDict.success) {
          if (val[i] === 'trucktype'){
            trucktypeName = responseDict.data;
            const user = getCurrentUser();
            // 恶心的需求，冀东非要去掉斗车车型，不都一样么！！！ WTF!
            if (user.tenantId === '764537') {
              trucktypeName.splice(trucktypeName.findIndex(item => item.dictValue === '斗车'), 1)
            }
          }else if (val[i] === 'paytype'){
            paytypeName = responseDict.data;
          }else if (val[i] === 'truckStatus'){
            truckStatusName = responseDict.data;
          } else if (val[i] === 'monitoring_devicetype') {
            moinDeviceTypeName = responseDict.data;
          } else if (val[i] === 'approvedLoad'){
            approved = responseDict.data;
          } else if (val[i] === 'deviceStatus'){
            deviceStatusName = responseDict.data
          }
        }
      }
      yield put({
        type: 'saveInit',
        payload: {
          trucktypeName: trucktypeName,
          paytypeName: paytypeName,
          truckStatusName: truckStatusName,
          deviceStatusName: deviceStatusName,
          moinDeviceTypeName: moinDeviceTypeName,
          approved: approved,
        },
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
    saveDetailM(state, action){
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
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
