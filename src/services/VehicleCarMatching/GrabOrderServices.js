import { stringify } from 'qs';
import request from '../../utils/request';
import func from '../../utils/Func';

/* 抢单列表 */
export async function list(params) {
  return request(`/api/mer-vcm/grabSourceGoods/page?${stringify(params)}`);
}
export async function canDo(params){
  return request(`/api/mer-vcm/blacklist/canDo?${stringify(params)}`);
}
/* 抢单列表详情 */
export async function detail(params) {
  return request(`/api/mer-vcm/grabSourceGoods/detail?${stringify(params)}`);
}
/* 抢单记录列表 */
export async function recordlist(params) {
  return request(`/api/mer-vcm/grabOrderRecord/page?${stringify(params)}`);
}
/* 抢单列表详情 */
export async function recorddetail(params) {
  return request(`/api/mer-vcm/grabOrderRecord/detail?${stringify(params)}`);
}
/* 验证车辆运单 */
export async function verifyDriver(params) {
  return request(`/freight/mer-vcm/verify/verifyVehicle?${stringify(params)}`,
    {
      method: 'POST',
      body: func.toFormData(params) ,
    });
}
/* 司机抢单 */
export async function grabasingle(params) {
  return request('/api/mer-vcm/grabOrderRecord/grabOrderByDriver', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function selectVehicle(params) {
  return request(`/api/mer-vcm/grabOrderRecord/selectVehicle?${stringify(params)}`);
}
// 是否提示开启gps
export async function openGps(params) {
  return request(`/freight/mer-vcm/grabSourceGoods/openGps`);
}
