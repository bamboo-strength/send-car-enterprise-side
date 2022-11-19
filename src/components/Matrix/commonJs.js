import moment from 'moment';
import func from '@/utils/Func';


export function handleDate (initialvalue){

  if(typeof initialvalue === 'object'){
    return initialvalue
  }
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthTemp = month.toString().padStart(2,'0');
  let valueDefault= initialvalue;
  const splitArray=initialvalue.split(",");
  let num=1*1;
  if(splitArray.length>2){
    num=splitArray[2]*1;
  }
  if(initialvalue.startsWith('firstMonth')){ // 月初
    valueDefault=`${year}-${monthTemp}-01`;
  }else if(initialvalue.startsWith('lastMonth')){ // 月末
   const last = new Date(year,month,0)
    let lastday = last.getDate()
    lastday = lastday<10?`0${lastday}`:lastday
    valueDefault = `${year}-${monthTemp}-${lastday}`
  }else if(initialvalue.startsWith('currentDate')){
    const strDate = now.getDate().toString().padStart(2,'0');
    valueDefault=`${year}-${monthTemp}-${strDate}`;
  }else if(initialvalue.startsWith('firstYear')){
    const firstyear='01-01';
    valueDefault=`${year}-${firstyear}`;
  }else if(initialvalue.startsWith('lastYear')){
    const lastyear='12-31';
    valueDefault=`${year}-${lastyear}`;
  }else if(initialvalue.startsWith('nextDay')){ // 当前日期后几天
    valueDefault = moment().add(num, 'days').format('YYYY-MM-DD').toString()
  //  valueDefault = `${year  }-${ now.getMonth() + 1 < 10 ? `0${  now.getMonth() + 1}` : now.getMonth() + 1}-${ now.getDate() < 10 ? `0${  now.getDate()}` : now.getDate()}`;
  }else if(initialvalue.startsWith('beforeDay')){ // 当前日期前几天
    valueDefault = moment().subtract(num, 'days').format('YYYY-MM-DD').toString()
  }else if(initialvalue.startsWith('beginLastYear')){
    valueDefault=`${year-1}-01-01`;
  }
  if(splitArray.length>1){
    const endValue=splitArray[1];
    valueDefault=`${valueDefault} ${endValue}`;
  }
  return valueDefault

}


export function handleDateIsRange(initialvalue){
  /**
   *  时间框
   */
  let valueDefault='';
  let valueEndDefault='';
  let initBeginDefault='';
  let initEndDefault='';
  const splitArrayType=initialvalue.split(";");
  let splitArray='';
  let splitArrayEnd='';
  if(splitArrayType.length>0){
    initBeginDefault=splitArrayType[0];
  }
  if(splitArrayType.length>1){
    initEndDefault=splitArrayType[1];
  }
  // 开始时间
  if(initBeginDefault!=='') {
    splitArray = initBeginDefault.split(",")
  }
  let num=1*1;
  if(splitArray.length>2){
    num=splitArray[2]*1;
  }
  if(initBeginDefault.startsWith('firstMonth')){
    const firstMonth = moment().month(moment().month()).startOf('month').format('YYYY-MM-DD');
    valueDefault=firstMonth;
  }else if(initBeginDefault.startsWith('lastMonth')){
    const lastMonth = moment().month(moment().month()).endOf('month').format('YYYY-MM-DD');
    valueDefault=lastMonth;
  }else if(initBeginDefault.startsWith('currentMonth')){
    valueDefault=moment().format("YYYY-MM-DD")
  }else if(initBeginDefault.startsWith('firstYear')){
    const firstyear=moment().year(moment().year()).startOf('year').format('YYYY-MM-DD');
    valueDefault=firstyear;
  }else if(initBeginDefault.startsWith('lastYear')){
    const lastyear=moment().year(moment().year()).endOf('year').format('YYYY-MM-DD');
    valueDefault=lastyear
  }else if(initBeginDefault.startsWith('nextDay')){
    valueDefault= moment().add({num},'days').format("YYYY-MM-DD");
  }
  if(splitArray.length>1){
    const endValue=splitArray[1];
    valueDefault=`${valueDefault} ${endValue}`;
  }
  // 结束日期
  if(initEndDefault!=='') {
    splitArrayEnd = initEndDefault.split(",")
  }
  let numEnd=1*1;
  if(splitArrayEnd.length>2){
    numEnd=splitArrayEnd[2]*1;
  }
  if(initEndDefault.startsWith('firstMonth')){
    const firstMonth = moment().month(moment().month()).startOf('month').format('YYYY-MM-DD');
    valueEndDefault=firstMonth;
  }else if(initEndDefault.startsWith('lastMonth')){
    const lastMonth = moment().month(moment().month()).endOf('month').format('YYYY-MM-DD');
    valueEndDefault=lastMonth;
  }else if(initEndDefault.startsWith('currentMonth')){
    valueEndDefault=moment().format("YYYY-MM-DD")
  }else if(initEndDefault.startsWith('firstYear')){
    const firstyear=moment().year(moment().year()).startOf('year').format('YYYY-MM-DD');
    valueEndDefault=firstyear;
  }else if(initEndDefault.startsWith('lastYear')){
    const lastyear=moment().year(moment().year()).endOf('year').format('YYYY-MM-DD');
    valueEndDefault=lastyear
  }else if(initEndDefault.startsWith('nextDay')){
    valueEndDefault= moment().add({numEnd},'days').format("YYYY-MM-DD");
  }
  if(splitArray.length>1){
    const endValue=splitArrayEnd[1];
    valueEndDefault=`${valueEndDefault} ${endValue}`;
  }
  return {valueDefault,valueEndDefault}
}


export function paramByColumnSetting(conditions){
  const params = {}
  if(conditions && conditions.length>0){
    conditions.forEach((item)=>{
      if (item.category === 2) {  // 处理时间
        const {initialvalue} = item
        if (item.conditionflag === 3) {
          params[`${item.columnName}_le`]=handleDate(initialvalue);
        }else if (item.conditionflag === 4) {
          params[`${item.columnName}_ge`]=handleDate(initialvalue);
        } else {
          params[item.columnName] = handleDate(initialvalue);
        }
      }else if(item.conditionflag === 6){
        params[item.columnName] = item.initialvalue
      }
    })
  }
  return params
}

export function handleSearchParams(newCondation,param={},form){
  const params = param
  if(newCondation.length>0){
    newCondation.forEach((item)=>{
      if(item.conditionflag === 2){
        func.addQuery(params, item.columnName, '_like')
      }
      if(item.category ===8 && item.conditionflag !== 5){ // 组织机构 添加equal 主要对接砂石使用
        // func.addQuery(params, item.columnName, '_equal')
        params[`${item.columnName}_equal`] = params[item.columnName]?params[item.columnName].toString():undefined
        delete params[item.columnName];
      }
      if(func.notEmpty(item.showname) && item.showname!=='vehicleno'){
        delete params[item.showname]
      }
      if (item.category === 9) {  // 处理时间区间
        params[`${item.columnName}_ge`]=params[item.columnName]?func.format(params[item.columnName][0]):undefined;
        params[`${item.columnName}_le`]=params[item.columnName]?func.format(params[item.columnName][1]):undefined;
        delete params[item.columnName];
      }else if (item.category === 2 || item.category === 11) {  // 处理时间
        const valueDefault = handleDate(item.initialvalue)
        const dateValue = params[item.columnName]?func.formatFromStr(params[item.columnName]):valueDefault
        if (item.conditionflag === 3) {
          params[`${item.columnName}_le`]=dateValue;
          delete params[item.columnName];
        }else if (item.conditionflag === 4) {
          params[`${item.columnName}_ge`]=dateValue;
          delete params[item.columnName];
        }else {
          params[item.columnName] = dateValue;
        }
      }else if(item.initialvalue && !params[item.columnName] ){
          params[item.columnName] = item.category===1 && typeof params[item.columnName] === 'string'?'':item.initialvalue  // 下拉框为空时查全部 不做处理
        }
    })
  }
  return params
}
