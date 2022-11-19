export const ALLTHEBILL = 'allthebill'
export function ALLTHEBILL_LIST(payload) {
  return {
    type:`${ALLTHEBILL}/fetchList`,
    payload,
  }
}

