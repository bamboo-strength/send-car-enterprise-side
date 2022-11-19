import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';


export async function list(params) {
  return request(`/api/mer-basicdata/spec/list?${stringify(params)}`);
}
export async function submit(params) {
  return request('/api/mer-basicdata/spec/submit', {
    method: 'POST',
    body: params,
  });
}
export async function detail(params) {
  return request(`/api/mer-basicdata/spec/detail?${stringify(params)}`);
}
export async function remove(params) {
  return request('/api/mer-basicdata/spec/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('规格管理'),
      functionCode:encodeURI('规格管理删除')
    },
    body: func.toFormData(params),
  });
}
