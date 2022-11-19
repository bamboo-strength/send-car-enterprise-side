export const LISTQUERY_NAMESPACE = 'listQuery';

export function LISTQUERY_LIST(payload) {
  return {
    type: `${LISTQUERY_NAMESPACE}/fetchList`,
    payload,
  };
}

export function LISTQUERY_LISTWITHOUTPAGE(payload) {
  return {
    type: `${LISTQUERY_NAMESPACE}/fetchListWithoutPage`,
    payload,
  };
}

export function LISTQUERY_INIT(payload) {
  return {
    type: `${LISTQUERY_NAMESPACE}/fetchInit`,
    payload,
  };
}


