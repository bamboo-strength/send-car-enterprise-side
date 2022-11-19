export const TENANTDETAIL_NAMESPACE = 'tenantDetail';

export function TENANTDETAIL_LIST(payload) {
  return {
    type: `${TENANTDETAIL_NAMESPACE}/fetchList`,
    payload,
  };
}

export function TENANTDETAIL_INIT(payload) {
  return {
    type: `${TENANTDETAIL_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function TENANTDETAIL_DETAIL(id) {
  return {
    type: `${TENANTDETAIL_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function TENANTDETAIL_DETAILBYPAYLOAD(payload) {
  return {
    type: `${TENANTDETAIL_NAMESPACE}/fetchDetail`,
    payload,
  };
}

export function TENANTDETAIL_SUBMIT(payload) {
  return {
    type: `${TENANTDETAIL_NAMESPACE}/submit`,
    payload,
  };
}

export function TENANTDETAIL_REMOVE(payload) {
  return {
    type: `${TENANTDETAIL_NAMESPACE}/remove`,
    payload,
  };
}
