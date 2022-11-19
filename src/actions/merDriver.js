export const MERDRIVER_NAMESPACE = 'merDriver';

export function MERDRIVER_LIST(payload) {
  return {
    type: `${MERDRIVER_NAMESPACE}/fetchList`,
    payload,
  };
}

export function MERDRIVER_LISTWITHOUTPAGE(payload) {
  return {
    type: `${MERDRIVER_NAMESPACE}/fetchListWithoutPage`,
    payload,
  };
}

export function MERDRIVER_INIT(payload) {
  return {
    type: `${MERDRIVER_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function MERDRIVER_DETAIL(userId) {
  return {
    type: `${MERDRIVER_NAMESPACE}/fetchDetail`,
    payload: { userId },
  };
}
export function MERDRIVER_SHIPPER_DETAIL(id) {
  return {
    type: `${MERDRIVER_NAMESPACE}/fetchShipperDetail`,
    payload: { id },
  };
}

export function MERDRIVER_SUBMIT(payload) {
  return {
    type: `${MERDRIVER_NAMESPACE}/submit`,
    payload,
  };
}

export function MERDRIVER_UPDATE(payload) {
  return {
    type: `${MERDRIVER_NAMESPACE}/update`,
    payload,
  };
}

export function MERDRIVER_REMOVE(payload) {
  return {
    type: `${MERDRIVER_NAMESPACE}/remove`,
    payload,
  };
}
