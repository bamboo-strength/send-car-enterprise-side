import {SHOW_TOTAL_SIMPLE} from "@/utils/PaginationShowTotal";
import {list} from "@/services/allthebill";
import {message} from "antd";
export default {
  namespace:'allthebill',
  state:{
    data:{
      list:[],
      pagination:{showTotal:SHOW_TOTAL_SIMPLE}
    },
    init:{},
    detail:{}
  },
  effects:{
    *fetchList({payload},{call,put}){
      const response = yield call(list,payload);
      if (response.success){
        yield put({
          type:'saveList',
          payload:{
            list:response.data.records,
            pagination: {
              total:response.data.total,
              current:response.data.current,
              pageSize: response.data.size
            }
          }
        })
        console.log("response99",response)
      }
    },

  },
  reducers:{
    saveList(state,action){
      return {
        ...state,
        data:action.payload
      }
    }
  }
}
