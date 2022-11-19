import { clientId, currentTenant } from '@/defaultSettings';

export const btnFilter = (btns, rowData) => {
  // console.log(btns, rowData)
  if (currentTenant === '847975' && clientId === 'kspt_driver') { // 东平-司机端
    if (window.location.hash === '#/commonBusiness/commonList/mer_dispatchbill_customer_materialnos/byDirect_notAddBtn') { // 派车单
      return btns.filter(item => (item.code !== 'edit' || (item.code === 'edit' && rowData.deptId ==='1423129418921938946'))&& //  中联北辰厂区可修改派车单
        (item.code !== 'button1qrCode' || (item.code === 'button1qrCode' && rowData.carflag !== 6))&&  // 出门岗状态不展示二维码
        (item.code !== 'cancelwithoutPop' || (item.code === 'cancelwithoutPop' && rowData.status !== 0)))
    }
  }
  if (currentTenant === '847975') { // 东平-客户端大客户派车 、   司机端派车单
    if (window.location.hash === '#/commonBusiness/commonList/dinas_dispatch/dispatchManage') { // 大客户派车
      return btns.filter(item => (item.code !== 'button1qrCode' || (item.code === 'button1qrCode' && rowData.carflag !== 6))&&  // 出门岗状态不展示二维码
        (item.code !== 'cancelwithoutPop' || (item.code === 'cancelwithoutPop' && rowData.status !== 0)))  //  已作废的隐藏作废按钮
    }
  }
  return btns
}

// export const otuerFilter = (btns, rowData) => {
//   // console.log(btns, rowData)
// }
