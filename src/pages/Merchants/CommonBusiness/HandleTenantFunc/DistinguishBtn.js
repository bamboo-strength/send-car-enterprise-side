import { getCurrentUser } from '../../../../utils/authority';


export function distinguishBtn(tableName,modulename,actionButtons,rowData,rowID) {
  let btns = []
  const {loadtype,start,flag,} = rowData
  if(getCurrentUser().tenantId === '042606'){ // 董家口
    /**
     * start=0 可以执单 =1可以签到
     * 采购 只能执单 不能预约；销售能执单 能预约（执单按钮都显示）
     */
    if(tableName==='mobileInterface' && modulename==='MobileAction' && rowID === '0'){ // 派车单执单
      const filterItem = start === '0'?'executeOrder':'' // 已执单不再显示执单按钮
      // console.log(filterItem,'----')
      btns = actionButtons.filter(item=>item.code === filterItem)
    }
    if(tableName==='mobileInterface' && modulename==='MobileQueuemanageAction' && flag === '0' && loadtype === '0'){ // 门岗计划-重新预约、签到
      btns = actionButtons.filter(item=>item.code === 'againAppointment' || item.code === 'signIn')
    }
  }
  return  btns
}





