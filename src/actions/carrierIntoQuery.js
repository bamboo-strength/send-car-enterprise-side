
export const CARRIERINTOQUERY_NAMESPACE = 'carrierIntoQuery';

export function CARRIERINTOQUERY_INIT(payload) {
  return {
    type: `${CARRIERINTOQUERY_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function CARRIERINTOQUERY_LIST(payload) {
  return {
    type:  `${CARRIERINTOQUERY_NAMESPACE}/fetchList`,
    payload,
  };
}

export function CARRIERINTOQUERY_TELENTLIST(payload) {
  return {
    type:  `${CARRIERINTOQUERY_NAMESPACE}/fetchTelentList`,
    payload,
  };
}




