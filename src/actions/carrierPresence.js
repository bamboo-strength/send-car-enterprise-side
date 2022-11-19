
export const CARRIERPRESENCE_NAMESPACE = 'carrierPresence';

export function CARRIERPRESENCE_INIT(payload) {
  return {
    type: `${CARRIERPRESENCE_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function CARRIERPRESENCE_LIST(payload) {
  return {
    type:  `${CARRIERPRESENCE_NAMESPACE}/fetchList`,
    payload,
  };
}

export function CARRIERPRESENCE_TENANTLIST(payload) {
  return {
    type:  `${CARRIERPRESENCE_NAMESPACE}/fetchTenantList`,
    payload,
  };
}

export function CARRIERPRESENCE_DETAIL(id) {
  return {
    type: `${CARRIERPRESENCE_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function CARRIERPRESENCE_TENANTDETAIL(payload) {
  return {
    type: `${CARRIERPRESENCE_NAMESPACE}/fetchDetail`,
    payload,
  };
}


export function CARRIERPRESENCE_DETAIL_M(payload) {
  return {
    type: `${CARRIERPRESENCE_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function CARRIERPRESENCE_SUBMIT(payload) {
  return {
    type: `${CARRIERPRESENCE_NAMESPACE}/submit`,
    payload,
  };
}




