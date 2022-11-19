import { stringify } from 'qs';
import request from '../../utils/request';
import func from '../../utils/Func';

// 司机端运单列表
export async function list(params) {
  return request(`/api/mer-vcm/waybill/page?${stringify(params)}`)
}
// 详情
export async function detail(params) {
  return request(`/api/mer-vcm/waybill/detail?${stringify(params)}`);
}
// 接单
export async function orderTake(params) {
  return request('/api/mer-vcm/waybill/orderTake', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
// 接单权限验证
export async function orderTakeVerify(params) {
  return request(`/api/mer-vcm/waybill/orderTakeVerify`, {
    method: 'POST',
    body: func.toFormData(params),
  })
}
// 取消
export async function cancel(params) {
  return request('/api/mer-vcm/waybill/cancel', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 装货确认
export async function submitLoad(params) {
  return request('/api/mer-vcm/waybill/submitLoad', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
// 卸货确认
export async function submitSign(params) {
  return request('/api/mer-vcm/waybill/submitSign', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
// 评价
export async function evaluation(params) {
  return request('/api/mer-vcm/evaluation/submit', {
    method: 'POST',
    body: params,
  });
}
// 根据运单id获取信息
export async function getShippingNoteInfos(params) {
  return request(`/api/mer-vcm/app/interaction/getShippingNoteInfos?${stringify(params)}`);
}
// 存储错误信息
export async function androidNotify(params) {
  return request(`/api/mer-vcm/app/interaction/androidNotify?${stringify(params)}`);
}
// 到场签到
export async function arrive(params) {
  return request('/api/mer-vcm/waybill/arrive', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
