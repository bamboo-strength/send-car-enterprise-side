import { MAINTENANCE } from '@/actions/maintenance';
import {
  accountDetail,
  accountSave, accountUpdate,
  addAuthApply,
  bindCompany,
  companyh5page,
  companyResult,
  personalResult,
  personalUrl, queryCompanyAuthDetail, queryUserAuthDetail, submitCompanyAuth,updateCompanyUser,
} from '@/services/maintenance';
import router from 'umi/router';
import { Toast } from 'antd-mobile';

/**
 * @author 马静
 * @date 2021/10/12
 * @Description: 契约锁接口
 */
export default {
  namespace: MAINTENANCE,
  state: {
    states: {
      company: {},
      personal: {},
    },
    link: {
      companyUrl: {},
      personalUrl: {},
    },
    submit: {
      companySubmit: {},
      personalSubmit: {},
      accountSave: {},
      accountUpdate: {},
      updateCompanyUser:{},
    },
    bind: {},
    detail: {
      personalDetail: {},
      companyDetail: {},
      accountDetail: {},
    },
  },
  effects: {
    /* 企业认证状态 */
    * fetchCompany({ payload }, { call, put }) {
      const response = yield call(companyResult, payload);
      yield put({
        type: 'unloadState',
        payload: {
          states: {
            company: response,
          },
        },
      });
    },
    /* 企业认证链接 */
    * fetchCompanyH5page({ payload }, { call, put }) {
      const response = yield call(companyh5page, payload);
      yield put({
        type: 'unloadState',
        payload: {
          link: {
            companyUrl: response,
          },
        },
      });
    },
    /* 个人认证状态 */
    * fetchPersonal({ payload }, { call, put }) {
      const response = yield call(personalResult, payload);
      yield put({
        type: 'unloadState',
        payload: {
          states: {
            personal: response,
          },
        },
      });
    },
    /* 个人认证链接 */
    * fetchPersonalUrl({ payload }, { call, put }) {
      const response = yield call(personalUrl, payload);
      yield put({
        type: 'unloadState',
        payload: {
          link: {
            personalUrl: response,
          },
        },
      });
    },
    /* 个人认证 */
    * fetchAddAuthApply({ payload }, { call, put }) {
      const response = yield call(addAuthApply, payload);
      yield put({
        type: 'unloadState',
        payload: {
          submit: {
            personalSubmit: response,
          },
        },
      });
    },
    /* 更新企业员工信息 */
    *fetchUpdateCompanyUser({ payload }, { call,put }) {
      const response = yield call(updateCompanyUser, payload);
      yield put({
        type: 'unloadState',
        payload: {
          submit: {
            updateCompanyUser: response,
          },
        },
      });
    },
    /* 绑定企业 */
    * fetchBindCompany({ payload }, { call, put }) {
      const response = yield call(bindCompany, payload);
      yield put({
        type: 'unloadState',
        payload: {
          bind: response,
        },
      });
    },
    /* 企业认证 */
    * fetchSubmitCompanyAuth({ payload }, { call, put }) {
      const response = yield call(submitCompanyAuth, payload);
      yield put({
        type: 'unloadState',
        payload: {
          submit: {
            companySubmit: response,
          },
        },
      });
    },
    /* 个人认证详情 */
    * fetchQueryUserAuthDetail({ payload }, { call, put }) {
      const response = yield call(queryUserAuthDetail, payload);
      yield put({
        type: 'unloadState',
        payload: {
          detail: {
            personalDetail: response,
          },
        },
      });
    },  /* 企业认证详情 */
    * fetchQueryCompanyAuthDetail({ payload }, { call, put }) {
      const response = yield call(queryCompanyAuthDetail, payload);
      yield put({
        type: 'unloadState',
        payload: {
          detail: {
            companyDetail: response,
          },
        },
      });
    },
    /**
     * @author 马静
     * @date 2021/10/20
     * @Description: 开户信息
     */
    /* 开户新增 */
    * fetchAccountSave({ payload }, { call, put }) {
      const response = yield call(accountSave, payload);
      yield put({
        type: 'unloadState',
        payload: {
          submit: {
            accountSave: response,
          },
        },
      });
    },
    /* 开户修改 */
    * fetchAccountUpdate({ payload }, { call, put }) {
      const response = yield call(accountUpdate, payload);
      yield put({
        type: 'unloadState',
        payload: {
          submit: {
            accountUpdate: response,
          },
        },
      });
    },
    /* 开户详情 */
    * fetchAccountDetail({ payload }, { call, put }) {
      const response = yield call(accountDetail, payload);
      yield put({
        type: 'unloadState',
        payload: {
          detail: {
            accountDetail: response,
          },
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
