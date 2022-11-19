
import { stringify } from 'qs';
import request from '../utils/request';
import func from '@/utils/Func';

export async function detail(params) {
  return request(`/api/base-log/log/detail?${stringify(params)}`);
}
export async function list(params) {
  return request(`api/base-log/log/list?${stringify(params)}`);
}
export async function update(params) {
  return request('/api/base-log/log/update', {
    method: 'POST',
    body: params,
  });
}
export async function remove(params) {
  return request('/api/base-log/log/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
