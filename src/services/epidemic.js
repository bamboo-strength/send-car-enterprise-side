import request from '@/utils/request';
import { stringify } from 'qs';
import func from '../utils/Func';


// 查询排队相关配置
export async function getQueueDictByKey(params) {
  return request(`/api/mer-queue/queueDict/getQueueDict?${stringify(params)}`);
}

export async function countAmount(params) {
  return request(`/api/mer-queue/paylog/countAmount?${stringify(params)}`);
}
// 账单列表
export async function page(params) {
  return request(`/api/mer-queue/paylog/page?${stringify(params)}`);
}
// 账单详情
export async function pageDetail(params) {
  return request(`/api/mer-queue/paylog/detail?${stringify(params)}`);
}

// ******************    排队相关 ********************************

// 正式排队
export async function joinQueue(params) {
   return request(`/api/mer-queue/reservationqueue/reservationConverToFormal`,{
     method: 'POST',
     body: params,
   });
}

// 取消排队
export async function cancelQueue(params) {
  return request(`/api/mer-queue/reservationqueue/cancelQuenue`,{
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 开通延时服务
export async function delayedservice(params) {
  return request(`/api/mer-queue/dalaypass/open`,{
    method: 'POST',
    body: params,
  });
}

// 获取延时 排队相关信息
export async function delayedQueueInfo(params) {
  return request(`/api/mer-queue/reservationqueue/delayInfo?${stringify(params)}`);
}


// 查询排队记录
export async function queueInfo(params) {
  return request(`/api/mer-queue/reservationqueue/queueInfo?${stringify(params)}`);
}

// 根据厂区id获取厂区信息
export async function getByDeptId(params) {
  return request(`/api/mer-queue/geography/getByDeptId`,{
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 根据厂区id获取厂区下排队情况
export async function deptVarietyQueuingQuery(params) {
  return request(`/api/mer-queue/reservationqueue/deptVarietyQueuingQuery?${stringify(params)}`);
}


// 防疫登记申报
export async function antiepidemicregisterSave(params) {
   return request(`/api/mer-queue/antiepidemicregister/save`,{
     method: 'POST',
     body: params,
   });
}

// 防疫登记二次申报
export async function againAntiepidemicSubmit(params) {
  return request(`/api/mer-queue/againAntiepidemicAudit/submit`,{
    method: 'POST',
    body: params,
  });
}


// 防疫登记修改
export async function antiepidemicqueueUpdate(params) {
  return request(`/api/mer-queue/antiepidemicqueue/update`,{
    method: 'POST',
    body: params,
  });
}
// 防疫登记查询
export async function antiepidemicregisterDetail(params) {
  return request(`/api/mer-queue/antiepidemicregister/detail?${stringify(params)}`);
}
// 新增预约排队
export async function reservationqueueSave(params) {
  return request(`/api/mer-queue/reservationqueue/save`,{
    method: 'POST',
    body: params,
  });
}

// 预约排队记录表
export async function reservationqueueQueueInfo(params) {
  return request(`/api/mer-queue/reservationqueue/queueInfo?${stringify(params)}`);
}

// 预约排队列表
export async function reservationqueueList(params) {
  return request(`/api/mer-queue/reservationqueue/page?${stringify(params)}`);
}

// 防疫记录
export async function pageImmunization(params) {
  return request(`/api/mer-queue/reservationqueue/pageImmunization?${stringify(params)}`);
}

// 支付列表
export async function paymentList(params) {
  return request(`/api/mer-queue/paylog/page?${stringify(params)}`);
}

// 退款列表
export async function refundRecord(params) {
  return request(`/api/mer-queue/refundlog/page?${stringify(params)}`);
}

// 支付详情
export async function paymentdetail(params) {
  return request(`/api/mer-queue/paylog/detail?${stringify(params)}`);
}

// 退款详情
export async function refunddetail(params) {
  return request(`/api/mer-queue/refundlog/detail?${stringify(params)}`);
}

// 防疫记录详情
export async function reservationqueueDetail(params) {
  return request(`/api/mer-queue/reservationqueue/detail?${stringify(params)}`);
}

// 防疫记录详情 查询最新一条
export async function antiepidemicregisterCurrent(params) {
  if(params.ifSecond){ // 防疫二次申报
    delete params.ifSecond
    return request(`/api/mer-queue/againAntiepidemicAudit/detail?${stringify(params)}`);
  }
  delete params.reservationQueueId
  return request(`/api/mer-queue/antiepidemicregister/detail?${stringify(params)}`);
}

// 通行码接口
export async function detailForCalledOne(params) {
  return request(`/api/mer-queue/reservationqueue/detailForCalledOne?${stringify(params)}`);
}

// 获取厂区收费配置情况
export async function getPayConfig(params) {
  return request(`/api/mer-queue/geography/getPayConfig?${stringify(params)}`);
}
// 风险区列表
export async function riskList(params) {
  return request(`/api/mer-queue/risk/list?${stringify(params)}`);
}
// 新增风险地
export async function riskAdd(params) {
  return request(`/api/mer-queue/risk/save`,{
    method: 'POST',
    body: params,
  });
}
// 风险区详情
export async function riskDetail(params) {
  return request(`/api/mer-queue/risk/detail?${stringify(params)}`);
}

// 风险区修改
export async function riskUpdate(params) {
  return request(`/api/mer-queue/risk/update`,{
    method: 'POST',
    body: params,
  });
}
// 判断是否集团用户
export async function groupDept(params) {
  return request(`/api/mer-queue/reservationqueue/getIsGroupReturnDeptId?${stringify(params)}`);
}
