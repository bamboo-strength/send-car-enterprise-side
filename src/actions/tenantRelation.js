
export const TENANTRELATION_NAMESPACE = 'tenantRelation';

export function TENANTRELATION_LIST(payload) {
  return {
    type:  `${TENANTRELATION_NAMESPACE}/fetchList`,
    payload,
  };
}

export function TENANTRELATION_TENANTLIST(payload) {
  return {
    type:  `${TENANTRELATION_NAMESPACE}/fetchTenantList`,
    payload,
  };
}




