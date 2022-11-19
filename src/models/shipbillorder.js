import { message} from 'antd';
import router from 'umi/router';
import { list,detail } from '../services/shipbillorder';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';
import { dict } from '../services/dict';

export default {
  namespace: 'shipbillorder',
  state: {
    data: {
      list: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    init: {
      isfactoryType: [],
      carrType: [],
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
      const val = payload.code;
      let isfactoryType = [];
      let carrType = [];
      for (let i=0; i<val.length; i+=1){
        const responseDict = yield call(dict, {'code': val[i]});
        if (responseDict.success) {
          if (val[i] === 'isfactoryType'){
            isfactoryType = responseDict.data;
          }else if(val[i] === 'carrType'){
            carrType = responseDict.data;
          }
        }
      }
      yield put({
        type: 'saveInit',
        payload: {
          carrType: carrType,
          isfactoryType: isfactoryType
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
    *submit({ params }, { call }) {
      params.isDeleted=0;
      const response = yield call(submit, params);
      if (response.success) {
        message.success('提交成功');
        router.push('/shipbill/shipbill');
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
    detailCode(state, action){
      return {
        ...state,
        detail: action.payload.detail,
      };
    },
  },
};
