export const SHIPBILLORDER_NAMESPACE = 'shipbillorder';

export function SHIPBILLORDER_INIT(payload) {
  return {
    type: `${SHIPBILLORDER_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function SHIPBILLORDER_LIST(payload) {
  return {
    type:  `${SHIPBILLORDER_NAMESPACE}/fetchList`,
    payload,
  };
}

export function SHIPBILLORDER_DETAIL(id) {
  return {
    type: `${SHIPBILLORDER_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function SHIPBILLORDER_DETAIL_M(payload) {
  return {
    type: `${SHIPBILLORDER_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function SHIPBILLORDER_SUBMIT(payload) {

  return {
    type: `${SHIPBILLORDER_NAMESPACE}/submit`,
    payload,
  };
}

export function SHIPBILLORDER_REMOVE(payload) {
  return {
    type: `${SHIPBILLORDER_NAMESPACE}/remove`,
    payload,
  };
}

