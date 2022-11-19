import { GOODS_NAMESPACE } from '@/actions/GoodsActions';

export const CARRIER_NAMESPACE = 'carrier';

export function CARRIER_LIST(payload) {
  console.log("action:CARRIER_LIST")
  return{
    type:`${CARRIER_NAMESPACE}/fetchList`,
    payload,
  };
}

export function CARRIER_INIT() {
  return{
    type:`${CARRIER_NAMESPACE}/fetchInit`,
  };
}

export function CARRIER_DETAIL(id) {
  return{
    type: `${CARRIER_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function CARRIER_SUNMIT(payload){
  return{
    type: `${CARRIER_NAMESPACE}/submit`,
    payload,
  };
}

export function CARRIER_REMOVE(payload){
  return{
    type: `${CARRIER_NAMESPACE}/remove`,
    payload,
  };
}


export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${CARRIER_NAMESPACE}/updateState`,
    payload,
  };
}
