import { message } from 'antd';
import router from 'umi/router';
import { FEEDBACK_NAMESPACE } from '../actions/feedback';
import { submit, remove} from '../services/feedback';
import { dict } from '../services/dict';


export default {
  namespace: FEEDBACK_NAMESPACE,
  state: {
    data: {
      list: [],
      pagination: {},
    },
    listData:[],
    init: {},
    detail: {},
  },
  effects: {
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
    *submit({ payload }, { call }) {
      const response = yield call(submit, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/driverSide/personal/feedback');
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
    saveInit(state, action) {
      return {
        ...state,
        init: action.payload,
      };
    },
  },
};
