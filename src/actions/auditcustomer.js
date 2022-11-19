export const AUDITCUSTOMER_NAMESPACE = 'auditcustomer';



export function AUDITCUSTOMER_INIT(payload) {
  return {
    type: `${AUDITCUSTOMER_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function AUDITCUSTOMER_LIST(payload) {
  return {
    type:  `${AUDITCUSTOMER_NAMESPACE}/fetchList`,
    payload,
  };
}

export function AUDITCUSTOMER_SUBMIT(payload) {

  return {
    type: `${AUDITCUSTOMER_NAMESPACE}/submit`,
    payload,
  };
}

export function AUDITCUSTOMER_ADD(payload) {

  return {
    type: `${AUDITCUSTOMER_NAMESPACE}/add`,
    payload,
  };
}

export function AUDITCUSTOMER_DETAIL(id) {
  return {
    type: `${AUDITCUSTOMER_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function AUDITCUSTOMER_DETAIL_M(payload) {
  return {
    type: `${AUDITCUSTOMER_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function AUDITCUSTOMER_REMOVE(payload) {
  return {
    type: `${AUDITCUSTOMER_NAMESPACE}/remove`,
    payload,
  };
}
export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${AUDITCUSTOMER_NAMESPACE}/updateState`,
    payload,
  };
}
