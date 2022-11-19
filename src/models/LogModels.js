import { SHOW_TOTAL_SIMPLE } from '@/utils/PaginationShowTotal';
import { list, detail, update } from '@/services/LogService';
import { tree as roles } from '@/services/role';
import { tree as depts } from '@/services/dept';
import { message } from 'antd';
import router from 'umi/router';



export default {
  namespace: 'mylog',
  state: {
    data: {
      list: [],
      pagination: { showTotal: SHOW_TOTAL_SIMPLE },
    },
    init: {
      roleTree: [],
      deptTree: [],
    },
    detail: {},
  },
  effects: {
    * fetchList({ payload }, { call, put }) {
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
    * fetchInit({ payload }, { call, put }) {
      const responseRole = yield call(roles, payload);
      const responseDept = yield call(depts, payload);
      if (responseRole.success && responseDept.success) {
        yield put({
          type: 'saveInit',
          payload: {
            roleTree: responseRole.data,
            deptTree: responseDept.data,
          },
        });
      }
    },
    * fetchDetail({ payload }, { call, put }) {
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
    * update({ params }, { call }) {
      const response = yield call(update, params);
      if (response.success) {
        message.success('提交成功');
        router.push('/base/log');
      }
    },
  },


  reducers: {
    saveList(state,action) {
      return {
        ...state,
        data:action.payload,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload.detail,
      };
    },
    saveInit(state, action) {
      return {
        ...state,
        init: action.payload,
      };
    },
  },
}
