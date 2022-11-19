
export const COMMONBUSINESS_NAMESPACE = 'commonBusiness';

export function COMMONBUSINESS_LIST(payload) {
  return {
    type:  `${COMMONBUSINESS_NAMESPACE}/fetchList`,
    payload,
  };
}

export function COMMONBUSINESS_LISTEXPORT(payload) {
  return {
    type:  `${COMMONBUSINESS_NAMESPACE}/fetchListExport`,
    payload,
  };
}

export function COMMONBUSINESS_DETAIL(payload) {
  return {
    type: `${COMMONBUSINESS_NAMESPACE}/fetchDetail`,
    payload,
  };
}


export function COMMONBUSINESS_SUBMIT(payload) {
  return {
    type: `${COMMONBUSINESS_NAMESPACE}/submit`,
    payload,
  };
}

export function COMMONBUSINESS_SUBMITFORDISPATCH(payload) {
  return {
    type: `${COMMONBUSINESS_NAMESPACE}/submitForDispatch`,
    payload,
  };
}

export function COMMONBUSINESS_REMOVE(payload) {
  return {
    type: `${COMMONBUSINESS_NAMESPACE}/remove`,
    payload,
  };
}
export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${COMMONBUSINESS_NAMESPACE}/updateState`,
    payload,
  };
}
