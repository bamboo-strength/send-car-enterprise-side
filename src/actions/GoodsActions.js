import { COMMONBUSINESS_NAMESPACE } from '@/actions/commonBusiness';

export const GOODS_NAMESPACE = 'GoodsModels';

export function GOODS_LIST(payload) {
  return {
    type: `${GOODS_NAMESPACE}/fetchList`,
    payload,
  };
}

export function GOODS_SUBMIT(payload) {
  return {
    type: `${GOODS_NAMESPACE}/submit`,
    payload,
  };
}

export function GOODS_DETAIL(id) {
  return {
    type: `${GOODS_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function GOODS_DETAIL_M(payload) {
  return {
    type: `${GOODS_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function GOODS_INIT() {
  return {
    type: `${GOODS_NAMESPACE}/fetchInit`,
    payload: { code: 'packaging' },
  };
}

export function GOODS_CLEAR_DETAIL() {
  return {
    type: `${GOODS_NAMESPACE}/clearDetail`,
    payload: {},
  };
}

export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${GOODS_NAMESPACE}/updateState`,
    payload,
  };
}
