import {SHOW_TOTAL_SIMPLE} from "@/utils/PaginationShowTotal";
import {detail} from '@/services/KsWallet/AccountSerivce';

export default {
  namespace:'billingmanagement',
  state:{
    data: {
      list: [],
      pagination: {showTotal: SHOW_TOTAL_SIMPLE}
    },
    billdetail:{}
  },
  effects:{
    * fetchDetail({payload}, {call, put}) {
      const response = yield call(detail, payload);
      if (response.success) {
        yield put({
          type: 'payDetail',
          payload: {
            billdetail: response.data,
          },
        });
      }
    },
  },
  reducers: {
    payDetail(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
}
