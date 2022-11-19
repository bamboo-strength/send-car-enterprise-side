import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import {getTenantId} from '@/pages/Merchants/commontable'

export async function list(params) {
  return request(`/api/mer-basicdata/packages/list?${stringify(params)}`);
}
export async function submit(params) {
  return request('/api/mer-basicdata/packages/submit', {
    method: 'POST',
    body: params,
  });
}
export async function detail(params) {
  return request(`/api/mer-basicdata/packages/detail?${stringify(params)}`);
}
export async function remove(params) {
  return request('/api/mer-basicdata/packages/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('包装物管理'),
      functionCode:encodeURI('包装物管理删除')
    },
    body: func.toFormData(params),
  });
}
