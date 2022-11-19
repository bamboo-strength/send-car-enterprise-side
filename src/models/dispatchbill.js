import { message } from 'antd';
import { Modal,  Toast } from 'antd-mobile';
import router from 'umi/router';
import { DISPATCHBILL_NAMESPACE } from '../actions/dispatchbill';
import { list,submit,detail, remove,update} from '../services/dispatchbill';
import { dict } from '../services/dict';
import func from '../utils/Func';
import { getTenantId } from '../pages/Merchants/commontable';

const {alert} = Modal;

export default {
  namespace: DISPATCHBILL_NAMESPACE,
  state: {
    data: {
      list: [],
      pagination: {},
    },
    init: {
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
          /* const respDate = response.data.records
         for (let i = 0; i <respDate.length; i += 1) {
              respDate[i].preamount = respDate[i].preamount.toFixed(2);
          } */
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
              detail: JSON.parse(response.data),
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
    *submit({ payload }, { call,put }) {
     /*  const {form,billBringData} = payload
      delete payload.form
      delete payload.billBringData */
      const response = yield call(submit, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/dispatch/dispatchbillbyorder');
        /*  if(func.notEmpty(payload.id)){
            message.success('提交成功');
            router.push('/dispatch/dispatchbillbyorder');
          } else{
            alert('提交成功', '再来一车？', [
              { text: '取消', onPress: () => router.push('/dispatch/dispatchbillbyorder') },
              {
                text: '好的',
                onPress: () =>{
                  form.resetFields()
                  billBringData.split(',').map((value) => {
                    form.setFieldsValue({
                      [value]: payload[value],
                    });
                  })
                }
              },
            ])
          } */
      }
      yield put({
        type: 'updateState',
        payload: { submitLoading: false },
      });
    },
    *update({ payload }, { call }) {
      const response = yield call(update, payload);
      if (response.success) {
        message.success('提交成功');
        router.push('/dispatch/dispatchbillbyorder');
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
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
