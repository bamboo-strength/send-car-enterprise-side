import router from 'umi/router';
import { LOCUS_NAMESPACE } from '../actions/locus';
import { getOpenGps } from '../services/locus';
import moment from 'moment';

export default {
  namespace: LOCUS_NAMESPACE,
  state: {
    list : [],
    location : {},
    gpsOpenPositInfo : {}
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(getLocus, payload);
      if (response.success) {
        yield put({
          type: 'saveList',
          payload: {
            list: response.data
          },
        });
      }
      return response;
    },

    // *fetchOpenGPSInfo({ payload }, { call, put }) {
    //   const response = yield call(getOpenGps, payload);
    //   yield put({
    //     type: 'saveOpenGPSInfo',
    //     payload: {
    //       gpsOpenPositInfo: response.data
    //     },
    //   });
    //   return response;
    // },

  },
  reducers: {
    saveList (state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveLocation (state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveOpenGPSInfo (state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
