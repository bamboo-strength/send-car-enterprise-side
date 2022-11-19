import { DISPATCHBILL_NAMESPACE } from '@/actions/dispatchbill';

export const DISPATCHBILLBYWAYBILL_NAMESPACE = 'dispatchbillByWaybill';

export function DISPATCHBILLBYWAYBILL_LIST(payload) {
  return {
    type: `${DISPATCHBILLBYWAYBILL_NAMESPACE}/fetchList`,
    payload,
  };
}

export function DISPATCHBILLBYWAYBILL_INIT(payload) {
  return {
    type: `${DISPATCHBILLBYWAYBILL_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function DISPATCHBILLBYWAYBILL_DETAIL(id) {
  return {
    type: `${DISPATCHBILLBYWAYBILL_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function DISPATCHBILLBYWAYBILL_SUBMIT(payload) {
  return {
    type: `${DISPATCHBILLBYWAYBILL_NAMESPACE}/submit`,
    payload,
  };
}

export function DISPATCHBILLBYWAYBILL_UPDATE(payload) {
  return {
    type: `${DISPATCHBILLBYWAYBILL_NAMESPACE}/update`,
    payload,
  };
}

export function DISPATCHBILLBYWAYBILL_REMOVE(payload) {
  return {
    type: `${DISPATCHBILLBYWAYBILL_NAMESPACE}/remove`,
    payload,
  };
}

export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${DISPATCHBILLBYWAYBILL_NAMESPACE}/updateState`,
    payload,
  };
}
