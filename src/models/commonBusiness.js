import { message } from 'antd';
import router from 'umi/router';
import { submit, detail,list } from '../services/commonBusiness';
import { SHOW_TOTAL_SIMPLE } from '../utils/PaginationShowTotal';
import func from '../utils/Func';

export default {
  namespace: 'commonBusiness',
  state: {
    data: {
      list: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE},
      commonBusinessDefineVO:{},
    },
    init: {},
    detail: {
      data:{},
    },
    responseData:{},
    submitLoading: false,
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.success) {
        const {commonBusinessDefineVO} = response.data
        if(commonBusinessDefineVO.dataType === 0){  // 自有数据
          const {pages} = response.data
          yield put({
            type: 'saveList',
            payload: {
              list: pages.records,
              pagination: {
                total: pages.total,
                current: pages.current,
                pageSize: pages.size,
              },
              commonBusinessDefineVO
            },
          });
        }else { // 接口数据
          // const resultData = JSON.parse(response.data.resultData)
          const {resultData} = response.data
          // console.log(resultData.records,typeof resultData.records)
          if(func.notEmpty(resultData.total)){
            yield put({
              type: 'saveList',
              payload: {
                list: func.notEmpty(resultData.records)?typeof resultData.records === 'string'?JSON.parse(resultData.records):resultData.records:[],
                pagination: {
                  total: resultData.total,
                  current: resultData.current,
                  pageSize: resultData.size,
                },
                commonBusinessDefineVO
              },
            });
          }else {
            yield put({
              type: 'saveList',
              payload: {
                list: func.notEmpty(resultData.records)?typeof resultData.records === 'string'?JSON.parse(resultData.records):resultData.records:[],
                commonBusinessDefineVO
              },
            });
          }
        }

      }
    },
    *fetchListExport({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.success) {
        const resultData = JSON.parse(response.data.resultData)
        if(func.notEmpty(resultData.total)){
          yield put({
            type: 'saveListExport',
            payload: {
              list: resultData.records,
            },
          });
        }else {
          yield put({
            type: 'saveListExport',
            payload: {
              list: func.notEmpty(response.data.resultData)?JSON.parse(response.data.resultData):[],
            },
          });
        }
      }
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(detail, payload);
      if (response.success) {
        const {commonBusinessDefineVO} = response.data
        if(commonBusinessDefineVO.dataType === 0){ // 自有
          yield put({
            type: 'saveDetail',
            payload: {
              detail: response.data.commonBusinessDataVO,
            },
            init:commonBusinessDefineVO
          });
        }else { // 接口数据
          const {resultData} = response.data
          yield put({
            type: 'saveDetail',
            payload: {
              detail:func.notEmpty(resultData)?typeof resultData === 'string'?JSON.parse(resultData):resultData:{},
            },
            init:commonBusinessDefineVO
          });
        }
      }
    },
    *submit({ payload }, { call ,put}) {
      const response = yield call(submit, payload);
      // console.log(response,'====')
      if (response.success) {
        message.success('提交成功');
        if(payload.btnCode === 'add' || payload.btnCode === 'edit' || payload.btnCode.includes('withUrl')){
          router.push(`/commonBusiness/commonList/${payload.tableName}/${payload.modulename}`);
        }
        /* else if(payload.btnCode === 'submit'){
          router.push('/dashboard/function')
        } */
      }
      yield put({
        type: 'updateState',
        payload: { submitLoading: false },
      });
    },
    *submitForDispatch({ payload }, { call ,put}) {
      const response = yield call(submit, payload);
      if (response.success) {
        message.success('提交成功');
        router.push(`/commonBusiness/commonList/${payload.tableName}/${payload.modulename}`)
      }
      yield put({
        type: 'responseData',
        responseData:response
      });
      yield put({
        type: 'updateState',
        payload: { submitLoading: false },
      });
    }
  },
  reducers: {
    saveListExport(state, action) {
      return {
        ...state,
        data: action.payload,
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
        init:action.init
      };
    },
    responseData(state, action){
      return {
        responseData: action.responseData,
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
