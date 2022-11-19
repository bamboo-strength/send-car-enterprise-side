export const CARLEADER = 'carleader';

export function CARLEADER_LIST(payload) {
  return {
    type: `${CARLEADER}/fetchList`,
    payload,
  };
}

export function CARLEADER_DETAIL(id) {
  return {
    type: `${CARLEADER}/fetchDetail`,
    payload: { id },
  };
}

export function CARLEADER_SUBMIT(payload) {
  return {
    type: `${CARLEADER}/submit`,
    payload,
  };
}

export function CARLEADER_REMOVE(payload) {
  return {
    type: `${CARLEADER}/remove`,
    payload,
  };
}
