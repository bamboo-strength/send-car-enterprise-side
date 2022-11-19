import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

// =====================产品===========================


export async function list(params) {
  return request(`/api/shipper-system/tenantProduct/list?${stringify(params)}`);
}

export async function page(params) {
  return request(`/api/shipper-system/tenantProduct/page?${stringify(params)}`);
}


export async function remove(params) {
  return request('/api/shipper-system/tenantProduct/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submit(params) {
  return request('/api/shipper-system/tenantProduct/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/shipper-system/tenantProduct/detail?${stringify(params)}`);
}
