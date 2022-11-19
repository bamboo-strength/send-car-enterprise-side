import { CONTRACT } from '@/actions/contract';
import { commitContractOrder, send } from '@/services/contract';

export default {
  namespace: CONTRACT,
  state: {
    send: {},
  },
  effects: {
    /* 创建订单 */
    * fetchCommitContractOrder({ payload }, { call, put }) {
      const response = yield call(commitContractOrder, payload);
      console.log(response)
      yield put({
        type: 'unloadState',
        payload: {
          send: response,
        },
      });
    },
  },
  reducers: {
    unloadState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
