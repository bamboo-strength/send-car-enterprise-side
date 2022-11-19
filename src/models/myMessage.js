import { message } from 'antd';
import router from 'umi/router';
import { MYMESSAGE_NAMESPACE } from '../actions/myMessage';
import { list,submit,detail, remove,update} from '../services/myMessage';
import { dict } from '../services/dict';


export default {
  namespace: MYMESSAGE_NAMESPACE,
  state: {
    data: {
      list: [],
      pagination: {},
    },
    init: {
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
    *submit({ payload }, { call }) {
      const response = yield call(submit, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/driverSide/personal/myMessage');
      }
    },
    *update({ payload }, { call }) {
      const response = yield call(update, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/driverSide/personal/myMessage');
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
