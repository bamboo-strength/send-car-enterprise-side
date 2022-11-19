
export const FEEDBACK_NAMESPACE = 'feedback';


export function FEEDBACK_LIST(payload) {
  return {
    type: `${FEEDBACK_NAMESPACE}/fetchList`,
    payload,
  };
}


export function FEEDBACK_INIT(payload) {
  return {
    type: `${FEEDBACK_NAMESPACE}/fetchInit`,
    payload,
  };
}


export function FEEDBACK_SUBMIT(payload) {
  return {
    type: `${FEEDBACK_NAMESPACE}/submit`,
    payload,
  };
}


