import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/api/shipper-tenant-relation/carrier-relation/carrierList?${stringify(params)}`);
}

export async function tenantList(params) {
  return request(`/api/shipper-tenant-relation/carrier-relation/tenantList?${stringify(params)}`);
}
export async function submit(params) {
  return request('/api/businessIntoQuery/submit', {
    method: 'POST',
    body: params,
  });
}

