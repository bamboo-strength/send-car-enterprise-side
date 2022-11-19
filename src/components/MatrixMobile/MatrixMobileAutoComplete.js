import React, { PureComponent } from 'react';
import { AutoComplete, Form, Input, message, Select } from 'antd';
import func from '../../utils/Func';
import '../../global.less';
import { autocomplete } from '@/services/matrixCommon';
import { getTenantId } from "../../pages/Merchants/commontable";
import { requestListApi } from '@/services/api';
import styles from '@/global.less';

const { Option } = AutoComplete;
export default class MatrixMobileAutoComplete extends PureComponent {

  constructor() {
    super();
    this.state = {
      result: [],
    };
  }

  componentWillMount() {
    const { labelValue, dataType } = this.props;
    if (labelValue === 'setTopValue') { // 默认显示后台查询数据的第一条
      const param = { 'sortl': '', 'type': dataType };
      param['Blade-DesignatedTenant'] = getTenantId()
      param.tenantId  = getTenantId()
      autocomplete(param).then(resp => {
        if (JSON.stringify(resp.data) !== '{}' && resp.data.length>0) {
          this.setState({
            result: [{
              code: resp.data[0].code,
              name: resp.data[0].name,
            }],
          });
        }
      });

    }
  }

  autoComValidator = (rule, val, callback, numberType) => {
    if (!val) {
      callback();
    }
    switch (numberType) {
      case 'isPlateNo': {
        const express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        if (!express.test(val)) {
          callback('请输入正确的车牌号！');
        }
        break;
      }
      case 'isMobile': {
        const express = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!express.test(val)) {
          callback('请输入正确的手机号！');
        }
        break;
      }
      case 'isIdCardNo': {
        const express = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!express.test(val)) {
          callback('请输入正确的身份证号！');
        }
        break;
      }
      default:
    }
    callback();
  };

  handleSearch = (value) => {
    const { form } = this.props;
    this.setState({ result: [] });
    const { dataType, id,} = this.props;
    if (func.notEmpty(value)) {
      const param = { 'sortl': value, 'type': dataType };
      param['Blade-DesignatedTenant'] = getTenantId();
      param.tenantId = getTenantId();
      /* if(dataType.includes('ByFunc')){ // 从后台查询数据
         requestListApi('', dataType).then(resp => {
           if (resp.success){
             console.log(resp,'---------------')
           }
         });
       }else{ */
      autocomplete(param).then(resp => {
        if (func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
          this.setState({ result: resp.data });
        } else {
          console.log('拼音码无返回值/检查参数是否正确');
        }
      });
      // }
    } else {
      // 显示值为空时 同时去掉隐藏域的值
      form.setFieldsValue({
        [id]: '',
      });
    }
  };

  changea = (value, o) => {
    const { id, labelId, form, onSelect, dataType, bringData,formPra  } = this.props;
    if (id !== labelId) {
      form.setFieldsValue(
        {
          [id]: value,
          [labelId]: o.props.children,
        },
      );
    }
    if (bringData) {  // 需要查找带回
      const param = { 'sortl': dataType !== 'vehicleno' ? value : o.props.children, 'type': dataType };
      param['Blade-DesignatedTenant'] = getTenantId();
      param.tenantId = getTenantId();
      if(formPra && bringData.includes('|')){
          const aa = bringData.split('|') //  |分开 第一部分是需要传的参数 后一部分是要赋值的字段
            aa[0].split(',').map((item) => {
            param[item] = formPra.getFieldValue(item)
          })
          requestListApi('/api/mer-tableextend/sortl/getBringData', param).then(resp => {
            if (resp.success) {
              const detail = resp.data;
              aa[1].split(',').map((vv, index) => {
                form.setFieldsValue({
                  [vv]: `${detail[vv]}`,
                });
              });
            }
          });
      }else {
        requestListApi('/api/mer-tableextend/sortl/getBringData', param).then(resp => {
          if (resp.success) {
            const detail = resp.data;
            bringData.split(',').map((vv, index) => {
              form.setFieldsValue({
                [vv]: detail[vv],
              });
            });
          }
        });
      }

    }

    if (typeof onSelect === 'function') {
      onSelect();
    }
  };

  checkHide=(rule, v, callback)=>{
    const {form,labelId,required} = this.props
    if(!v && required){
      form.setFields({
        [labelId]: {
          value: v,
          errors: [new Error('请使用拼音码检索')]}
      })
    }
    callback();
  }

  render() {
    const {
      form, label, labelId, id, required, style, placeholder, labelValue, value, numberType, disabled,
      onBlur, onPressEnter, onChange,labelNumber
    } = this.props;
    const { getFieldDecorator,getFieldError } = form;
    const { result } = this.state;
    // 判断是否默认显示返回值的第一条
    const labelvalue = labelValue === 'setTopValue' ? (result.length > 0 ? result[0].name : '') : labelValue;
    const realvalue = labelValue === 'setTopValue' ? (result.length > 0 ? result[0].code : '') : value;
    const checkRule =
      {
        rules: [
          {
            required,
            message: placeholder || '拼音码',
          },
          { validator: (rule, value2, callback) => this.autoComValidator(rule, value2, callback, numberType) },
        ],
        initialValue: labelvalue,
      };

    const children = [];
    result.forEach(function(element) {
      children.push(<Option key={element.code}>{element.name}</Option>);
    });
    return (
      <div className='list-class' style={{ position: 'relative' }}>
        <div className="am-list-item am-list-item-middle" style={{ height: 'auto !important' }}>
          <div className='am-list-line'>
            <div className={`am-input-label am-input-label-${labelNumber}`}>{required ?
              <span style={{ color: 'red' }}>*</span> : ''} {label}：
            </div>
            {getFieldDecorator(labelId, checkRule)
            (
              <AutoComplete
                style={style}
                onSearch={this.handleSearch}
                placeholder={placeholder}
                className="mobile-select"
                onBlur={() => {
                  if (typeof onBlur === 'function') {
                    onBlur();
                  }
                }}
                onPressEnter={onPressEnter}
                onSelect={(v, o) => this.changea(v, o)}
                onChange={onChange}
                disabled={disabled}
                allowClear
              >
                {children}
              </AutoComplete>,
            )}
            {getFieldDecorator(id, {
              initialValue: realvalue,
              rules: [
                {
                  required,
                  message: placeholder || '拼音码',
                },
                { validator: (rule, v, callback) => this.checkHide(rule, v, callback) },
              ],
            })(<Input style={{ display: 'none' }} />)
            }
            {
              func.notEmpty(labelId) ?
                getFieldDecorator(labelId)(<Input style={{ display: 'none' }} />) : undefined
            }
          </div>
        </div>
        {/* { */}
        {/*  !!getFieldError(id) === true && <div className={styles.inputError}>{getFieldError(id)}</div> */}
        {/* } */}
        {
          !!getFieldError(id) === true && <div className={`am-list-item ${styles.errorlistItem}`}><div className={`am-input-label am-input-label-${labelNumber}`} /> {getFieldError(id)}</div>
        }
      </div>
    );
  }
}
