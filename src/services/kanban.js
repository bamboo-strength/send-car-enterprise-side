import request from '../utils/request';


export async function list() {
   return request('/api/mer-tableextend/kanban/queryKanban');
}




