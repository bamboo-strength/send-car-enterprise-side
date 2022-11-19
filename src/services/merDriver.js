import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import { getTenantId } from '../pages/Merchants/commontable';


export async function list(params) {
  return request(`/api/mer-driver-vehicle/driver/page?${stringify(params)}`);
}

export async function listWithoutPage(params) {
  return request(`/api/mer-driver-vehicle/driver/list?${stringify(params)}`);
}

export async function submit(params) {
  return request('/api/mer-driver-vehicle/driver/submit', {
    method: 'POST',
    body: params,
  });
}
export async function update(params) {
  return request('/api/mer-driver-vehicle/driver/submit', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}
export async function remove(params) {
  return request('/api/mer-driver-vehicle/driver/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}

export async function detailByVehicleId(params) {
  return request(`/api/mer-driver-vehicle/vehicleCertification/detail?${stringify(params)}`);
}

export async function detail(params) {
  return request(`/api/mer-driver-vehicle/driver/detailByUserId?${stringify(params)}`);
}

export async function shipperDetail(params) {
  return request(`/api/shipper-user/detail?${stringify(params)}`);
}
// 查询未读消息
export async function findNoList(params) {
  return request(`/api/mer-message/message/findNoList?${stringify(params)}`);
}
// 设置消息已读
export async function readMassage(params) {
  return request('/api/mer-message/message/readMassage?', {
    method: 'POST',
    body: params,
  });
}
// 添加司机
export async function toInvite(params) {
  return request('/api/mer-driver-vehicle/driverinvitation/submit', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
// 我邀请的司机 不分页
export async function initiateInvitationList(params) {
  return request(`/api/mer-driver-vehicle/driverinvitation/initiateInvitationList?${stringify(params)}`);
}

// 邀请我的 不分页
export async function receiveInvitationList(params) {
  return request(`/api/mer-driver-vehicle/driverinvitation/receiveInvitationList?${stringify(params)}`);
}

// 查询可邀请司机 不分页
export async function listCanInvite(params) {
  return request(`/api//mer-driver-vehicle/driver/listCanInvite?${stringify(params)}`);
}

// 朋友邀请 拒绝/同意
export async function approval(params) {
  return request('/api/mer-driver-vehicle/driverinvitation/approval', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
// 解除司机邀请
export async function removeInvitation(params) {
  return request('/api/mer-driver-vehicle/driverinvitation/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 查询可分配的司机
export async function assignableDriversList(params) {
  return request(`/api/mer-driver-vehicle/driver/assignableDriversList?${stringify(params)}`);
}

// 车辆分配司机
export async function assignDriver(params) {
  return request('/api/mer-driver-vehicle/vehicleInformationMaintenance/assignDriver', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
// 常跑路线 不分页查询
export async function regularrouteList(params) {
  return request(`/api/mer-driver-vehicle/regularroute/list?${stringify(params)}`);
}

// 常跑路线 添加修改
export async function addOrUpdateLine(params) {
  return request('/api/mer-driver-vehicle/regularroute/submit', {
    method: 'POST',
    body: params,
  });
}

// 货主收藏 分页查询
export async function consignorcollection(params) {
  return request(`/api/mer-driver-vehicle/consignorcollection/page?${stringify(params)}`);
}
// 货主收藏 收藏
export async function collection(params) {
  return request('/api/mer-driver-vehicle/consignorcollection/submit', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 货主收藏 取消收藏
export async function cancelcollection(params) {
  return request('/api/mer-driver-vehicle/consignorcollection/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/*  //  神木富油查询
export async function smfylist(params) {
  return request(`/api/mer-driver-vehicle/driver/page?${stringify(params)}`);
} */


export async function detailDriver(params) {
  return request(`/api/mer-driver-vehicle/driver/detail?${stringify(params)}`);
}
