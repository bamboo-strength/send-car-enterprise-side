export const MYBANKCARD = 'mybankcard';

export function MYBANKCARD_LIST(payload) {
  return {
    type: `${MYBANKCARD}/fetchList`,
    payload,
  };
}

export function MYBANKCARD_DETAIL(id) {
  return {
    type: `${MYBANKCARD}/fetchDetail`,
    payload: { id },
  };
}

export function MYBANKCARD_SUBMIT(payload) {
  return {
    type: `${MYBANKCARD}/submit`,
    payload,
  };
}

export function MYBANKCARD_UPDATE(payload) {
  return {
    type: `${MYBANKCARD}/update`,
    payload,
  };
}

export function MYBANKCARD_REMOVE(payload) {
  return {
    type: `${MYBANKCARD}/remove`,
    payload,
  };
}
