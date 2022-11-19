export const LOCUS_NAMESPACE = 'locus';

export function LOCUS_LIST (payload) {
  return {
    type: `${LOCUS_NAMESPACE}/fetchList`,
    payload,
  };
}
