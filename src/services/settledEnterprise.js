import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import {getTenantId} from '@/pages/Merchants/commontable'

export async function list() {
  return request(`/api/shipper-system/client/tenant-list`);
}
export async function submit(params) {
  return request('/api/shipper-tenant-relation/tenant-relation/register-customer', {
    method: 'POST',
    body: params,
  });
}
export async function remove(params) {
  return request('/api/shipper-tenant-relation/customer-relation/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('入驻企业'),
      functionCode:encodeURI('入驻企业删除')
    },
    body: func.toFormData(params),
  });
}
export async function detail(params) {
  return request(`/api/shipper-system/tenantDetail/detail?${stringify(params)}`);
}
