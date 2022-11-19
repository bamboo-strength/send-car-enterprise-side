export const JGRELATION_NAMESPACE = 'jgRelation';

export function JGRELATION_LIST(payload) {
  return {
    type: `${JGRELATION_NAMESPACE}/fetchList`,
    payload,
  };
}

export function JGRELATION_DETAIL(id) {
  return {
    type: `${JGRELATION_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function JGRELATION_CLEAR_DETAIL() {
  return {
    type: `${JGRELATION_NAMESPACE}/clearDetail`,
    payload: {},
  };
}

export function JGRELATION_SUBMIT(payload) {
  return {
    type: `${JGRELATION_NAMESPACE}/submit`,
    payload,
  };
}

export function JGRELATION_REMOVE(payload) {
  return {
    type: `${JGRELATION_NAMESPACE}/remove`,
    payload,
  };
}
