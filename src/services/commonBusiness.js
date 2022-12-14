import { stringify } from 'qs';
import request from '../utils/request';
import {getTenantId} from '../pages/Merchants/commontable'
import func from '../utils/Func';

export async function list(params) {
  return request('/api/mer-tableextend/commonBusiness/page', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}

export async function submit(params) {
  return request('/api/mer-tableextend/commonBusiness/submit', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}

export async function detail(params) {
  console.log('params======>', params);
  const resUrl = params?.diyUrl || 'mer-tableextend/commonBusiness/view'
  return request(`/api/${resUrl}`, {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}

export async function listArea(params) {
  return request('/api/mer-tableextend/commonBusiness/listArea', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}

export async function saveDispatch(params) {
  return request('/api/mer-dispatch/dispatchbill/save', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}



export async function surplus(params) {
  return request(`/api/mer-ningmei/reservation/detail?${stringify(params)}`);
}



export async function queryVehicle(params) {
  return request(`/api/mer-driver-vehicle/vehicleInformationMaintenance/getVehicleByUserId?${stringify(params)}`);
}




export async function queryOrderDate(params) {
  return request('/api/mer-ningmei/reservation/appointmentDate', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}


export async function getVerifyTime(params) {
  return request('/api/mer-basicdata/redis/setcache', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}


export async function getDispatchPlan(params) {
  return request(`/api/mer-ningmei/nmDispatchPlan/getListSub?${stringify(params)}`);
}


export async function getDispatchDetail(params) {
  return request(`/api/mer-ningmei/nmDispatchPlan/getSub?${stringify(params)}`);
}
//  ????????????
export async function queryVehicleList(params) {
  return request(`/api/mer-driver-vehicle/vehicleInformationMaintenance/vehiclePage?${stringify(params)}`);
}

// ????????????
export async function getDriverList(params) {
  return request(`/api/mer-driver-vehicle/driver/page?${stringify(params)}`);
}

//  ??????????????????
export async function submitVehicle(params) {
  return request('/api/mer-driver-vehicle/vehicleInformationMaintenance/vehicleSubmit', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}

//  ??????????????????
export async function queryVehicleDetail(params) {
  return request(`/api/mer-driver-vehicle/vehicleInformationMaintenance/detail?${stringify(params)}`);
}

//  ????????????
export async function remove(params) {
  return request('/api/mer-driver-vehicle/vehicleInformationMaintenance/vehicleRemove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}

//  ????????????
export async function auditData(params) {
  return request('/api/mer-driver-vehicle/vehicleInformationMaintenance/autiditVehicle', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}
//  ????????????????????????-??????
export async function getUserRalation(params) {
  return request(`/api/mer-user/client/userRelation/page?${stringify(params)}`);
}
//  ????????????????????????-??????
export async function getUserRalationDetail(params) {
  return request(`/api/mer-user/client/userRelation/detail?${stringify(params)}`);
}
//  ??????????????????
export async function auditUserRalation(params) {
  return request('/api/mer-user/client/userRelation/autiditUserRelation', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}

// ??????????????????
export async function payPage(params) {
  return request('/api/mer-shop/shoppaymentgoods/page', {
    method: 'POST',
    body: params,
  });
}

// ???????????????????????????
export async function contractPay(params) {
  return request('/api/mer-shop/shoppaymentgoods/contractPayment', {
    method: 'POST',
    body: params,
  });
}
// ??????????????????
  export async function queryDriverDetail(params) {
  return request(`api/mer-driver-vehicle/driver/detail?${stringify(params)}`);
}
// ????????????
export async function auditDriver(params) {
  return request('/api/mer-driver-vehicle/driver/manuallyAuditDriver', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// ???????????????????????????
export async function getPrice(params) {
  return request('/api/mer-shop/shoppaymentgoods/getPriceAmmout', {
    method: 'POST',
    body: params,
  });
}


