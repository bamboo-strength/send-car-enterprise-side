export const DEFAULTSHIPPERS_NAMESPACE = 'defaultShippers';

export function DEFAULTSHIPPERS_LIST(payload) {
  return {
    type: `${DEFAULTSHIPPERS_NAMESPACE}/fetchList`,
    payload,
  };
}

