import React from 'react';
import { Card, Col, Divider, Form, Input, Row } from 'antd';
import func from '../../utils/Func';
import NetWorkImage from '@/components/NetWorks/NetWorkImage';
import MatrixMobileSelect from '@/components/MatrixMobile/MatrixMobileSelect';
import MatrixMobileDate from'@/components/Matrix/MatrixMobileDate';
import MatrixMobileInput from './MatrixMobileInput';
import MatrixAddressArea from '@/components/Matrix/MatrixAddressArea';
import { getInputSetting } from '../../pages/Merchants/commontable';
import MatrixRadio from './MatrixRadio';

export function getEditConf(params, form, detail,methods,operationType='edit') {
  const methodsFuncs = methods || {};
  const items = [];
  if(params.length>0) {
    const totalCoulm =[];
    for (let i = 0; i < params.length; i++) {
      const typeValue=params[i].columnType;
      const {category,dickKey,columnName,showname,columnAlias,columnLength,updateShowFlag,bringData,initialvalue,remark,} = params[i];
      let placeholder=''
      if (category===1 || category===8){
        placeholder=`请选择${params[i].columnAlias}`
      }else if(category===4){
        placeholder=`拼音码检索${params[i].columnAlias}`
      }else{
        placeholder=`请输入${params[i].columnAlias}`
      }
      const isrequired = params[i].isrequired === 1;
      const keyValue=func.notEmpty(detail[columnName])?detail[columnName]:initialvalue;
      const shownameValue=detail[showname];
      const isReadonly = operationType ==='edit'?
        (params[i].isReadonly === 3 || params[i].isReadonly === 4):
        (params[i].isReadonly === 2 || params[i].isReadonly === 3)
      const numberType = getInputSetting(typeValue);
      // const aa=getCommonsEditColumn(category,columnAlias,placeholder,numberType,columnName,isrequired,columnLength,dickKey,keyValue,showname,shownameValue,isReadonly,methodsFuncs[columnName],updateShowFlag,bringData,form,);
      // 封装
      let onBlur='';let onChanage='';let onSelect='';let fun = ''
      const dividerStyle = { margin: 0, background: 'none' };
      const methodname = methodsFuncs[columnName]
      if(func.notEmpty(methodname)){
        onBlur = function () {
          if (typeof methodname.onBlur==='function') {
            methodname.onBlur();
          }
        }
        onChanage = function (e) {
          if (typeof methodname.onChange==='function') {
            methodname.onChange(form,e);
          }
        }
        onSelect = function (e) {
          if (typeof methodname.onSelect==='function') {
            methodname.onSelect(form,e);
          }
        }
        if (typeof methodname.searchs === 'function'){
          fun = methodname.searchs
        }
      }
      // category === 0 文本
      let aa =
        <div>
          <MatrixMobileInput label={columnAlias} placeholder={placeholder} numberType={numberType} id={columnName} extra={remark} type={bringData} labelNumber={7} required={isrequired} maxLength={columnLength} onBlur={onBlur} onChange={onChanage} disabled={isReadonly} className='list-class' realbit={dickKey} form={form} initialValue={keyValue}/>
          <Divider style={dividerStyle} />
        </div>
      if(category === 1){// 移动版下拉框
        aa =
          <div>
            <MatrixMobileSelect label={columnAlias} placeholder={placeholder} id={columnName} labelId={showname} required={isrequired} initialValue={keyValue} custom={{ current: 1, size: 5 }} disabled={isReadonly} name="truckno" dictCode='/api/mer-driver-vehicle/vehicleInformationMaintenance/page' labelNumber={7} className='list-class' form={form} />
            <Divider style={dividerStyle} />
          </div>
      }else if(category === 2){// 移动版时间框
        aa =
          <div>
            <MatrixMobileDate label={columnAlias} placeholder={placeholder} id={columnName} format={dickKey} required={isrequired} initialValue={keyValue} style={{width: '100%'}} disabled={isReadonly} form={form}  />
            <Divider style={dividerStyle} />
          </div>
      }else if(category === 6){// 移动版区域选择
        aa =
          <div>
            <MatrixAddressArea id={showname} idCode={columnName} labelNumber={7} initialValue={keyValue} required label={columnAlias} placeholder={placeholder} className='list-class' form={form} />
            <Divider style={dividerStyle} />
          </div>
      }
      else if(category === 7){ // 移动端图片
        const url = keyValue || detail.pictureList?detail.pictureList[dickKey].picturePath:''
        aa =
          <div>
            <NetWorkImage label={columnAlias} upload id={columnName} labelNumber={7} url={url} required form={form} />
            <Divider style={dividerStyle} />
          </div>
      }else if(category === 13){ // 单选
        aa =<MatrixRadio label={columnAlias} placeholder={placeholder} id={columnName} required={isrequired} style={{ width: '100%' }} initialValue={keyValue} dictCode={dickKey} bringData={bringData} onBlur={onBlur} disabled={isReadonly} onChange={onChanage} form={form}/>
      }
      totalCoulm.push(aa);
    }
    items.push(<div>{totalCoulm}</div>)
  }
  return items;

}

