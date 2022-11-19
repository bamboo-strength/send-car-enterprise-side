export const WAYBILL_NAMESPACE = 'waybill';

export function WAYBILL_INIT(payload) {
  return {
    type: `${WAYBILL_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function WAYBILL_LIST(payload) {
  return {
    type:  `${WAYBILL_NAMESPACE}/fetchList`,
    payload,
  };
}

export function WAYBILL_DETAIL(id) {
  return {
    type: `${WAYBILL_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function WAYBILL_DETAIL_M(payload) {
  return {
    type: `${WAYBILL_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function WAYBILL_SUBMIT(payload) {
  return {
    type: `${WAYBILL_NAMESPACE}/submit`,
    payload,
  };
}


export function WAYBILL_REMOVE(payload) {
  return {
    type: `${WAYBILL_NAMESPACE}/remove`,
    payload,
  };
}
