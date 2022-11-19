import React from 'react';

/**
 * 动态获取添加显示列表
 * @returns {columns_default|columns_948728}
 */
export function getAddSubListConf (params,func,otherParam) {
  const items = [];
  if(params.length>0) {
    for (const cols in params) {
      const {showflag,category} = params[cols];
      if(showflag === 1){
        let categoryTemp="input";
        if(category===0){
          categoryTemp="input";
        }else if(category===1){
          categoryTemp="select";
        }else if(category===2){
          categoryTemp="date";
        }else if(category===4){
          categoryTemp="autocomplete";
        }else if(category===5){
          categoryTemp="search";
        }
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
        }

        const aa = {
          title: params[cols].columnAlias,
          dataIndex: params[cols].columnName,
          showDataIndex:params[cols].showname,
          columnType:params[cols].columnType,
          maxlen:params[cols].columnLength,
          isrequired: params[cols].isrequired,
          isReadonly: params[cols].isReadonly,
          type:categoryTemp,
          dictValue:params[cols].dickKey,
          editable: true,
          initialvalue:params[cols].initialvalue,
          types:typeValueTemp,
          onShowModal:func,
          otherParam
        }
        items.push(aa);
      }
    }
  }
  return items;
};





