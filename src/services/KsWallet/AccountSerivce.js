/**
 * 电商通接口
 */
import { stringify } from 'qs';
import request from '../../utils/request';
import func from '../../utils/Func';

// 查询开户状态
export async function queryOpenStatus(params) {
  return request(`/api/dst-wallet/dstopenaccountapplication/queryOpenStatus?${stringify(params)}`);
}

// 查询个人用户状态
export async function queryPersonOpenStatus(params) {
  return request(`/api/dst-wallet/dstopenaccountapplication/queryPersonOpenStatus?${stringify(params)}`);
}

// 钱包开通
export async function openAccount(params) {
  return request('/api/dst-wallet/dstopenaccountapplication/submit', {
    method: 'POST',
    body: params,
  });
}

// 开户详情
export async function accountDetail(params) {
  return request(`/api/dst-wallet/dstopenaccountapplication/detail?${stringify(params)}`);
}

// 余额查询
export async function queryBalance(params) {
  return request(`/api/dst-wallet/dstopenaccountapplication/queryBalance?${stringify(params)}`);
}

// 账单明细
export async function page(params) {
  return request(`/api/dst-wallet/dstbill/page?${stringify(params)}`);
}

// 个人客户账单明细
export async function personPage(params) {
  return request(`/api/dst-wallet/dstbill/personPage?${stringify(params)}`);
}

// 账单详情
export async function detail(params) {
  return request(`/api/dst-wallet/dstbill/detail?${stringify(params)}`);
}

// 判断是否绑定结算账户
export async function ifBindAccount(params) {
  return request('/api/dst-wallet/dstwithdrawal/applicationWithdrawalStatus', {
    method: 'POST',
    body: params,
  });
}

// 111判断结算账户
export async function ifSettlement(params) {
  return request('/api/dst-wallet/dstwithdrawal/applicationWithdrawalStatus', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 111银行卡列表
export async function cardList(params) {
  return request(`/api/dst-wallet/dstbankcard/list?${stringify(params)}`);
}

// 111点击绑定跳的第三方页面
export async function Unbindpage(params) {
  return request('/api/dst-wallet/dstbankcard/addBankcard', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 提现跳转第三方
export async function kswithdrawal(params) {
  return request('/api/dst-wallet/dstwithdrawal/applicationWithdrawal', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 111点击银行卡解绑的第三方

export async function Unbindcard(params) {
  return request('/api/dst-wallet/dstbankcard/removeBankcard', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
// 1修改支付密码的第三方页面
export async function ChangePassword(params) {
  return request(`/api/dst-wallet/dstopenaccountapplication/modifyPaymentPassword?${stringify(params)}`);
}

// 1钱包账户信息
export async function CardInformation(params) {
  return request(`/api/dst-wallet/dstopenaccountapplication/detail?${stringify(params)}`);
}

// 1钱包账户信息修改手机号的第三方支付
export async function ModifyPhone(params) {
  return request(`/api/dst-wallet/dstopenaccountapplication/modifyPhone?${stringify(params)}`);
}

// 1重置支付密码第三方页面
export async function ResetPassword(params) {
  return request(`/api/dst-wallet/dstopenaccountapplication/resetPaymentPassword?${stringify(params)}`);
}

// 提现
export async function withdrawalDetail(params) {
  return request(`/api/dst-wallet/dstwithdrawal/detail?${stringify(params)}`);
}


/**
 * 查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function list(params) {

  return request(`/api/mer-basicdata/userCarrierRelation/page?${stringify(params)}`);

}

/**
 * 删除
 * @param params
 * @returns {Promise<void>}
 */
export async function remove(params) {
  return request('/api/mer-basicdata/userCarrierRelation/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/**
 * psot 形式提交数据
 * @param params
 * @returns {Promise<void>}
 */
export async function submit(params) {
  const option = {
    method: 'POST',
    body:params
  };
  return request(`/api/mer-basicdata/userCarrierRelation/submit`,option);
 // return request(`/api/base-carrier/carrier/submit`,option);
}

/** 账单表列表
 *  get 形式提交数据
 */
export async function dstbillPage(params) {
  return request(`/api/dst-wallet/dstbill/page?${stringify(params)}`);
}
/** 账单表列表
 *  get 形式提交数据
 */
export async function dstbillPageAll(params) {
  return request(`/api/dst-wallet/dstbill/pageMobile?${stringify(params)}`);
}

export async function dstbillPersonalPageAll(params) {
  return request(`/api/dst-wallet/dstbill/personPageMobile?${stringify(params)}`);
}


export async function billincome(params) {
  return request(`/api/dst-wallet/dstbilldate/page?${stringify(params)}`);
}
export async function personBillincome(params) {
  return request(`/api/dst-wallet/dstbilldate/personPage?${stringify(params)}`);
}


/* 获取客户信息 */
export async function companyUser(params) {
  return request(`/api/mer-shop/contractLock/employee/getCompanyUser?${stringify(params)}`)

}

// 充值
export async function recharge(params) {
  return request('/api/dst-wallet/dstrecharge/recharge', {
    method: 'POST',
    body: params,
  });
}

// 充值
export async function rechargePerson(params) {
  return request('/api/dst-wallet/dstrecharge/personRecharge', {
    method: 'POST',
    body: params,
  });
}

// 申请提现状态
export async function queryApplicationWithdrawal(params) {
  return request('/api/dst-wallet/dstwithdrawal/queryApplicationWithdrawal', {
    method: 'POST',
    body: params,
  });
}

// 申请提现
export async function submitApplicationWithdrawal(params) {
  return request('/api/dst-wallet/dstwithdrawal/submitApplicationWithdrawal', {
    method: 'POST',
    body: params,
  });
}

// 撤销提现
export async function revokeApplication(params) {
  return request('/api/dst-wallet/dstwithdrawal/revokeApplication', {
    method: 'POST',
    body: params,
  });
}

