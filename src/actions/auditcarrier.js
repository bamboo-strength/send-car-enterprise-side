export const AUDITCARRIER_NAMESPACE = 'auditcarrier';



export function AUDITCARRIER_INIT(payload) {
  return {
    type: `${AUDITCARRIER_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function AUDITCARRIER_LIST(payload) {
  return {
    type:  `${AUDITCARRIER_NAMESPACE}/fetchList`,
    payload,
  };
}

export function AUDITCARRIER_SUBMIT(payload) {

  return {
    type: `${AUDITCARRIER_NAMESPACE}/submit`,
    payload,
  };
}

export function AUDITCARRIER_ADD(payload) {

  return {
    type: `${AUDITCARRIER_NAMESPACE}/add`,
    payload,
  };
}

export function AUDITCARRIER_DETAIL(id) {
  return {
    type: `${AUDITCARRIER_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function AUDITCARRIER_DETAIL_M(payload) {
  return {
    type: `${AUDITCARRIER_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function AUDITCARRIER_REMOVE(payload) {
  return {
    type: `${AUDITCARRIER_NAMESPACE}/remove`,
    payload,
  };
}


export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${AUDITCARRIER_NAMESPACE}/updateState`,
    payload,
  };
}
