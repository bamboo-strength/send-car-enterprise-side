import {Toast } from 'antd-mobile';
import { getCurrentUser,  } from '../../utils/authority';
import { clientId } from '../../defaultSettings';
import func from '@/utils/Func';
import {getSystemParamByParamKey} from '@/services/param'

export function getColums (showColums,modulelistName){
  const rows = [];
  showColums.forEach(item=>{
    if(item && item.listShowFlag === 1){
      const obj = {
        key:item.columnAlias,
        value:func.notEmpty(item.showname)?item.showname:item.columnName
      }
      rows.push(obj);
    }
  })
  return rows
}

export function getTenantId (){ // 获取租户号
  let shipperTenantId = null // getCurrentUser().tenantId
  // if(clientId ==='kspt_shf' || clientId==='kspt_cyf' || clientId==='kspt_driver'){
  //   shipperTenantId = localStorage.getItem('merchantsFhfTenantId') || JSON.parse(localStorage.getItem('sword-current-user')).tenantId
  // }
  return  shipperTenantId
}

/**
 * 主子结构 保存修改通用方法
 * @param form
 * @param param
 */
export function addSaveCommon  (type,form,dataSource,ziSaveFlag,showColums,showSubColums,ifcheckSub=true) {
  let aa = ''
  form.validateFieldsAndScroll((err, values) => {
    // console.log(err,values,'===values')
    if (!err) {
      if(showSubColums.length > 0 && ifcheckSub){
        if(!values.list ||values.list.length<1){
          Toast.fail('子表至少有一条数据');
          return
        }
        if(!ziSaveFlag){
          Toast.fail('请检查子表数据');
          return
        }
      }
     // console.log(values,'======++++++++')
      const params = {
        ...values,
      }
      if(showColums.length>0){
        showColums.forEach((item)=>{
          if (item.category === 2) {  // 处理时间
            params[item.columnName] =  func.format(values[item.columnName]) === 'Invalid date' || func.format(values[item.columnName]) === null ?'':func.format(params[item.columnName]);
          }
          if (item.category === 4 && item.columnName!=='vehicleno') {  // 处理拼音码 只传no
            delete params[item.showname];
          }
        })
      }
      if(values.begintime>values.endtime){
        Toast.fail('有效结束时间不能早于开始时间');
        return
      }
      if (params.beginValiddate >= params.endValiddate){
        Toast.fail('有效结束时间不能早于开始时间！')
        return
      }
      if(showSubColums.length > 0 ){
        params.sublist = values.list
        delete params.data
      }
      if (type !== 'add'){
        params.id=type
      }
      aa = params
    }
  });
  return aa
}

/*  通用查询  */
export function GeneralQuery(tableCondition,param) {
  const params = param
  if(tableCondition.length>0){
    tableCondition.forEach((item)=>{
      if(item.conditionflag === 2){
        func.addQuery(params, item.columnName, '_like')
      }
      if(item.conditionflag === 6){
        params[item.columnName] = item.initialvalue
      }
      if(func.notEmpty(item.showname)){
        delete params[item.showname]
      }
      if (item.category === 2) {  // 处理时间
        if (item.conditionflag === 3) {
          params[`${item.columnName}_le`]=func.format(params[item.columnName]);
          delete params[item.columnName];
        }else if (item.conditionflag === 4) {
          params[`${item.columnName}_ge`]=func.format(params[item.columnName]);
          delete params[item.columnName];
        }else {
          params[item.columnName] = func.format(params[item.columnName]);
        }
      }
      if(func.notEmpty(item.initialvalue) && item.isReadonly === 1){
        params[item.columnName] = item.initialvalue
      }
    })
  }
}


// BaseUrl
export function getBaseUrl() {  // 网签合同请求后台接口地址
  // const BaseUrlData = "http://60.167.168.148:8090/#";
  const BaseUrlData = "http://122.112.174.71:195/#";
  // const BaseUrlData = "http://localhost:7777/#";
  // const BaseUrlData = "http://192.168.31.183:7777/#";
  return BaseUrlData;
}

// 判断通用配置字段类型
export function getInputSetting(value) {
  const typeValue = parseInt(value,0)
  const typeValues = ['input','isFloatGtZero','isFloatGteZero','isIntGtZero','isIntGteZero','isPlateNo','isMobile','isIdCardNo','isNumber','isInteger','isSpecialCheck','isSocialCode','temp']
  const typeValueTemp= typeValues[typeValue]
  return typeValueTemp;
}


// ************************************不常用方法******************************************8**************
/*
*  获取基础参数类型 并放到localStorage 中
* @param paramKey
*!/  */
export function getParamByKey (type,paramKey,tenantId){
  const param = {'paramKey':paramKey}
  param.tenantId = tenantId
  localStorage.getItem(type,'=====================')
  getSystemParamByParamKey(param).then(resp => {
    if (resp.success && func.notEmpty(resp.data) && JSON.stringify(resp.data) !== '{}' ) {
      localStorage.setItem(type,resp.data)
    }else if(type === 'isIncludeSubTable'){
        localStorage.setItem(type,'')
      }
  });
}

/**
 * 获取控制参数 公共方法
 */
export function getCommonParam (tenantId){
  getParamByKey('controltype','dispatchplan.controltype',tenantId)
  // getParamByKey('isIncludeSubTable','dispatch.isIncludeSubTable',tenantId)
}




