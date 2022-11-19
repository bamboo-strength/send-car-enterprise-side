import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import {getTenantId} from '@/pages/Merchants/commontable'

export async function list(params) {
  return request(`/api/shipper-tenant-relation/carrier-relation/list?${stringify(params)}`);
}
export async function detail(params) {
  return request(`/api/shipper-tenant-relation/carrier-relation/detail?${stringify(params)}`);
}
// 根据发货方租户号获取企业名称
export async function relationTelentList(params) {
  return request(`/api/shipper-tenant-relation/carrier-relation/relationTelentList?${stringify(params)}`);
}

export async function add(params) {
  return request('/api/shipper-tenant-relation/carrier-relation/add-carrier-relation', {
    method: 'POST',
    body: params,
  });
}

export async function disagree(params) {
  return request('/api/shipper-tenant-relation/carrier-relation/audit-carrier', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request('/api/shipper-tenant-relation/carrier-relation/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('审核承运商'),
      functionCode:encodeURI('审核承运商删除')
    },
    body: func.toFormData(params),
  });
}
