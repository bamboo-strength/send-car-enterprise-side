import { SALEBILL_NAMESPACE } from '@/actions/salebill';

export const SPEC_NAMESPACE = 'spec';


export function SPEC_INIT(payload) {
  return {
    type: `${SPEC_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function SPEC_LIST(payload) {
  return {
    type:  `${SPEC_NAMESPACE}/fetchList`,
    payload,
  };
}

export function SPEC_DETAIL(id) {
  return {
    type: `${SPEC_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function SPEC_DETAIL_M(payload) {
  return {
    type: `${SPEC_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function SPEC_SUBMIT(payload) {

  return {
    type: `${SPEC_NAMESPACE}/submit`,
    payload,
  };
}

export function SPEC_REMOVE(payload) {
  return {
    type: `${SPEC_NAMESPACE}/remove`,
    payload,
  };
}

export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${SPEC_NAMESPACE}/updateState`,
    payload,
  };
}
