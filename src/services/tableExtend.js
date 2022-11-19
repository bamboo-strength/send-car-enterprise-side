import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';


export async function list(params) {
  return request(`/api/mer-tableextend/tableExtend/pagelist?${stringify(params)}`);
}
export async function submit(params) {
  return request('/api/mer-tableextend/tableExtend/submit', {
    method: 'POST',
    body: params,
  });
}
export async function remove(params) {
  return request('/api/mer-tableextend/tableExtend/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function detail(params) {
  return request(`/api/mer-tableextend/tableExtend/detail?${stringify(params)}`);
}

export async function  listShowColum(params) {
  return request(`/api/mer-tableextend/tableExtend/queryList?${stringify(params)}`);
}

export async function  addEditShowColum(params) {
  return request(`/api/mer-tableextend/tableExtend/list?${stringify(params)}`);
}
