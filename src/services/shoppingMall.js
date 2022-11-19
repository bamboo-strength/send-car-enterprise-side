import request from '@/utils/request';
import { stringify } from 'qs';
import func from '@/utils/Func';

/**
 * @author 马静
 * @date 2021/10/11
 * @Description: 厂区信息接口
 */

/* 在营厂区分页列表 */
export async function queryPage(params) {
  return request(`/api/mer-shop/app/factory/queryPage?${stringify(params)}`);
}

/* 在营厂区详情 */
export async function queryDetail(params) {
  return request(`/api/mer-shop/app/factory/queryDetail?${stringify(params)}`);
}

/* 商品分页列表 */
export async function goodsQueryPage(params) {
  return request(`/api/mer-shop/app/goods/queryPage?${stringify(params)}`);
}

/* 获取商品详情 */
export async function goodsQueryDetail(params) {
  return request(`/api/mer-shop/app/goods/queryDetail?${stringify(params)}`);
}

/**
 * @author 马静
 * @date 2021/10/11
 * @Description: 收货地址接口
 */

/* 添加收货地址 */
export async function addresSave(params) {
  return request(`/api/mer-shop/app/address/save`, {
    method: 'POST',
    body: params,
  });
}

/* 查询收货地址列表 */
export async function addresQueryList(params) {
  return request(`/api/mer-shop/app/address/queryList?${stringify(params)}`);
}

/* 删除收货地址 */
export async function addresRemove(params) {
  return request(`/api/mer-shop/app/address/remove`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 设为默认地址 */
export async function addresSetDefault(params) {
  return request(`/api/mer-shop/app/address/setDefault`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 获取收货地址详情 */
export async function addresQueryDetail(params) {
  return request(`/api/mer-shop/app/address/queryDetail`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 获取默认收货地址信息 */
export async function addresGetDefaultAddr(params) {
  return request(`/api/mer-shop/app/address/getDefaultAddr?${stringify(params)}`);
}

/**
 * @author 马静
 * @date 2021/10/11
 * @Description: 购物车接口
 */

/* 加入购物车 */
export async function addCart(params) {
  return request(`/api/mer-shop/app/cart/addCart`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 修改商品数量 */
export async function editGoodsNum(params) {
  return request(`/api/mer-shop/app/cart/editGoodsNum`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 删除购物车商品 */
export async function removeByIds(params) {
  return request(`/api/mer-shop/app/cart/removeByIds`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 商品详情 */
export async function cartQueryDetail(params) {
  return request(`/api/mer-shop/app/cart/queryDetail?${stringify(params)}`);
}

/* 分页列表 */
export async function cartQueryPage(params) {
  return request(`/api/mer-shop/app/cart/queryPage?${stringify(params)}`);
}

/* 分页列表 */
export async function parameter(parameters) {
  return request(`https://restapi.amap.com/v3/geocode/geo?key=c6491852af21b06d5c821ca2b5213e6b&${stringify(parameters)}`);
}

/* 秒杀分页列表 */
export async function querySeckillPage(params) {
  return request(`/api/mer-shop/app/spike/activity/selectPage?${stringify(params)}`);
}

/* 秒杀订单分页 */
export async function orderSelectPage(params) {
  return request(`/api/mer-shop/app/spike/order/selectPage?${stringify(params)}`);
}

/* 秒杀详情 */
export async function seckillDetail(parameters) {
  return request(`/api/mer-shop/app/spike/activity/detail?${stringify(parameters)}`);
}

/* 秒杀订单详情 */
export async function orderDetail(parameters) {
  return request(`/api/mer-shop/app/spike/order/detail?${stringify(parameters)}`);
}

/* 提交秒杀订单 */
export async function commitSpikeActivityContractOrder(params) {
  return request(`/api/mer-shop/app/contract/commitSpikeActivityContractOrder`, {
    method: 'POST',
    body: params,
  });
}

/* 秒杀下单 */
export async function purchase(params) {
  return request(`/api/mer-shop/app/spike/order/purchase`, {
    method: 'POST',
    body: params,
  });
}
/* 删除下单 */
export async function removeOrder(params) {
  return request(`/api/mer-shop/app/spike/order/removeOrder`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 取消下单 */
export async function cancelOrder(params) {
  return request(`/api/mer-shop/app/spike/order/cancelOrder`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 秒杀-检验是否已经预约活动 */
export async function checkReserveStatus(params) {
  return request(`/api/mer-shop/app/comm/notice/spike/checkReserveStatus`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 秒杀-活动结束处理 */
export async function endSpike(params) {
  return request(`/api/mer-shop/app/spike/activity/endSpike`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

/* 秒杀-预约提醒 */
export async function noticeAdd(params) {
  return request(`/api/mer-shop/app/comm/notice/spike/noticeAdd`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 秒杀-取消预约 */
export async function noticeCancel(params) {
  return request(`/api/mer-shop/app/comm/notice/spike/noticeCancel`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 秒杀 -查询是否在黑名单内 */
export async function selectDeleteList(params) {
  return request(`/api/mer-shop/blacklist/selectDeleteList?${stringify(params)}`);
}

/* 查询是否交保证金 */
export async function isearnestMoney(params) {
  return request(`/api/mer-shop/shopcontractearnest/isEarnestSubmit?${stringify(params)}`);
}

/* 保证金支付 */
export async function payEarnestSubmit(params) {
  return request('/api/mer-shop/shopcontractearnest/earnestSubmit', {
    method: 'POST',
    body: params,
  });
}

// 保证金审核提交
export async function submitAudit(params) {
  return request('/api/mer-shop/shopContractEarnestAudit/submit', {
    method: 'POST',
    body: params,
  });
}

/* 竞价分页查询 */
export async function  BiddingPaging(params) {
  return request(`/api/mer-shop/app/spike/order/selectPage?${stringify(params)}`);
}

/* 参与竞价 */
export async function partBidding(params) {
  return request(`/api/mer-shop/app/spike/bidding/auction`, {
    method: 'POST',
    body: params,
  });
}

/* 竞价记录 */
export async function  bidRecord(params) {
  return request(`/api/mer-shop/app/spike/bidding/selectAppPage?${stringify(params)}`);
}
/* 竞价记录 */
export async function  getNum(params) {
  return request(`/api/mer-shop/app/spike/bidding/getDeptCountAndBiddingCount?${stringify(params)}`);
}
