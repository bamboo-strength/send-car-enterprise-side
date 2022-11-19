
export const BUSINESSINTOQUERY_NAMESPACE = 'businessIntoQuery';

export function BUSINESSINTOQUERY_INIT(payload) {
  return {
    type: `${BUSINESSINTOQUERY_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function BUSINESSINTOQUERY_LIST(payload) {
  return {
    type:  `${BUSINESSINTOQUERY_NAMESPACE}/fetchList`,
    payload,
  };
}

export function BUSINESSINTOQUERY_TELENTLIST(payload) {
  return {
    type:  `${BUSINESSINTOQUERY_NAMESPACE}/fetchTelentList`,
    payload,
  };
}




