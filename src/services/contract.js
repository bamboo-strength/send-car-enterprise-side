import request from '@/utils/request';
import func from '@/utils/Func';
import { stringify } from 'qs';

/**
 * @author 马静
 * @date 2021/10/18
 * @Description: 合同信息
 */

/* 创建订单 */
export async function commitContractOrder(params) {
  return request('/api/mer-shop/app/contract/commitContractOrder', {
    method: 'POST',
    body: params,
    // body: func.toFormData(params),
  });
}

/* 创建合同草稿 */
export async function contractManageDraft(params) {
  return request('/api/mer-shop/contractManage/draft', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 创建合同草稿 */
export async function activitycontractManageDraft(params) {
  return request('/api/mer-shop/contractManage/spikeDraft', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* ⽤模板添加合同⽂档 */
export async function documentAddByFile(params) {
  return request('/api/mer-shop/contractManage/initiateContract', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 活动--⽤模板添加合同⽂档 */
export async function activitydocumentAddByFile(params) {
  return request('/api/mer-shop/contractManage/initiateSpikeContract', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 发起合同 */
export async function contractManageSend(params) {
  return request('/api/mer-shop/contractManage/send', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 浏览页面 */
export async function viewurl(params) {
  return request('/api/mer-shop/contractManage/viewurl', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 签署页面 */
export async function pageurl(params) {
  return request('/api/mer-shop/contractManage/pageurl', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 合同列表 */
export async function queryPage(params) {
  return request(`/api/mer-shop/app/contract/queryPage?${stringify(params)}`);
}

/* 合同详情 */
export async function contractManageDetail(params) {
  return request('/api/mer-shop/contractManage/detail', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 撤销合同 */
export async function contractManageInvalid(params) {
  return request('/api/mer-shop/contractManage/invalid', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 结束合同 */
export async function contractManageForceend(params) {
  return request('/api/mer-shop/contractManage/forceend', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 下载合同 */
export async function contractManageDownload(params) {
  return request('/api/mer-shop/contractManage/download', {
    method: 'POST',
    // body: params,
    body: func.toFormData(params),
  });
}
/* 删除合同 */
export async function contractManageDelete(params) {
  return request('/api/mer-shop/app/contract/delete', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 支付记录表
export async function contractPage(params) {
  return request(`/api/mer-shop/shopcontractpayment/page`,{
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 合同预付款 */
export async function paymentSubmit(params) {
  return request('/api/mer-shop/shopcontractpayment/contractPayment', {
    method: 'POST',
    body: params,
  });
}

export async function contractDeatail(params) {
  return request(`/api/mer-shop/shopcontractpayment/detail?${stringify(params)}`);
}

/* 获取价格 */
export async function payprice(params) {
  return request('/api/mer-shop/app/contract/queryPay', {
    method: 'POST',
    body: params,
  });
}


// 申请结算获取pdf
export async function settlementpdf(params) {
  return request('/api/mer-shop/app/settlementContract/lookSettlement', {
    method: 'POST',
    body: params,
  });
}

// 查新结算单数据
export async function querySettlement(params) {
  return request('/api/mer-shop/app/settlementContract/querySettlement', {
    method: 'POST',
    body: params,
  });
}


// 未申请开票
export async function lookInvoice(params) {
  return request('/api/mer-shop/app/settlementContract/lookInvoice', {
    method: 'POST',
    body: params,
  });
}

// 已申请开票
export async function InvoiceRecord(params) {
  return request('/api/mer-shop/app/settlementContract/queryInvoiceRecord', {
    method: 'POST',
    body: params,
  });
}

// 提交开票
export async function applyInvoice(params) {
  return request('/api/mer-shop/app/settlementContract/applyInvoice', {
    method: 'POST',
    body: params,
  });
}

// 提交结算
export async function applySettlement(params) {
  return request('/api/mer-shop/app/settlementContract/applySettlement', {
    method: 'POST',
    body: params,
  });
}

 // 开票记录(已审核)
export async function Invoicelist(params) {
  return request('/api/mer-shop/app/settlementContract/queryInvoiceRecord', {
    method: 'POST',
    body: params,
  });
}

// 开票记录(已驳回)
export async function RejectInvoiceRecord(params) {
  return request('/api/mer-shop/app/settlementContract/queryRejectInvoiceRecord', {
    method: 'POST',
    body: params,
  });
}

// 已结算，开票完成合同列表
export async function queryContract(params) {
  return request('/api/mer-shop/app/settlementContract/queryContract', {
    method: 'POST',
    body: params,
  });
}

// 查看结算单
export async function querySettlementRecord(params) {
  return request('/api/mer-shop/app/settlementContract/querySettlementRecord', {
    method: 'POST',
    body: params,
  });
}


