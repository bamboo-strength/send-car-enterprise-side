import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
/* 详情 */
export async function detail(params) {
  return request(`/api/fre-freight/QRCodeSourceGoods/detail?${stringify(params)}`);
}
/* 立即接单 */
export async function waybillsave(params) {
  return request('/api/fre-freight/waybill/save', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

