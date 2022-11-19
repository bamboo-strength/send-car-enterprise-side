import { MATERIALMINE_NAMESPACE } from '@/actions/materialMine';

export const MINERAL_NAMESPACE = 'mineral';


export function MINERAL_INIT(payload) {
  return {
    type: `${MINERAL_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function MINERAL_LIST(payload) {
  return {
    type:  `${MINERAL_NAMESPACE}/fetchList`,
    payload,
  };
}

export function MINERAL_DETAIL(id) {
  return {
    type: `${MINERAL_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function MINERAL_DETAIL_M(payload) {
  return {
    type: `${MINERAL_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function MINERAL_SUBMIT(payload) {

  return {
    type: `${MINERAL_NAMESPACE}/submit`,
    payload,
  };
}

export function MINERAL_REMOVE(payload) {
  return {
    type: `${MINERAL_NAMESPACE}/remove`,
    payload,
  };
}


export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${MINERAL_NAMESPACE}/updateState`,
    payload,
  };
}
