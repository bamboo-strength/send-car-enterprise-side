import { CUSTOMER_NAMESPACE } from '@/actions/customer';

export const DISPATCHBILL_NAMESPACE = 'dispatchbill';

export function DISPATCHBILL_LIST(payload) {
  return {
    type: `${DISPATCHBILL_NAMESPACE}/fetchList`,
    payload,
  };
}

export function DISPATCHBILL_INIT(payload) {
  return {
    type: `${DISPATCHBILL_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function DISPATCHBILL_DETAIL(id) {
  return {
    type: `${DISPATCHBILL_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function DISPATCHBILL_SUBMIT(payload) {
  return {
    type: `${DISPATCHBILL_NAMESPACE}/submit`,
    payload,
  };
}

export function DISPATCHBILL_UPDATE(payload) {
  return {
    type: `${DISPATCHBILL_NAMESPACE}/update`,
    payload,
  };
}

export function DISPATCHBILL_REMOVE(payload) {
  return {
    type: `${DISPATCHBILL_NAMESPACE}/remove`,
    payload,
  };
}
export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${DISPATCHBILL_NAMESPACE}/updateState`,
    payload,
  };
}
