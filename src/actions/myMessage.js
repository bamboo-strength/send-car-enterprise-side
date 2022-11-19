export const MYMESSAGE_NAMESPACE = 'myMessage';

export function MYMESSAGE_LIST(payload) {
  return {
    type: `${MYMESSAGE_NAMESPACE}/fetchList`,
    payload,
  };
}

export function MYMESSAGE_INIT(payload) {
  return {
    type: `${MYMESSAGE_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function MYMESSAGE_DETAIL(id) {
  return {
    type: `${MYMESSAGE_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function MYMESSAGE_SUBMIT(payload) {
  return {
    type: `${MYMESSAGE_NAMESPACE}/submit`,
    payload,
  };
}

export function MYMESSAGE_UPDATE(payload) {
  return {
    type: `${MYMESSAGE_NAMESPACE}/update`,
    payload,
  };
}

export function MYMESSAGE_REMOVE(payload) {
  return {
    type: `${MYMESSAGE_NAMESPACE}/remove`,
    payload,
  };
}
