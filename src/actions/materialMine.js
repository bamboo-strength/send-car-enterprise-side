import { GOODS_NAMESPACE } from '@/actions/GoodsActions';

export const MATERIALMINE_NAMESPACE = 'materialMine';


export function MATERIALMINE_INIT(payload) {
  return {
    type: `${MATERIALMINE_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function MATERIALMINE_LIST(payload) {
  return {
    type:  `${MATERIALMINE_NAMESPACE}/fetchList`,
    payload,
  };
}

export function MATERIALMINE_DETAIL(id) {
  return {
    type: `${MATERIALMINE_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function MATERIALMINE_DETAIL_M(payload) {
  return {
    type: `${MATERIALMINE_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function MATERIALMINE_SUBMIT(payload) {

  return {
    type: `${MATERIALMINE_NAMESPACE}/submit`,
    payload,
  };
}

export function MATERIALMINE_REMOVE(payload) {
  return {
    type: `${MATERIALMINE_NAMESPACE}/remove`,
    payload,
  };
}

export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${MATERIALMINE_NAMESPACE}/updateState`,
    payload,
  };
}
