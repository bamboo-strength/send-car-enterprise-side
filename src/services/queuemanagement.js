import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';

export async function list(params) {
  return request(`/api/mer-queue/coal/listNoPageCoal?${stringify(params)}`);
}
export async function reservationqueuepage(params) {
  return request(`/api/mer-queue/reservationqueue/page?${stringify(params)}`);
}
//叫号管理车辆列表查询
export async function callManagePage(params) {
  return request(`/api/mer-queue/reservationqueue/callManagePage?${stringify(params)}`);
}
export async function submit(params) {
  return request('/api/mer-queue/coal/submit', {
    method: 'POST',
    body: params,
  });
}
export async function changeAll(params) {
  return request('/api/mer-queue/coal/updateCoalSwitch', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function callDriver(params) {
  return request('/api/mer-queue/reservationqueue/callDriver', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function detail(params) {
  return request(`?${stringify(params)}`);
}
