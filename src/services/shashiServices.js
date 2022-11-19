import request from '../utils/request';
import { getTenantId } from '../pages/Merchants/commontable';

/**
 * 获取优惠价格
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDiscountPrice(params) {
  return request('/api/mer-tableextend/commonBusiness/queryData', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}
