export const CONTRACT = 'contract';
/**
 * @author 马静
 * @date 2021/10/18
 * @Description: 合同信息
*/

/* 创建订单 */
export function CONTRACT_COMMIT_CONTRACTORDER(payload) {
  return {
    type: `${CONTRACT}/fetchCommitContractOrder`,
    payload,
  };
}
