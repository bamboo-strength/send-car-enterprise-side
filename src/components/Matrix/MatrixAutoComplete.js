import React, { PureComponent } from 'react';
import { AutoComplete, Form, Input } from 'antd';
import func from '../../utils/Func';
import { autocomplete } from '@/services/matrixCommon';
import { getTenantId } from '../../pages/Merchants/commontable';
import { requestListApi } from '@/services/api';
import { currentTenant, } from '../../defaultSettings';

const { Option } = AutoComplete;
export default class MatrixAutoComplete extends PureComponent {

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
        if(val){
          if(val.length === 7){ // 普通汽车
            const express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
            if (!express.test(val)) {
              callback('请输入正确的车牌号！');
            }
          }else if(val.length === 8){ // 新能源汽车
            const newex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
            if (!newex.test(val)) {
              callback('请输入正确的车牌号！');
            }
          }else {
            callback('请输入正确的车牌号！');
          }
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
    let { dataType,} = this.props;
    const otherParam = {}
    if (value) {
      if(dataType.includes('|')){ // 包含向后台传的参数
        const [type,settingParam] = dataType.split('|')
        dataType = type
        otherParam[settingParam] = form.getFieldValue(settingParam)
      }
      const param = { 'sortl': value, 'type': dataType,...otherParam };
      param['Blade-DesignatedTenant'] = getTenantId();
      param.tenantId = getTenantId();
      autocomplete(param).then(resp => {
        if (func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
          this.setState({ result: resp.data });
        } else {
          console.log('拼音码无返回值/检查参数是否正确');
        }
      });
    } else {
      // 显示值为空时 同时去掉隐藏域的值
      const {id} = this.props
      form.setFieldsValue({
        [id]: '',
      });
    }
  };

  onSelectData = (value, o) => {
    const { id, labelId, form, onSelect, dataType, bringData,formPra,axles  } = this.props;
    if (id !== labelId) {
      form.setFieldsValue(
        {
          [id]: value,
          [labelId]: o.props.children,
        },
      );
    }
    if (bringData) {  // 需要查找带回
      if(currentTenant === '847975'){ // 东平带出特殊处理 直接从当前数据取
        const {obj} = o.props
        bringData.split(',').map((vv, index) => {
          form.setFieldsValue({
            [vv]: `${obj[axles || vv]}`,
          });
        });
      }else {
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
                  [vv]: detail[vv],
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
    }
    if (typeof onSelect === 'function') {
      onSelect(value, o,);
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
      form, label, labelId, id, required, style, className,placeholder, labelValue, value, numberType, disabled,
      onBlur, onPressEnter, onChange,xs,
    } = this.props;
    const FormItem = Form.Item;
    const formItemLayout = {
      labelCol: {
        xs: { span: func.notEmpty(xs)?xs:8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: func.notEmpty(xs)?24-xs:16 },
        sm: { span: 11 },
        md: { span: 9 },
      },
    };

    const { getFieldDecorator } = form;
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
      children.push(<Option key={element.code} obj={element}>{element.name}</Option>);
    });

    return (
      <FormItem {...formItemLayout} label={label}>
        {getFieldDecorator(labelId, checkRule)
        (
          <AutoComplete
            className={className}
            style={style}
            onSearch={this.handleSearch}
            placeholder={placeholder}
            onBlur={() => {
              if (typeof onBlur === 'function') {
                onBlur();
              }
            }}
            onPressEnter={onPressEnter}
            onSelect={(v, o) => this.onSelectData(v, o)}
            onChange={onChange}
            disabled={disabled}
            allowClear
            getPopupContainer={triggerNode => triggerNode.parentNode}
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
      </FormItem>

    );
  }
}
