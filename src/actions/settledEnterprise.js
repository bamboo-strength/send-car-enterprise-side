
export const SETTLEDENTERPRISE_NAMESPACE = 'settledEnterprise';

export function SETTLEDENTERPRISE_INIT(payload) {
  return {
    type: `${SETTLEDENTERPRISE_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function SETTLEDENTERPRISE_LIST(payload) {
  return {
    type:  `${SETTLEDENTERPRISE_NAMESPACE}/fetchList`,
    payload,
  };
}

export function SETTLEDENTERPRISE_TENANTLIST(payload) {
  return {
    type:  `${SETTLEDENTERPRISE_NAMESPACE}/fetchTenantList`,
    payload,
  };
}

export function SETTLEDENTERPRISE_DETAIL(id) {
  return {
    type: `${SETTLEDENTERPRISE_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function SETTLEDENTERPRISE_TENANTDETAIL(payload) {
  return {
    type: `${SETTLEDENTERPRISE_NAMESPACE}/fetchDetail`,
    payload,
  };
}


export function SETTLEDENTERPRISE_DETAIL_M(payload) {
  return {
    type: `${SETTLEDENTERPRISE_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function SETTLEDENTERPRISE_SUBMIT(payload) {

  return {
    type: `${SETTLEDENTERPRISE_NAMESPACE}/submit`,
    payload,
  };
}




