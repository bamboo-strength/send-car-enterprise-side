export const TABLEEXTEND_NAMESPACE = 'tableExtend';

export function TABLEEXTEND_LIST(payload) {
  return {
    type: `${TABLEEXTEND_NAMESPACE}/fetchList`,
    payload,
  };
}

export function TABLEEXTEND_COLUMNLIST(payload) {
  return {
    type: `${TABLEEXTEND_NAMESPACE}/fetchColumnList`,
    payload,
  };
}

export function TABLEEXTEND_ADDEDITLIST(payload) {
  return {
    type: `${TABLEEXTEND_NAMESPACE}/fetchAddEditColumnList`,
    payload,
  };
}

export function TABLEEXTEND_INIT(payload) {
  return {
    type: `${TABLEEXTEND_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function TABLEEXTEND_DETAIL(id) {
  return {
    type: `${TABLEEXTEND_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function TABLEEXTEND_SUBMIT(payload) {
  return {
    type: `${TABLEEXTEND_NAMESPACE}/submit`,
    payload,
  };
}

export function TABLEEXTEND_REMOVE(payload) {
  return {
    type: `${TABLEEXTEND_NAMESPACE}/remove`,
    payload,
  };
}
