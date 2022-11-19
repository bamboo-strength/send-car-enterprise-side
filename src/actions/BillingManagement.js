export const DETAILMANAGEMENT = 'billingmanagement'

export function DETAILMANAGEMENT_DETAIL(id) {
  return {
    type:`${DETAILMANAGEMENT}/fetchDetail`,
    payload: { id },
  }
}
