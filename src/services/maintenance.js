/* 在营厂区分页列表 */
import request from '@/utils/request';
import { stringify } from 'qs';
import func from '@/utils/Func';

/**
 * @author 马静
 * @date 2021/10/12
 * @Description: 契约锁接口
 */

/* 企业认证状态 */
export async function companyResult(params) {
  return request(`/api/mer-shop/contractLock/auth/company/result?${stringify(params)}`);
}

/* 企业认证链接 */
export async function companyh5page(params) {
  return request(`/api/mer-shop/contractLock/auth/company/h5page?${stringify(params)}`);
}


/* 个人认证状态 */
export async function personalResult(params) {
  return request(`/api/mer-shop/contractLock/auth/personal/result?${stringify(params)}`);
}

/* 个人认证链接 */
export async function personalUrl(params) {
  return request(`/api/mer-shop/contractLock/auth/personal/url?${stringify(params)}`);
}

/* 个人认证 */
export async function addAuthApply(params) {
  return request(`/api/mer-shop/contractLock/employee/addAuthApply`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 更新企业员工信息 */
export async function updateCompanyUser (params) {
  return request(`/api/mer-shop/contractLock/employee/updateCompanyUser?${stringify(params)}`, );
}
/* 移除企业人员 */
export async function remove(params) {
  return request(`/api/mer-shop/contractLock/employee/removeCompanyUser?${stringify(params)}` );
}

/* 个人认证详情 */
export async function queryUserAuthDetail(params) {
  return request(`/api/mer-shop/contractLock/employee/queryUserAuthDetail?${stringify(params)}`);
}

/* 企业认证详情 */
export async function queryCompanyAuthDetail(params) {
  return request(`/api/mer-shop/contractLock/company/queryCompanyAuthDetail?${stringify(params)}`);
}


/* 绑定企业 */
export async function bindCompany(params) {
  return request(`/api/mer-shop/contractLock/employee/bindCompany`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 企业认证 */
export async function submitCompanyAuth(params) {
  return request(`/api/mer-shop/contractLock/company/submitCompanyAuth`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/**
 * @author 马静
 * @date 2021/10/20
 * @Description: 企业开户信息
 */

/* 开户信息添加 */
export async function accountSave(params) {
  return request(`/api/mer-shop/contractLock/account/save`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 开户信息添加 */
export async function accountUpdate(params) {
  return request(`/api/mer-shop/contractLock/account/update`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 开户信息详情 */
export async function accountDetail(params) {
  return request(`/api/mer-shop/contractLock/account/queryDetailByUserId?${stringify(params)}`);
}
// 图片上传
export async function photoUpload(params) {
  return request(`/api/mer-shop/upload/single/image`,{
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 图片上传
export async function uploadCertificates(params) {
  return request(`/api/mer-driver-vehicle/certificates/uploadCertificates`,{
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 获取企业认证链接 */
export async function getPageWithLicenseUrl(params) {
  return request(`/api/mer-shop/contractLock/company/getPageWithLicenseUrl?${stringify(params)}`);
}
/* 获取个人认证链接 */
export async function employeepersonalUrl(params) {
  return request(`/api/mer-shop/contractLock/employee/personal/url?${stringify(params)}`);
}
// // 图片上传
// export async function photoUpload(params) {
//   return request(`/api/mer-shop/upload/single/image`,{
//     method: 'POST',
//     body: func.toFormData(params),
//   });
// }

// /* 获取企业认证链接 */
// export async function getPageWithLicenseUrl(params) {
//   return request(`/api/mer-online-contract/contractLock/company/getPageWithLicenseUrl?${stringify(params)}`);
// }
// /* 获取个人认证链接 */
// export async function employeepersonalUrl(params) {
//   return request(`/api/mer-online-contract/contractLock/employee/personal/url?${stringify(params)}`);
// }
