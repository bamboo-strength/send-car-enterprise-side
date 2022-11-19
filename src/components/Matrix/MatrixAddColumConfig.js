
/**
 * 动态获取添加显示列表
 * @returns {columns_default|columns_948728}
 */
export function getAddListConf (params) {
  const items = [];
  if(params.length>0) {
    for (const cols in params) {
      const typeValue=params[cols].columnType;
      let typeValueTemp='input';
      if(typeValue===1){
        typeValueTemp='isFloatGtZero';
      }else if(typeValue===2){
        typeValueTemp='isFloatGteZero';
      }else if(typeValue===3){
        typeValueTemp='isIntGtZero';
      }else if(typeValue===4){
        typeValueTemp='isIntGteZero';
      }else if(typeValue===5){
        typeValueTemp='isPlateNo';
      }else if(typeValue===6){
        typeValueTemp='isMobile';
      }else if(typeValue===7){
        typeValueTemp='isIdCardNo';
      }else if(typeValue===8){
        typeValueTemp='isNumber';
      }
      const aa = {
        columnName: params[cols].columnName,
        columnAlias: params[cols].columnAlias,
        types:typeValueTemp,
        maxlen:params[cols].columnLength,
        isrequired:params[cols].isrequired===1,
        inputname:params[cols].category,
        dictValue:params[cols].dickKey,
        showname:params[cols].showname,
        initialvalue:params[cols].initialvalue,
        isReadonly:params[cols].isReadonly===1,
      }
      items.push(aa);
    }
  }
    return items;
};





