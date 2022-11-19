import { DISPATCHBILLBYWAYBILL_NAMESPACE } from '@/actions/dispatchbillByWaybill';

export const DISPATCHPLAN_NAMESPACE = 'dispatchplan';

export function DISPATCHPLAN_INIT(payload) {
  return {
    type: `${DISPATCHPLAN_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function DISPATCHPLAN_LIST(payload) {
  return {
    type:  `${DISPATCHPLAN_NAMESPACE}/fetchList`,
    payload,
  };
}

export function DISPATCHPLAN_DETAIL(id) {
  return {
    type: `${DISPATCHPLAN_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function DISPATCHPLAN_DETAIL_M(payload) {
  return {
    type: `${DISPATCHPLAN_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function DISPATCHPLAN_SUBMIT(payload) {
  return {
    type: `${DISPATCHPLAN_NAMESPACE}/submit`,
    payload,
  };
}

export function DISPATCHPLANBYORDER_SUBMIT(payload) {
  return {
    type: `${DISPATCHPLAN_NAMESPACE}/submitByOrder`,
    payload,
  };
}

export function DISPATCHPLAN_REMOVE(payload) {
  return {
    type: `${DISPATCHPLAN_NAMESPACE}/remove`,
    payload,
  };
}


export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${DISPATCHPLAN_NAMESPACE}/updateState`,
    payload,
  };
}
