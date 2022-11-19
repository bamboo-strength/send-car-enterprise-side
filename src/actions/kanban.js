export const KANBAN_NAMESPACE = 'kanban';

export function KANBAN_LIST(payload) {
  return {
    type: `${KANBAN_NAMESPACE}/fetchList`,
    payload,
  };
}




