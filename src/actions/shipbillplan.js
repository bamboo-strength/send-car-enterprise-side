
export const SHIPBILLPLAN_NAMESPACE = 'shipbillplan';

export function SHIPBILLPLAN_INIT(payload) {
  return {
    type: `${SHIPBILLPLAN_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function SHIPBILLPLAN_LIST(payload) {
  return {
    type:  `${SHIPBILLPLAN_NAMESPACE}/fetchList`,
    payload,
  };
}

export function SHIPBILLPLAN_DETAIL(id) {
  return {
    type: `${SHIPBILLPLAN_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function SHIPBILLPLAN_DETAIL_M(payload) {
  return {
    type: `${SHIPBILLPLAN_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function SHIPBILLPLAN_SUBMIT(params) {
  return {
    type: `${SHIPBILLPLAN_NAMESPACE}/submit`,
    params,
  };
}

export function SHIPBILLPLAN_REMOVE(payload) {
  return {
    type: `${SHIPBILLPLAN_NAMESPACE}/remove`,
    payload,
  };
}
