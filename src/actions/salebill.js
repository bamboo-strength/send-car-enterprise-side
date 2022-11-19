import { PACKAGE_NAMESPACE } from '@/actions/package';

export const SALEBILL_NAMESPACE = 'salebill';

export function SALEBILL_INIT(payload) {
  return {
    type: `${SALEBILL_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function SALEBILL_LIST(payload) {
  return {
    type:  `${SALEBILL_NAMESPACE}/fetchList`,
    payload,
  };
}

export function SALEBILL_DETAIL(id) {
  return {
    type: `${SALEBILL_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function SALEBILL_DETAIL_M(payload) {
  return {
    type: `${SALEBILL_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function SALEBILL_SUBMIT(payload) {
  return {
    type: `${SALEBILL_NAMESPACE}/submit`,
    payload,
  };
}


export function SALEBILL_REMOVE(payload) {
  return {
    type: `${SALEBILL_NAMESPACE}/remove`,
    payload,
  };
}

export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${SALEBILL_NAMESPACE}/updateState`,
    payload,
  };
}
