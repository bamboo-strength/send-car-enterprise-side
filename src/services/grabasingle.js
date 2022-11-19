import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
/* 抢单列表 */
export async function list(params) {
  return request(`/api/fre-freight/grabSourceGoods/page?${stringify(params)}`);
}
/* 抢单列表详情 */
export async function detail(params) {
  return request(`/api/fre-freight/grabSourceGoods/detail?${stringify(params)}`);
}
/* 抢单记录列表 */
export async function recordlist(params) {
  return request(`/api/fre-freight/grabOrderRecord/page?${stringify(params)}`);
}
/* 抢单列表详情 */
export async function recorddetail(params) {
  return request(`/api/fre-freight/grabOrderRecord/detail?${stringify(params)}`);
}
/* 验证车辆运单 */
export async function verifyDriver(params) {
  return request(`/freight/fre-freight/verify/verifyVehicle?${stringify(params)}`,
    {
      method: 'POST',
      body: func.toFormData(params) ,
    });
}
/* 司机抢单 */
export async function grabasingle(params) {
  return request('/api/fre-freight/grabOrderRecord/grabOrderByDriver', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
