export const MERVEHIVL_NAMESPACE = 'merVehicle';

export function MERVEHIVL_LIST(payload) {
  return {
    type: `${MERVEHIVL_NAMESPACE}/fetchList`,
    payload,
  };
}

export function MERVEHIVL_INIT(payload) {
  return {
    type: `${MERVEHIVL_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function MERVEHIVL_DETAIL(id) {
  return {
    type: `${MERVEHIVL_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function MERVEHIVL_DETAIL_M(id) {
  return {
    type: `${MERVEHIVL_NAMESPACE}/fetchDetailM`,
    payload: { id },
  };
}


export function MERVEHIVL_SUBMIT(payload) {
  return {
    type: `${MERVEHIVL_NAMESPACE}/submit`,
    payload,
  };
}

export function MERVEHIVL_UPDATE(payload) {
  return {
    type: `${MERVEHIVL_NAMESPACE}/update`,
    payload,
  };
}

export function MERVEHIVL_REMOVE(payload) {
  return {
    type: `${MERVEHIVL_NAMESPACE}/remove`,
    payload,
  };
}


export function SMFYMERVEHIVL_LIST(payload) {
  return {
    type: `${MERVEHIVL_NAMESPACE}/smfyfetchList`,
    payload,
  };
}
