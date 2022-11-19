import { message} from 'antd';
import router from 'umi/router';
import { list, submit, detail,RegistedInfo } from '../services/customer';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';
import { dict } from '../services/dict';

export default {
  namespace: 'customer',
  state: {
    data: {
      list: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    init: {
      registerflagname: [],
      industryname: [],
      deptName: [],
    },
    submitLoading: false,
    detail: {},
    RegistedInfo:{},
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
      const val = payload.code;
      let industryname = [];
      let registerflagname = [];
      let deptName = [];
      for (let i=0; i<val.length; i+=1){
        const responseDict = yield call(dict, {'code': val[i]});
        if (responseDict.success) {
          if (val[i] === 'industryname'){
            industryname = responseDict.data;
          }else if (val[i] === 'registerflagname'){
            registerflagname = responseDict.data;
          }else if (val[i] === 'deptName'){
            deptName = responseDict.data;
          }
        }
      }
      yield put({
        type: 'saveInit',
        payload: {
          industryname,
          registerflagname,
          deptName
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
    *fetchRegistedInfo({ payload }, { call, put }) {
      const response = yield call(RegistedInfo, payload);
      if (response.success) {
        yield put({
          type: 'saveRegistedInfo',
          payload: {
            RegistedInfo: response,
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
    *submit({ params }, { call,put }) {
      params.isDeleted=0;
      const response = yield call(submit, params);
      if (response.success) {
        message.success('提交成功');
        router.push('/base/customer');
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
    saveRegistedInfo(state, action) {
      return {
        ...state,
        RegistedInfo: action.payload.RegistedInfo.data,
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
