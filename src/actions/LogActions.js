
export const LOG_NAMESPACE = 'mylog';

export function LOG_LIST(payload) {
  return {
    type: `${LOG_NAMESPACE}/fetchList`,
    payload,
  };
}
export function LOG_INIT(payload) {
  return {
    type: `${LOG_NAMESPACE}/fetchInit`,
    payload,
  };
}
export function LOG_UPDATE(params) {
  return {
    type: `${LOG_NAMESPACE}/update`,
    params,
  };
}
export function LOG_DETAIL(id) {
  return {
    type: `${LOG_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

