import React from 'react';
import { Col, Form, Input, Row } from 'antd';
import func from '../../utils/Func';
import MatrixInput from './MatrixInput';
import MatrixSelect from './MatrixSelect';
import MatrixDate from './MatrixDate';
import MatrixTextArea from './MatrixTextArea';
import MatrixAutoComplete from './MatrixAutoComplete';
import MatrixSSQ from './MatrixSSQ';
import MatrixGroupTree from './MatrixGroupTree';
import MatrixMobileInput from './MatrixMobileInput';
import {handleDate} from './commonJs';
import MatrixMobileDate from'@/components/Matrix/MatrixMobileDate';
import { getInputSetting } from '../../pages/Merchants/commontable';
import MatrixInputBringData from './MatrixInputBringData';
import MatrixRadio from './MatrixRadio';

const FormItem = Form.Item;
export function getCommonsAddColumn (category,columnAlias,placeholder,types,columnName,isrequired,columnLength,dickKey,showname,initialvalue,isReadonly,methodname,Search,addShowFlag,bringData,formItemLayout,form,xs) {
  const { getFieldDecorator } = form;
  const spanWidth = addShowFlag === 1?24:0
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
  let aa = <Col span={spanWidth} className='add-config'><MatrixInput label={columnAlias} placeholder={placeholder} numberType={types} id={columnName} required={isrequired} style={{ width: '100%' }} maxLength={columnLength} onBlur={onBlur} onChange={onChanage} disabled={isReadonly} realbit={dickKey} form={form} initialValue={initialvalue} xs={xs} /></Col>;
  if (category === 1) {// 下拉列表
    aa=<Col span={spanWidth} className='add-config'><MatrixSelect label={columnAlias} placeholder={placeholder} id={columnName} dictCode={dickKey} required={isrequired} initialValue={initialvalue} style={{width: '100%'}} disabled={isReadonly} labelId={showname} onChange={onChanage} bringData={bringData} form={form} onSelect={onSelect} xs={xs} /></Col>;
  }else if(category === 2){// 时间框
    const valueDefault = handleDate(initialvalue)
    aa=<Col span={spanWidth} className='add-config'><MatrixDate label={columnAlias} xs={8} placeholder={placeholder} id={columnName} format={dickKey} required={isrequired} initialValue={addShowFlag === 1?valueDefault:undefined} style={{width: '100%'}} disabled={isReadonly} form={form} /></Col>;
  }else if(category === 3){// 文本域
    aa= <Col span={spanWidth} className='add-config'><MatrixTextArea label={columnAlias} placeholder={placeholder} id={columnName} maxLength={columnLength} style={{ minHeight: 32 }} row={2} required={isrequired} form={form} xs={xs} /></Col>;
  }else if(category === 4){// 拼音码
    aa= <Col span={spanWidth} className='add-config'> <MatrixAutoComplete label={columnAlias} placeholder={placeholder} dataType={dickKey} id={columnName} labelId={showname} required={isrequired} bringData={bringData} numberType={types} onChange={onChanage} onBlur={onBlur} onSelect={onSelect} disabled={isReadonly} style={{ width: '100%' }} form={form} xs={xs} /> </Col>
  }else if(category ===5){ // 选择子表弹窗
    if((showname === columnName) || func.isEmpty(showname)){
      aa=
        <Col span={spanWidth} className='add-config'>
          <FormItem {...formItemLayout} label={columnAlias}>
            {getFieldDecorator(columnName,{
              rules: [
                {
                  required: isrequired,
                  message: placeholder,
                },
              ],
            })(<Search placeholder={placeholder} onClick={(e) => fun(columnName,e)} onSearch={(e) => fun(columnName, e)} enterButton />)}
          </FormItem>
        </Col>
    }else {
      aa =
        <Col span={spanWidth} className='add-config'>
          <FormItem {...formItemLayout} label={columnAlias}>
            {getFieldDecorator(showname, {
              rules: [
                {
                  required: isrequired,
                  message: placeholder,
                },
              ],
            })(<Search placeholder={placeholder} onClick={(e) => fun(columnName, e)} onSearch={(e) => fun(columnName, e)} enterButton/>)}
          </FormItem>
          <FormItem {...formItemLayout} label={columnAlias} style={{ display: 'none' }}>
            {getFieldDecorator(columnName, {
              rules: [
                {
                  required: isrequired,
                  message: placeholder,
                },
              ],
            })(<Input readOnly="readOnly" />)}
          </FormItem>
        </Col>
    }
  }else if(category ===6){
    aa=  <Col span={spanWidth} className='add-config'><MatrixSSQ label={columnAlias} id={columnName} required={isrequired} labelId={showname} placeholder={placeholder} form={form} style={{width: '100%'}} xs={xs} /> </Col>
  }else if(category ===8){ // 树形 组织机构
    aa=  <Col span={spanWidth} className='add-config'><MatrixGroupTree label={columnAlias} id={columnName} multiple={false} placeholder={placeholder} required={isrequired} disabled={isReadonly} dictCode={dickKey} style={{width: '100%'}} onChange={onChanage} onSelect={onSelect} form={form} xs={xs} /> </Col>
  }else if(category === 9){// 时间框范围
    const valueDefault = handleDate(initialvalue)
    aa=<Col span={spanWidth}><MatrixDate label={columnAlias} placeholder={placeholder} id={columnName} format={dickKey} required={isrequired} initialValue={valueDefault} style={{width: '100%'}} disabled={isReadonly} form={form} ifRange xs={xs} /></Col>;
  }
  else if(category === 10){ // 移动版文本框
    aa = <Col span={spanWidth} className='add-config'><MatrixMobileInput label={columnAlias} placeholder={placeholder} numberType={types} id={columnName} required={isrequired} style={{ width: '100%' }} maxLength={columnLength} onBlur={onBlur} onChange={onChanage} disabled={isReadonly} realbit={dickKey} form={form} initialValue={initialvalue} xs={xs} /></Col>;
  }
  else if(category === 11){// 移动版时间框
    const valueDefault = handleDate(initialvalue)
    aa=<Col span={spanWidth} className='add-config'><MatrixMobileDate label={columnAlias} placeholder={placeholder} id={columnName} format={dickKey} required={isrequired} initialValue={valueDefault} style={{width: '100%'}} disabled={isReadonly} form={form} xs={xs} /></Col>;
  }else if(category === 12){ // 文本框带出
    aa =
      <Col span={spanWidth} className='add-config'>
        <MatrixInputBringData label={columnAlias} placeholder={placeholder} numberType={types} id={columnName} required={isrequired} style={{ width: '100%' }} initialValue={initialvalue} dictCode={dickKey} maxLength={columnLength} bringData={bringData} onBlur={onBlur} disabled={isReadonly} onChange={onChanage} realbit={dickKey} form={form} xs={xs} />
      </Col>;
  }else if(category === 13){ // 单选
    aa =
      <Col span={spanWidth} className='add-config'>
        <MatrixRadio label={columnAlias} placeholder={placeholder} id={columnName} required={isrequired} style={{ width: '100%' }} initialValue={initialvalue} dictCode={dickKey} bringData={bringData} onBlur={onBlur} disabled={isReadonly} onChange={onChanage} form={form} xs={xs} />
      </Col>;
  }
  return aa;
};

/**
 * 添加页面动态获取显示列
 * @returns
 */
export function getAddConf (params,form,methods,xs) {
  const methodsFuncs = methods || {};
  const { Search } = Input;
  const formItemLayout = {
    labelCol: {
      xs: { span: 8 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 11 },
      md: { span: 9 },
    },
  };
  const items = [];
  if(params.length>0) {
    const totalCoulm =[];
    for (let i = 0; i < params.length; i++) {
      const {category,dickKey,columnAlias,columnName,columnLength,showname,initialvalue,addShowFlag,bringData,isrequired,remark,columnType} = params[i];
      let placeholder=''
      if (category===1 || category===8){
        placeholder=`请选择${columnAlias}`
      }else if(category===4){
        placeholder=`拼音码检索${columnAlias}`
      }else{
        placeholder=`请输入${columnAlias}`
      }
      const isReadonly = params[i].isReadonly === 2 || params[i].isReadonly === 3 || params[i].isReadonly===5;
      const types = getInputSetting(columnType);
      const aa =getCommonsAddColumn(category,columnAlias,remark || placeholder,types,columnName,isrequired === 1,columnLength,dickKey,showname,initialvalue,isReadonly,methodsFuncs[columnName],Search,addShowFlag,bringData,formItemLayout,form,xs);
      totalCoulm.push(aa);
    }
    items.push(<Row gutter={24}>{totalCoulm}</Row>)
  }
  return items;
};




