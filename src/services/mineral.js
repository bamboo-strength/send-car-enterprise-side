import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import { getTenantId } from '@/services/matrixCommon';


export async function list(params) {
  return request(`/api/mer-basicdata/mines/list?${stringify(params)}`);
}
export async function submit(params) {
  return request('/api/mer-basicdata/mines/submit', {
    method: 'POST',
    body: params,
  });
}
export async function detail(params) {
  return request(`/api/mer-basicdata/mines/detail?${stringify(params)}`);
}
export async function remove(params) {
  return request('/api/mer-basicdata/mines/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('生产矿点管理'),
      functionCode:encodeURI('生产矿点管理删除')
    },
    body: func.toFormData(params),
  });
}
