import React from 'react';
import { Card, Col, Form, Input, Row } from 'antd';
import func from '../../utils/Func';
import MatrixInput from './MatrixInput';
import MatrixSelect from './MatrixSelect';
import MatrixDate from './MatrixDate';
import MatrixTextArea from './MatrixTextArea';
import MatrixAutoComplete from './MatrixAutoComplete';
import MatrixSSQ from './MatrixSSQ';
import MatrixGroupTree from './MatrixGroupTree';
import MatrixMobileDate from'@/components/Matrix/MatrixMobileDate';
import MatrixMobileInput from './MatrixMobileInput';
import { getInputSetting } from '../../pages/Merchants/commontable';
import MatrixInputBringData from './MatrixInputBringData';
import styles from '@/layouts/Sword.less';
import MatrixRadio from './MatrixRadio';

const FormItem = Form.Item;
export function getEditConf(params, form, object, methods,formPra,xs,operationType='edit',aad={}) {
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
  const methodsFuncs = methods || {};
  const items = [];
  if(params.length>0) {
    const totalCoulm =[];
    for (let i = 0; i < params.length; i++) {
      const {category,dickKey,columnName,showname,columnAlias,columnLength,updateShowFlag,bringData,initialvalue,isrequired,columnType} = params[i];
      let placeholder=''
      if (category===1 || category===8){
        placeholder=`请选择${columnAlias}`
      }else if(category===4){
        placeholder=`拼音码检索${columnAlias}`
      }else{
        placeholder=`请输入${columnAlias}`
      }
      const required = isrequired === 1;
      const keyValue=func.notEmpty(object[columnName])?object[columnName]:initialvalue;
      const shownameValue=object[showname];
      const isReadonly = operationType ==='edit'?
        (params[i].isReadonly === 3 || params[i].isReadonly === 4 || params[i].isReadonly===5):
        (params[i].isReadonly === 2 || params[i].isReadonly === 3 || params[i].isReadonly===5)
      const types = getInputSetting(columnType);
      const columnNames = aad.list ? `${aad.list}[${aad.index}].${columnName}`:columnName
      const shownames = aad.list ? `${aad.list}[${aad.index}].${showname}`:showname
      const { getFieldDecorator } = form;
      const { Search } = Input;
      const spanWidth = updateShowFlag === 1?24:0
      let onBlur='';
      let onChanage='';
      let onSelect=''
      let onClick=''
      let fun = ''
      const methodname = methodsFuncs[columnName]
      const index = aad.list ? `${aad.index}`:''
      if(func.notEmpty(methodname)){
        onBlur = function () {
          if (typeof methodname.onBlur==='function') {
            methodname.onBlur();
          }
        }
        onChanage = function (e) {
          if (typeof methodname.onChange==='function') {
            methodname.onChange(form,e,index);
          }
        }
        onSelect = function (e,o,data) {
          if (typeof methodname.onSelect==='function') {
            methodname.onSelect(form,e,o,data,index);
          }
        }
        onClick = function () {
          if (typeof methodname.onClick==='function') {
            methodname.onClick(index);
          }
        }
        if (typeof methodname.searchs === 'function'){
          fun = methodname.searchs
        }
      }
      let aa = <Col span={spanWidth} className='add-config'><MatrixInput label={columnAlias} placeholder={placeholder} numberType={types} id={columnNames} required={required} style={{ width: '100%' }} initialValue={keyValue} dictCode={dickKey} maxLength={columnLength} onBlur={onBlur} disabled={isReadonly} onChange={onChanage} onClick={onClick} realbit={dickKey} form={form} xs={xs} /></Col>;
      if (category === 1) {
        /**
         *  下拉列表
         */
        aa=<Col span={spanWidth} className='add-config'><MatrixSelect label={columnAlias} placeholder={placeholder} id={columnNames} dictCode={dickKey} initialValue={keyValue} required={required} style={{width: '100%'}} disabled={isReadonly} labelId={shownames} bringData={bringData} onChange={onChanage} onSelect={onSelect} form={form} xs={xs} /></Col>;
      }else if(category === 2){
        /**
         *  时间框
         */
        aa=<Col span={spanWidth} className='add-config'><MatrixDate label={columnAlias} placeholder={placeholder} id={columnNames} format={dickKey} required={required} style={{width: '100%'}} initialValue={keyValue} disabled={isReadonly} form={form} xs={xs}  /></Col>;
      }else if(category === 3){
        /**
         *  文本域
         */
        aa= <Col span={spanWidth} className='add-config'><MatrixTextArea label={columnAlias} placeholder={placeholder} id={columnNames} maxLength={columnLength} style={{ minHeight: 32 }} row={2} initialValue={keyValue} required={required} form={form} xs={xs}  /></Col>;
      }else if(category === 4){
        /**
         * 拼音码
         */
        aa= <Col span={spanWidth} className='add-config'> <MatrixAutoComplete label={columnAlias} placeholder={placeholder} dataType={dickKey} id={columnNames} labelId={shownames} value={keyValue} labelValue={shownameValue} required={required} disabled={isReadonly} bringData={bringData} style={{width: '100%'}} numberType={types} onChange={onChanage} onBlur={onBlur} onSelect={onSelect} form={form} formPra={formPra} xs={xs}  /> </Col>
      }else if(category ===5){
        if((shownames === columnNames) || func.isEmpty(shownames)){
          aa=
            <Col span={spanWidth} className='add-config'>
              <FormItem {...formItemLayout} label={columnAlias}>
                {getFieldDecorator(columnNames,{
                  rules: [
                    {
                      required,
                      message: placeholder,
                    },
                  ],
                  initialValue:keyValue
                })(<Search placeholder={placeholder} onClick={(e) => fun(columnNames,e)} onSearch={(e) => fun(columnNames, e)} enterButton />)}
              </FormItem>
            </Col>
        }else {
          aa =
            <Col span={spanWidth} className='add-config'>
              <FormItem {...formItemLayout} label={columnAlias}>
                {getFieldDecorator(shownames, {
                  rules: [
                    {
                      required,
                      message: placeholder,
                    },
                  ],
                  initialValue:shownameValue
                })(<Search placeholder={placeholder} onClick={(e) => fun(columnNames, e)} onSearch={(e) => fun(columnNames, e)} enterButton />)}
              </FormItem>
              <FormItem {...formItemLayout} label={columnAlias} style={{ display: 'none' }}>
                {getFieldDecorator(columnNames, {
                  rules: [
                    {
                      required,
                      message: placeholder,
                    },
                  ],
                  initialValue:keyValue
                })(<Input readOnly="readOnly" />)}
              </FormItem>
            </Col>
        }
      }else if(category ===6){
        aa=  <Col span={spanWidth} className='add-config'><MatrixSSQ label={columnAlias} id={columnNames} labelId={shownames} required={required} placeholder={placeholder} defaultValue={shownameValue} defaultCodeValue={keyValue} xs={8} form={form} style={{width: '100%'}} /> </Col>
      }else if(category ===8){ // 树形 组织机构
        aa=  <Col span={spanWidth} className='add-config'>
          <MatrixGroupTree label={columnAlias} placeholder={placeholder} id={columnNames} dictCode={dickKey} initialValue={keyValue} required={required} style={{width: '100%'}} disabled={isReadonly} onChange={onChanage} onSelect={onSelect} form={form} xs={xs}  />
        </Col>
      }
      else if(category === 10){ // 移动版文本框
        aa = <Col span={spanWidth} className='add-config'><MatrixMobileInput label={columnAlias} placeholder={placeholder} numberType={types} id={columnNames} required={required} style={{ width: '100%' }} maxLength={columnLength} onBlur={onBlur} onChange={onChanage} disabled={isReadonly} realbit={dickKey} form={form} initialValue={keyValue} xs={xs} /></Col>;
      }
      else if(category === 11){// 移动版时间框
        aa=<Col span={spanWidth} className='add-config'><MatrixMobileDate label={columnAlias} placeholder={placeholder} id={columnNames} format={dickKey} required={required} initialValue={keyValue} style={{width: '100%'}} disabled={isReadonly} form={form} xs={xs} /></Col>;
      }else if(category === 7){ // 图片
        aa =
          <Col span={24} className="view-config">
            <FormItem {...formItemLayout} label={columnAlias}>
              <Card className={styles.card} cover={<img alt="" style={{width: '85%'}} src={keyValue} />} />
            </FormItem>
          </Col>;
      }else if(category === 12){ // 文本框带出
        aa = <Col span={spanWidth} className='add-config'>
          <MatrixInputBringData label={columnAlias} placeholder={placeholder} numberType={types} id={columnNames} required={required} style={{ width: '100%' }} initialValue={keyValue} dictCode={dickKey} maxLength={columnLength} bringData={bringData} onBlur={onBlur} disabled={isReadonly} onChange={onChanage} realbit={dickKey} form={form} xs={xs} />
        </Col>;
      }else if(category === 13){ // 单选
        aa =
          <Col span={spanWidth} className='add-config'>
            <MatrixRadio label={columnAlias} placeholder={placeholder} id={columnNames} required={required} style={{ width: '100%' }} initialValue={keyValue} dictCode={dickKey} bringData={bringData} onBlur={onBlur} disabled={isReadonly} onChange={onChanage} form={form} xs={xs} />
          </Col>;
      }
      totalCoulm.push(aa);
    }
    items.push(<Row gutter={24}>{totalCoulm}</Row>)
  }
  return items;

}




