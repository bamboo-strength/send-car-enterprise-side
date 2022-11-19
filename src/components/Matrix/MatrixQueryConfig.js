import React from 'react';
import { Col, Input, Row } from 'antd';
import func from '../../utils/Func';
import MatrixInput from './MatrixInput';
import MatrixSelect from './MatrixSelect';
import MatrixDate from './MatrixDate';
import MatrixTextArea from './MatrixTextArea';
import MatrixAutoComplete from './MatrixAutoComplete';
import {handleDate,handleDateIsRange} from './commonJs';
import MatrixGroupTree from './MatrixGroupTree';
import MatrixMobileDate from'@/components/Matrix/MatrixMobileDate';


export function getCommonsAddColumn (category,columnAlias,placeholder,types,columnName,isrequired,columnLength,dickKey,showname,keyValue,shownameValue,isReadonly,methodname,formItemLayout,form,remark,xs) {
  let onBlur='';
  let onChanage='';
  let onSelect='';
  let fun = ''
  if(func.notEmpty(methodname)){
    onBlur = function () {
      if (typeof methodname.onBlur==='function') {
        methodname.onBlur();
      }
    }
    onChanage = function () {
      if (typeof methodname.onChange==='function') {
        methodname.onChange();
      }
    }
    onSelect = function () {
      if (typeof methodname.onSelect==='function') {
        methodname.onSelect();
      }
    }
    if (typeof methodname.searchs === 'function'){
      fun = methodname.searchs
    }
  }
  let aa = <Col span={24} className='add-config query-config'><MatrixInput label={columnAlias} placeholder={placeholder} initialValue={keyValue} numberType={types} id={columnName} maxLength={columnLength} onBlur={onBlur} onChange={onChanage} disabled={isReadonly} style={{ width: '100%' }} form={form} xs={xs} /></Col>;
  if (category === 1) {
    /**
     *  下拉列表
     */
    aa=<Col span={24} className='add-config query-config'><MatrixSelect label={columnAlias} placeholder={placeholder} id={columnName} dictCode={dickKey} initialValue={keyValue} disabled={isReadonly} onChange={onChanage} style={{ width: '100%' }} showAll form={form} xs={xs} /></Col>;
  }else if(category === 2){ // 时间框
    const valueDefault = handleDate(keyValue)
    aa=<Col span={24} className='add-config query-config'><MatrixDate label={columnAlias} placeholder={placeholder} id={columnName} format={dickKey} initialValue={valueDefault} disabled={isReadonly} style={{ width: '100%' }} form={form} xs={xs}  /></Col>;
  }else if(category === 3){
    /**
     *  文本域
     */
    aa= <Col span={24} className='add-config query-config'><MatrixTextArea label={columnAlias} placeholder={placeholder} id={columnName} maxLength={columnLength} style={{ minHeight: 32 }} row={2} form={form} xs={xs} /></Col>;
  }else if(category === 4){
    /**
     * 拼音码
     */
    aa= <Col span={24} className='add-config query-config'> <MatrixAutoComplete label={columnAlias} placeholder={placeholder} dataType={dickKey} id={columnName} labelId={showname} onChange={onChanage} onBlur={onBlur} onSelect={onSelect} disabled={isReadonly} value={keyValue} labelValue={shownameValue} style={{ width: '100%' }} form={form} xs={xs} /> </Col>
  }else if(category ===5){
    aa=  <Col span={24} className='add-config query-config'>
      <MatrixSelect label={columnAlias} placeholder={placeholder} id={columnName} dictCode={remark} required={isrequired} initialValue={keyValue} disabled={isReadonly} onChange={onChanage} style={{width: '100%'}} form={form} xs={xs} />
      {/* <MatrixInput label={columnAlias} placeholder={placeholder} numberType={types} id={columnName} maxLength={columnLength} onBlur={onBlur} onChange={onChanage} disabled={isReadonly} style={{ width: '100%' }} form={form} /> */} </Col>;
  }else if(category ===8){ // 树形 组织机构
    aa=  <Col span={24} className='add-config query-config'><MatrixGroupTree query="true" label={columnAlias} id={columnName} placeholder={placeholder} dictCode={dickKey} style={{width: '100%'}} form={form} xs={xs} /> </Col>
  }
  else if(category === 11){// 移动版时间框
    const valueDefault = handleDate(keyValue)
    aa=<Col span={24} className='add-config'><MatrixMobileDate label={columnAlias} placeholder={placeholder} id={columnName} format={dickKey} required={isrequired} initialValue={valueDefault} style={{width: '100%'}} disabled={isReadonly} form={form} /></Col>;
  } else if(category === 9){
    /**
     *  时间框范围
     */
    const {valueDefault,valueEndDefault} = handleDateIsRange(keyValue)
    aa=<Col span={24}><MatrixDate label={columnAlias} placeholder={placeholder} id={columnName} format={dickKey} required={isrequired} initialValue={valueDefault} initialEndValue={valueEndDefault} disabled={isReadonly} style={{width: '100%'}} form={form} ifRange xs={xs} /></Col>;
  }
  return aa;
};

/**
 * 添加页面动态获取显示列
 * @returns
 */
export function getQueryConf (params,form,methods,xs,object={}) {
  const methodsFuncs = methods || {};

  const formItemLayout = {
    labelCol: {
      xs: { span: xs || 8 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: xs ? 24-xs:16 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

  const items = [];
  const typeValues = ['input','isFloatGtZero','isFloatGteZero','isIntGtZero','isIntGteZero','isPlateNo','isMobile','isIdCardNo','isNumber']
  if(params.length>0) {
    const totalCoulm =[];
    for (let i = 0; i < params.length; i++) {
      const {columnType,category,dickKey,columnAlias,columnName,columnLength,showname,initialvalue,remark,isReadonly,conditionflag} = params[i];
      if(conditionflag!==6){ // 不显示只向后台传值
        const typeValue=typeValues[columnType];
        let placeholder = `请输入${columnAlias}`;
        if (category===1 || category===8){
          placeholder=`请选择${columnAlias}`
        }else if(category===4){
          placeholder=`拼音码检索${columnAlias}`
        }
        const isreadonly = isReadonly === 1 || isReadonly === 3;
        let keyValue= object[columnName]?object[columnName]:initialvalue;
        if(initialvalue && !object[columnName] && category===1 && typeof object[columnName] === 'string'){ // 下拉框为空时查全部 不做处理
          keyValue = ''
        }
        const shownameValue=object[showname];
        const aa =getCommonsAddColumn(category,columnAlias,placeholder,typeValue,columnName,false,columnLength,dickKey,showname,keyValue,shownameValue,isreadonly,methodsFuncs[columnName],formItemLayout,form,remark,xs);
        totalCoulm.push(aa);
      }
    }
    items.push(<Row gutter={24}>{totalCoulm}</Row>)
  }
  return items;
};




