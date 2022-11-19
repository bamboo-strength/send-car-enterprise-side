import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import {getTenantId} from '@/pages/Merchants/commontable'

export async function list(params) {
  return request(`/api/shipper-tenant-relation/customer-relation/list?${stringify(params)}`);
}
export async function detail(params) {
  return request(`/api/shipper-tenant-relation/customer-relation/detail?${stringify(params)}`);
}
// 根据发货方租户号获取企业名称
export async function relationTelentList(params) {
  return request(`/api/shipper-tenant-relation/customer-relation/relationTelentList?${stringify(params)}`);
}

export async function disagree(params) {
  return request('/api/shipper-tenant-relation/customer-relation/audit-customer', {
    method: 'POST',
    body: params,
  });
}

export async function add(params) {
  return request('/api/shipper-tenant-relation/customer-relation/add-customer-relation', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request('/api/shipper-tenant-relation/customer-relation/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('审核客户'),
      functionCode:encodeURI('审核客户删除')
    },
    body: func.toFormData(params),
  });
}
