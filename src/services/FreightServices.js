import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';

// 司机端运单列表
export async function list(params) {
  return request(`/freight/fre-freight/waybill/page?${stringify(params)}`)
}
// 详情
export async function detail(params) {
  return request(`/freight/fre-freight/waybill/detail?${stringify(params)}`);
}
// 接单
export async function orderTake(params) {
  return request('/freight/fre-freight/waybill/orderTake', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
//接单权限验证
export async function orderTakeVerify(params) {
  return request(`/freight/fre-freight/waybill/orderTakeVerify`, {
    method: 'POST',
    body: func.toFormData(params),
  })
}
// 取消
export async function cancel(params) {
  return request('/freight/fre-freight/waybill/cancel', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 装货确认
export async function submitLoad(params) {
  return request('/freight/fre-freight/waybill/submitLoad', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
// 卸货确认
export async function submitSign(params) {
  return request('/freight/fre-freight/waybill/submitSign', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
// 评价
export async function evaluation(params) {
  return request('/freight/fre-freight/evaluation/submit', {
    method: 'POST',
    body: params,
  });
}
// 根据运单id获取信息
export async function getShippingNoteInfos(params) {
  return request(`/api/fre-freight/app/interaction/getShippingNoteInfos?${stringify(params)}`);
}
// 存储错误信息
export async function androidNotify(params) {
  return request(`/api/fre-freight/app/interaction/androidNotify?${stringify(params)}`);
}
// 存储交通部返回信息2.0
export async function saveNotify(params){
  return request(`/api/fre-freight/waybillsdkinvocation/save`, {
    method: 'POST',
    body: params,
  });
}
