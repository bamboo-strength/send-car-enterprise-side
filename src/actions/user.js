export const USER_NAMESPACE = 'user';

export function USER_LIST(payload) {
  return {
    type: `${USER_NAMESPACE}/fetchList`,
    payload,
  };
}

export function USER_INIT() {
  return {
    type: `${USER_NAMESPACE}/fetchInit`,
    payload: {code:'sex'},
  };
}

export function USER_CHANGE_INIT(payload) {
  return {
    type: `${USER_NAMESPACE}/fetchChangeInit`,
    payload,
  };
}

export function USER_DETAIL(id) {
  return {
    type: `${USER_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function USER_ROLE_GRANT(payload, callback) {
  return {
    type: `${USER_NAMESPACE}/grant`,
    payload,
    callback,
  };
}

export function USER_SUBMIT(payload) {
  return {
    type: `${USER_NAMESPACE}/submit`,
    payload,
  };
}

export function USER_UPDATE(payload) {
  return {
    type: `${USER_NAMESPACE}/update`,
    payload,
  };
}

export function USER_UPDATEPASSWORD(payload) {
  return {
    type: `${USER_NAMESPACE}/updatepassword`,
    payload,
  };
}

export function USER_REMOVE(payload) {
  return {
    type: `${USER_NAMESPACE}/remove`,
    payload,
  };
}
