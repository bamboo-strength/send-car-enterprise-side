import { message } from 'antd';
import { TABLEEXTEND_NAMESPACE } from '../actions/tableExtend';
import { list,submit,detail, remove,listShowColum,addEditShowColum} from '../services/tableExtend';
import {getTenantId} from  '../pages/Merchants/commontable';
import { dict } from '../services/dict';

export default {
  namespace: TABLEEXTEND_NAMESPACE,
  state: {
    data: {
      list: [],
      columList:[],
      addEditColumList:[],
      pagination: {},
    },
    init: {
      showflagName: [],
      categoryName: [],
      columnTypeName:[],
      keyflagName:[],
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
    *fetchColumnList({ payload }, { call, put }) {
      const repayload = payload
      repayload.tenantId = getTenantId()
      repayload['Blade-DesignatedTenant']= getTenantId()
      const response = yield call(listShowColum, repayload);
      if (response.success) {
        yield put({
          type: 'saveColumnList',
          payload: {
            columList: response.data,
          },
        });
      }
    },
    *fetchAddEditColumnList({ payload }, { call, put }) {
      const repayload = payload
      repayload.tenantId = getTenantId()
      repayload['Blade-DesignatedTenant'] = getTenantId()
      const response = yield call(addEditShowColum, repayload);
      if (response.success) {
        yield put({
          type: 'saveAddEditColumnList',
          payload: {
            addEditColumList: response.data,
          },
        });
      }
    },
    *fetchInit({ payload }, { call, put }) {
      const val = payload.code;
      let showflagName = [];
      let categoryName = [];
      let columnTypeName=[];
      let keyflagName=[]
      for (let i=0; i<val.length; i+=1){
        const responseDict = yield call(dict, {'code': val[i]});
        if (responseDict.success) {
          if (val[i] === 'showflag'){
            showflagName = responseDict.data;
          }else if (val[i] === 'categoryName'){
            categoryName = responseDict.data;
          }else if (val[i] === 'columnType'){
            columnTypeName=responseDict.data;
          }else if (val[i] === 'keyflag'){
            keyflagName=responseDict.data;
          }
        }
      }
      yield put({
        type: 'saveInit',
        payload: {
          showflagName: showflagName,
          categoryName: categoryName,
          columnTypeName:columnTypeName,
          keyflagName:keyflagName
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
       // router.push('/base/tableExtend');
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
    saveColumnList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveAddEditColumnList(state, action) {
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
