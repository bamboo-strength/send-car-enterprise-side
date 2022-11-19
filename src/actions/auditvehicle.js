export const AUDITVEHICLE_NAMESPACE = 'auditvehicle';



export function AUDITVEHICLE_INIT(payload) {
  return {
    type: `${AUDITVEHICLE_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function AUDITVEHICLE_LIST(payload) {
  return {
    type:  `${AUDITVEHICLE_NAMESPACE}/fetchList`,
    payload,
  };
}

export function AUDITVEHICLE_SUBMIT(payload) {

  return {
    type: `${AUDITVEHICLE_NAMESPACE}/submit`,
    payload,
  };
}

export function AUDITVEHICLE_ADD(payload) {

  return {
    type: `${AUDITVEHICLE_NAMESPACE}/add`,
    payload,
  };
}

export function AUDITVEHICLE_DETAIL(id) {
  return {
    type: `${AUDITVEHICLE_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function AUDITVEHICLE_DETAIL_M(payload) {
  return {
    type: `${AUDITVEHICLE_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function AUDITVEHICLE_REMOVE(payload) {
  return {
    type: `${AUDITVEHICLE_NAMESPACE}/remove`,
    payload,
  };
}

export function AUDITVEHICLE_RELATIONTELENTLIST(payload) {
  return {
    type:  `${AUDITVEHICLE_NAMESPACE}/fetchRelationTelentList`,
    payload,
  };
}
