import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

export async function list(params) {
  return request(`/api/base-automatic/jgrelation/list?${stringify(params)}`);
}

export async function submit(params) {
  return request('/api/base-automatic/jgrelation/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/base-automatic/jgrelation/detail?${stringify(params)}`);
}

export async function remove(params) {
  return request('/api/base-automatic/jgrelation/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
