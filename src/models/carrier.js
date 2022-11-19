import { message } from 'antd';
import router from 'umi/router';
import { list ,submit, detail } from '../services/carrier';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';

export default {
  namespace:'carrier',
  state:{
    data:{
      list:[],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    detail:{},
    submitLoading: false
  },
  effects:{
    *fetchList({ payload },{ call, put }){
      const response = yield call(list, payload);
      if (response.success){
        yield put({
          type: 'saveList',
          payload: {
            list: response.data.records,
            pagination: {
              total : response.data.total,
              current:response.data.current,
              pageSize: response.data.size,
            },
          },
        });
      }else {
        message.warn(response.msg);
      }
    },
    *submit({payload},{call,put}){
      const response= yield call(submit, payload);
      if (response.success){
        message.success('提交数据成功');
        router.push('/base/carrier');
      }
      yield put({
        type: 'updateState',
        payload: { submitLoading: false },
      });
    },
    *fetchDetail({ payload },{ call, put }) {
      const resp = yield call(detail, payload);
      if (resp.success){
        yield put ({
          type: 'saveDetail',
          payload:{
            detail: resp.data,
          }
        });
      }else {
        console.log(resp.msg);
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
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload.detail,
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
