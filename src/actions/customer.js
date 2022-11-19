import { USER_NAMESPACE } from '@/actions/user';
import { CARRIER_NAMESPACE } from '@/actions/carrier';

export const CUSTOMER_NAMESPACE = 'customer';

export function CUSTOMER_INIT(payload) {
  return {
    type: `${CUSTOMER_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function CUSTOMER_LIST(payload) {
  return {
    type:  `${CUSTOMER_NAMESPACE}/fetchList`,
    payload,
  };
}

export function CUSTOMER_DETAIL(id) {
  return {
    type: `${CUSTOMER_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function CUSTOMER_DETAIL_M(payload) {
  return {
    type: `${CUSTOMER_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function CUSTOMER_SUBMIT(params) {
  return {
    type: `${CUSTOMER_NAMESPACE}/submit`,
    params,
  };
}

export function CUSTOMER_REMOVE(payload) {
  return {
    type: `${CUSTOMER_NAMESPACE}/remove`,
    payload,
  };
}
export function CUSTOMER_RegistedInfo() {
  return {
    type: `${CUSTOMER_NAMESPACE}/fetchRegistedInfo`,
  };
}

export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${CUSTOMER_NAMESPACE}/updateState`,
    payload,
  };
}
