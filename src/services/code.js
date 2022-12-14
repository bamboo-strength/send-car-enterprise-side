import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

// =====================ไปฃ็ ็ๆ===========================

export async function list(params) {
  return request(`/api/shipper-develop/code/list?${stringify(params)}`);
}

export async function remove(params) {
  return request('/api/shipper-develop/code/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submit(params) {
  return request('/api/shipper-develop/code/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/shipper-develop/code/detail?${stringify(params)}`);
}

export async function genCodes(params) {
  return request('/api/shipper-develop/code/gen-code', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
