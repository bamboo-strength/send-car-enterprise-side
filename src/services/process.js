import { stringify } from 'qs';
import request from '../utils/request';

// =====================参数===========================

export async function userList(params) {
  return request(`/api/shipper-user/user-list?${stringify(params)}`);
}

export async function historyFlowList(params) {
  return request(`/api/shipper-flow/process/history-flow-list?${stringify(params)}`);
}

// =====================请假流程===========================

export async function leaveProcess(params) {
  return request('/api/shipper-desk/process/leave/start-process', {
    method: 'POST',
    body: params,
  });
}

export async function leaveDetail(params) {
  return request(`/api/shipper-desk/process/leave/detail?${stringify(params)}`);
}
