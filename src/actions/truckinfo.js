import { SALEBILL_NAMESPACE } from '@/actions/salebill';

export const TRUCKINFO_NAMESPACE = 'truckinfo';

export function TRUCKINFO_LIST(payload) {
  return {
    type: `${TRUCKINFO_NAMESPACE}/fetchList`,
    payload,
  };
}

export function TRUCKINFO_DETAIL(id) {
  return {
    type: `${TRUCKINFO_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function TRUCKINFO_DETAIL_M(payload) {
  return {
    type: `${TRUCKINFO_NAMESPACE}/fetchDetailM`,
    payload,
  };
}

export function TRUCKINFO_CLEAR_DETAIL() {
  return {
    type: `${TRUCKINFO_NAMESPACE}/clearDetail`,
    payload: {},
  };
}

export function TRUCKINFO_SUBMIT(payload) {
  return {
    type: `${TRUCKINFO_NAMESPACE}/submit`,
    payload,
  };
}

export function TRUCKINFO_REMOVE(payload) {
  return {
    type: `${TRUCKINFO_NAMESPACE}/remove`,
    payload,
  };
}

export function TRUCKINFO_INIT(payload) {
  return {
    type: `${TRUCKINFO_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${TRUCKINFO_NAMESPACE}/updateState`,
    payload,
  };
}
