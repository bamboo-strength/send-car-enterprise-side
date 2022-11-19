import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import { getTenantId } from '../pages/Merchants/commontable';

// =====================菜单===========================

export async function dynamicTopMenus(params) {
  return request(`/api/shipper-system/menu/top-menu?${stringify(params)}`);
}

export async function dynamicRoutes(params) {
  return request(`/api/shipper-system/menu/routes?${stringify(params)}`);
}

export async function dynamicButtons() {
  return request('/api/shipper-system/menu/buttons');
}

export async function list(params) {
  return request(`/api/shipper-system/menu/list?${stringify(params)}`);
}

export async function parentList(params) {
  return request(`/api/shipper-system/menu/menu-list?${stringify(params)}`);
}

export async function tree(params) {
  return request(`/api/shipper-system/menu/tree?${stringify(params)}`);
}

export async function grantTree(params) {
  return request(`/api/shipper-system/menu/grant-tree?${stringify(params)}`);
}

export async function topMenuTree(params) {
  return request(`/api/shipper-system/menu/grant-top-tree?${stringify(params)}`);
}

export async function roleTreeKeys(params) {
  return request(`/api/shipper-system/menu/role-tree-keys?${stringify(params)}`);
}

export async function topMenuTreeKeys(params) {
  return request(`/api/shipper-system/menu/top-tree-keys?${stringify(params)}`);
}

export async function topMenuGrant(params) {
  return request('/api/shipper-system/topmenu/grant', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function remove(params) {
  return request('/api/shipper-system/menu/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submit(params) {
  return request('/api/shipper-system/menu/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/shipper-system/menu/detail?${stringify(params)}`);
}

export async function routesAuthority() {
  return request('/api/shipper-system/menu/auth-routes');
}

export async function dataScopeList(params) {
  return request(`/api/shipper-system/data-scope/list?${stringify(params)}`);
}

export async function removeDataScope(params) {
  return request('/api/shipper-system/data-scope/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submitDataScope(params) {
  return request('/api/shipper-system/data-scope/submit', {
    method: 'POST',
    body: params,
  });
}

export async function scopeDataDetail(params) {
  return request(`/api/shipper-system/data-scope/detail?${stringify(params)}`);
}

export async function apiScopeList(params) {
  return request(`/api/shipper-system/api-scope/list?${stringify(params)}`);
}

export async function removeApiScope(params) {
  return request('/api/shipper-system/api-scope/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submitApiScope(params) {
  return request('/api/shipper-system/api-scope/submit', {
    method: 'POST',

    body: params,
  });
}

export async function scopeApiDetail(params) {
  return request(`/api/shipper-system/api-scope/detail?${stringify(params)}`);
}

// 获取首页图片
export async function gethomePageImg(params) {
  return request(`/api/mer-basicdata/homepage/list?${stringify(params)}`);
}

// 获取首页通知公告
export async function getNotice(params) {
  return request(`/api/shipper-desk/notice/list?${stringify(params)}`);
}

export async function getMobileQuery(params) {
  return request(`/api/mer-basicdata/business/mobileQuery?${stringify(params)}`);
}
export async function getGeneral(path,params) {
  return request(path, {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}
