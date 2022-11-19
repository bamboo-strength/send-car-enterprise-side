import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import { getTenantId } from '../pages/Merchants/commontable';


export async function list(params) {
  return request(`/api/mer-dispatch/dispatchbill/page?${stringify(params)}`);
}
export async function submit(params) {
  return request('/api/mer-dispatch/dispatchbill/save', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}
export async function update(params) {
  return request('/api/mer-dispatch/dispatchbill/update', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}
export async function remove(params) {
  return request('/api/mer-dispatch/dispatchbill/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('派车单'),
      functionCode:encodeURI('派车单删除')
    },
    body: func.toFormData(params),
  });
}
export async function detail(params) {
  return request(`/api/mer-dispatch/dispatchbill/detail?${stringify(params)}`);
}
export async function toaudit(params) {
  return request('/api/mer-dispatch/dispatchbill/submitAudit', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('派车单'),
      functionCode:encodeURI('派车单提交审核')
    },
    body: func.toFormData(params),
  });
}

export async function freeze(params) {
  return request('/api/mer-dispatch/dispatchbill/freeze', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('派车单'),
      functionCode:encodeURI('派车单冻结')
    },
    body: func.toFormData(params),
  });
}
// 通过驳回
export async function updateAuditflag(params) {
  return request('/api/mer-dispatch/dispatchbill/updateAuditflag', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}

// 司机端 派车单
export async function pageForDriver(params) {
  return request(`/api/mer-dispatch/truckCargoMatch/pageForDriver?${stringify(params)}`);
}

// 司机端 派车单 在途汇报
export async function reportInTransit(params,tenantId) {
  return request('/api/mer-dispatch/truckCargoMatch/reportInTransit', {
    method: 'POST',
    body: func.toFormData(params),
    headers: {
      'Blade-DesignatedTenant': tenantId,
    },
  });
}
// 司机端 抢单
export async function orderGrabbing(params,tenantId) {
  return request('/api/mer-dispatch/truckCargoMatch/orderGrabbing', {
    method: 'POST',
    body: params,
    headers: {
      'Blade-DesignatedTenant': tenantId,
    },
  });
}

// 司机端 取消抢单
export async function cancelOrder(params,tenantId) {
  return request('/api/mer-dispatch/truckCargoMatch/cancelOrder', {
    method: 'POST',
    body: func.toFormData(params),
    headers: {
      'Blade-DesignatedTenant': tenantId,
    },
  });
}
// 司机端详情
export async function detailForDriver(params) {
  return request(`/api/mer-dispatch/dispatchbill/detailForDriver?${stringify(params)}`);
}


// 潍焦派车单详情
export async function weiJiaodetail(params) {
  return request(`/api/mer-dispatch/dispatchbill/detail?${stringify(params)}`);
}

/*  潍焦查询派车单 */
export async function queryList(params) {
  return request(`/api/mer-dispatch/dispatchbill/page?${stringify(params)}`);
}
