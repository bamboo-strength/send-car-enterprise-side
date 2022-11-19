import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import {getTenantId} from '@/pages/Merchants/commontable'

export async function list(params) {
  return request(`/api/mer-dispatch/shipbill/page?${stringify(params)}`);
}
export async function detail(params) {
  return request(`/api/mer-dispatch/shipbill/detail?${stringify(params)}`);
}
export async function remove(params) {
  return request('/api/mer-dispatch/shipbill/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('委托单计划查询'),
      functionCode:encodeURI('委托单计划查询删除')
    },
    body: func.toFormData(params),
  });
}
