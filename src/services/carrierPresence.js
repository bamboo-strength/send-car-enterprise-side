import { stringify } from 'qs';
import request from '../utils/request';

export async function list() {
  return request(`/api/shipper-system/client/tenant-list`);
}
export async function submit(params) {
  return request('/api/shipper-tenant-relation/tenant-relation/register-carrier', {
    method: 'POST',
    body: params,
  });
}
export async function detail(params) {
  return request(`/api/shipper-system/tenantDetail/detail?${stringify(params)}`);
}
