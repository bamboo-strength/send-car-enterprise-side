import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
/* 竞价列表 */
export async function list(params) {
  return request(`/api/fre-freight/bidSourceGoods/page?${stringify(params)}`);
}
/* 报价列表详情 */
export async function detail(params) {
  return request(`/api/fre-freight/bidSourceGoods/detail?${stringify(params)}`);
}
/* 司机报价 */
export async function bidding(params) {
  return request('/api/fre-freight/bidPriceRecord/bidPriceByDriver', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 司机取消报价 */
export async function cancelbidding(params) {
  return request('/api/fre-freight/bidPriceRecord/cancel', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 司机删除 */
export async function remove(params) {
  return request('/api/fre-freight/bidSourceGoods/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
