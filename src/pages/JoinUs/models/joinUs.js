import { joinus } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
import router from 'umi/router';

export default {
  namespace: 'joinus',

  state: {
    data: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      // console.log(payload)
      const response = yield call(joinus, payload);
      if (response.success) {
        message.success(response.msg);
        yield put({
          type: 'joinusHandle',
          payload: response,
        });
        // router.push('/user/joinus-result');
        router.push({
          pathname: '/user/joinus-result',
          state: {
            payload,
          },
        },)
      }
    },
  },

  reducers: {
    joinusHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        data: payload.data,
      };
    },
  },
};
