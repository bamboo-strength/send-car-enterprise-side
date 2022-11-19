import { message } from 'antd';
import router from 'umi/router';
import { list, detail,submit} from '../services/salebill';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';
import { tree } from '@/services/dept';
import { dict } from '../services/dict';
import func from '../utils/Func';
import { getTenantId } from '../pages/Merchants/commontable';

export default {
  namespace: 'salebill',
  state: {
    data: {
      list: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
    },
    init: {
      deptTree: [],
      auditStatusName: [],
    },
    detail: {},
    submitLoading: false
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
                list: func.notEmpty(response.data)?JSON.parse(response.data):[]
              },
            });
          }
        }else {
          yield put({
            type: 'saveList',
            payload: {
              list: func.notEmpty(response.data.records)?response.data.records:[],
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
      const responseDept = yield call(tree);
      let auditStatusName = [];
      const val = payload.code;
      for (let i=0; i<val.length; i+=1) {
        const responseDict = yield call(dict, { 'code': val[i] });
        if (val[i] === 'auditStatus'){
          auditStatusName = responseDict.data;
        }
      }
      if (responseDept.success) {
        yield put({
          type: 'saveInit',
          payload: {
            deptTree: responseDept.data,
            auditStatusName,
          },
        });
      }
    },
    *fetchDetail({ payload }, { call, put }) {
      const repayload = payload
      repayload.tenantId = getTenantId()
      repayload['Blade-DesignatedTenant'] = getTenantId()
      const response = yield call(detail, payload);
      if (response.success) {
        const respDate = response.data
        /* respDate.totalamount = respDate.totalamount.toFixed(2);
         respDate.shipmentamount = respDate.shipmentamount.toFixed(2);
         respDate.remainamount = respDate.remainamount.toFixed(2);
        const  sub =respDate.sublist;
        if (func.notEmpty(sub)) {
          for (let i = 0; i <sub.length; i += 1) {
            sub[i].amount = func.notEmpty(sub[i].amount)?sub[i].amount.toFixed(2):undefined;
            sub[i].shipamount = func.notEmpty(sub[i].shipamount)?sub[i].shipamount.toFixed(2):undefined;
            sub[i].remainamount = func.notEmpty(sub[i].remainamount)?sub[i].remainamount.toFixed(2):undefined;
            sub[i].notaxprice = func.notEmpty(sub[i].notaxprice)?sub[i].notaxprice.toFixed(4):undefined;
            sub[i].taxprice = func.notEmpty(sub[i].taxprice)?sub[i].taxprice.toFixed(4):undefined;
            sub[i].floatrate = func.notEmpty(sub[i].floatrate)?sub[i].floatrate.toFixed(2):undefined
          }
        } */
        if(typeof respDate === 'string') {  // 区分对接神宁查询
          yield put({
            type: 'saveDetail',
            payload: {
              detail: JSON.parse(respDate),
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
    *submit({ payload }, { call,put }) {
      payload.isDeleted=0;
      const response = yield call(submit, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/salebill/salebill');
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
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
