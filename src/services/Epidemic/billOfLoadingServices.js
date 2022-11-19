import { stringify } from 'qs';
import request from '../../utils/request';
import func from '../../utils/Func';

// 提煤单查询
export async function list(params) {
  return request(`/api/mer-queue/queueDelivery/selectPage?${stringify(params)}`)
}

// 新增 修改
export async function save(params) {
  return request(`/api/mer-queue/queueDelivery/save`,{
    method: 'POST',
    body: params,
  });
}

// 详情
export async function view(params) {
  return request(`/api/mer-queue/queueDelivery/detail?${stringify(params)}`);
}

// 审核
export async function examine(params) {
  return request(`/api/mer-queue/queueDelivery/examine`,{
    method: 'POST',
    body: params,
  });
}

// 作废
export async function cancel(params) {
  return request(`/api/mer-queue/queueDelivery/cancel`,{
    method: 'POST',
    body: params,
  });
}

// 删除
export async function remove(params) {
  return request(`/api/mer-queue/queueDelivery/remove`,{
    method: 'POST',
    body: params,
  });
}

// 司机领取提货单列表
export async function driverDrawBillList(params) {
  return request(`/api/mer-queue/queueDeliverySub/selectPage?${stringify(params)}`)
}

// 客户领取提货单列表
export async function customerDrawBill(params) {
  return request(`/api/mer-queue/queueDelivery/receive?${stringify(params)}`);
}

// 客户提货单查看详情列表
export async function byDeliveryId(params) {
  return request(`/api/mer-queue/queueDeliverySub/selectPage?${stringify(params)}`);
}

// 客户回收
export async function recovery(params) {
  return request(`/api/mer-queue/queueDeliverySub/recovery?${stringify(params)}`);
}

// 客户点击完成
export async function billFinish(params) {
  return request(`/api/mer-queue/queueDeliverySub/updateFinish?${stringify(params)}`);
}

// 司机提货单 修改车号
export async function changeVehicle (params) {
  return request(`/api/mer-queue/queueDeliverySub/updateDelivery`,{
    method: 'POST',
    body: params,
  });
}

// 提货单子表详情
export async function queueDeliverySubDetail(params) {
  return request(`/api/mer-queue/queueDeliverySub/detail?${stringify(params)}`);
}
// ************* 提货单二次分配接口 **************8
// 拆分操作
export async function split (params) {
  return request(`/api/mer-queue/queueDeliveryDistribution/split`,{
    method: 'POST',
    body: params,
  });
}
// 拆分记录
export async function billDistributionList(params) {
  return request(`/api/mer-queue/queueDeliveryDistribution/pageList?${stringify(params)}`);
}
// 拆分记录修改
export async function billDistributionUpdate (params) {
  return request(`/api/mer-queue/queueDeliveryDistribution/update`,{
    method: 'POST',
    body: params,
  });
}
// 判断提货单是否拆分过
export async function isSplit (params) {
  return request(`/api/mer-queue/queueDeliveryDistribution/isSplit?${stringify(params)}`);
}
