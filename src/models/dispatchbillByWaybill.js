import { message } from 'antd';
import router from 'umi/router';
import { DISPATCHBILLBYWAYBILL_NAMESPACE } from '../actions/dispatchbillByWaybill';
import { list,submit,detail, remove,update} from '../services/dispatchbillByWaybill';
import { dict } from '../services/dict';
import { getTenantId } from '../pages/Merchants/commontable';


export default {
  namespace: DISPATCHBILLBYWAYBILL_NAMESPACE,
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
        if(typeof response.data === 'string'){  // 区分 对接神宁查询
          if (response.success) {
            yield put({
              type: 'saveList',
              payload: {
                list: JSON.parse(response.data),
              },
            });
          }
        }else {
          /*   const respDate = response.data.records
          for (let i = 0; i <respDate.length; i += 1) {
                respDate[i].preamount = respDate[i].preamount.toFixed(2);
            } */
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
      const repayload = payload
      repayload.tenantId = getTenantId()
      repayload['Blade-DesignatedTenant'] = getTenantId()
      const response = yield call(detail, payload);
      if (response.success) {
        if(typeof response.data === 'string') {  // 区分对接神宁查询
          yield put({
            type: 'saveDetail',
            payload: {
              detail: JSON.parse(response.data)[0],
            },
          });
        }else {
          yield put({
            type: 'saveDetail',
            payload: {
              detail: response.data,
            },
          });
        }
      }
    },
    *submit({ payload }, { call }) {
      const response = yield call(submit, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/dispatch/dispatchbillbywaybill');
      }
    },
    *update({ payload }, { call }) {
      const response = yield call(update, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/dispatch/dispatchbillbywaybill');
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
