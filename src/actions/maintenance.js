import { USER_NAMESPACE } from './user';

export const MAINTENANCE = 'maintenance';

/**
 * @author 马静
 * @date 2021/10/12
 * @Description: 契约锁接口
 */

/* 企业认证状态 */
export function MAINTENACE_STATE_COMPANY(payload) {
  return {
    type: `${MAINTENANCE}/fetchCompany`,
    payload,
  };
}

// /* 企业认证链接 */
// export function MAINTENACE_LINK_COMPANYH5(payload) {
//   return {
//     type: `${MAINTENANCE}/fetchCompanyH5page`,
//     payload,
//   };
// }

/* 个人认证状态 */
export function MAINTENACE_STATE_PERSONAL(payload) {
  return {
    type: `${MAINTENANCE}/fetchPersonal`,
    payload,
  };
}

// /* 个人认证链接 */
// export function MAINTENACE_LINK_PERSONALURL(payload) {
//   return {
//     type: `${MAINTENANCE}/fetchPersonalUrl`,
//     payload,
//   };
// }

/* 个人认证 */
export function MAINTENACE_SUBMIT_PERSONAL(payload) {
  return {
    type: `${MAINTENANCE}/fetchAddAuthApply`,
    payload,
  };
}
/* 个人认证修改 */
export function MAINTENACE_SUBMIT_UPDATE(payload) {
  return {
    type: `${MAINTENANCE}/fetchUpdateCompanyUser`,
    payload,
  };
}
/* 个人认证详情 */
 export function MAINTENACE_QUERY_USER_AUTHDETAIL(payload) {
  return {
    type: `${MAINTENANCE}/fetchQueryUserAuthDetail`,
    payload,
  };
}/* 企业认证详情 */
export function MAINTENACE_QUERY_COMPANY_AUTHDETAIL(payload) {
  return {
    type: `${MAINTENANCE}/fetchQueryCompanyAuthDetail`,
    payload,
  };
}

/* 绑定企业 */
export function MAINTENACE_BIND_COMPANY(payload) {
  return {
    type: `${MAINTENANCE}/fetchBindCompany`,
    payload,
  };
}

/* 绑定企业 */
export function MAINTENACE_SUBMIT_COMPANYAUTH(payload) {
  return {
    type: `${MAINTENANCE}/fetchSubmitCompanyAuth`,
    payload,
  };
}

/**
 * @author 马静
 * @date 2021/10/20
 * @Description: 开户信息
 */

/* 开户新增 */
export function MAINTENACE_ACCOUNT_SAVE(payload) {
  return {
    type: `${MAINTENANCE}/fetchAccountSave`,
    payload,
  };
}/* 开户修改 */
export function MAINTENACE_ACCOUNT_UPDATE(payload) {
  return {
    type: `${MAINTENANCE}/fetchAccountUpdate`,
    payload,
  };
}/* 开户详情 */
export function MAINTENACE_ACCOUNT_DETAIL(payload) {
  return {
    type: `${MAINTENANCE}/fetchAccountDetail`,
    payload,
  };
}
