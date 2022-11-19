import { stringify } from 'qs';
import request from '../utils/request';


export async function list(params) {
  return request(`/api/mer-dispatch/materia/page?${stringify(params)}`);
}

export async function detail(params) {
  return request(`/api/mer-dispatch/materia/detail?${stringify(params)}`);
}

