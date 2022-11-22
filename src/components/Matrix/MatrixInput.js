import React, { PureComponent } from 'react';
import { Input, Form } from 'antd';
import func from '@/utils/Func';

export default class MatrixInput extends PureComponent {
  numberValidator = (rule, val, callback, numberType) => {
    if (!val) {
      callback();
    }
    switch (numberType) {
      case "isIntGtZero":
        if (!/^\+?[1-9]\d*$/.test(val)) {
          callback('请输入正整数！');
        }
        break;
      case "isIntGteZero":
        if (!/^(0|[1-9][0-9]*)$/.test(val)) {
          callback('请输入大于等于0的整数！');
        }
        break;
      case "isFloatGtZero": {
        if (!/^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/.test(val)) {
          callback('请输入大于0的数字！');
        }
        this.checkBit(val, callback)
        break;
      }
      case "isFloatGteZero":
        if (!/^([0-9]\d*(\.\d+)?|0)$/.test(val)) {
          callback('请输入大于等于0的数字！');
        }
        this.checkBit(val, callback)
        break;
      case "isNumber":
        if (!/^([-+])?\d+(\.\d+)?$/.test(val)) {
          callback('请输入数字！');
        }
        break;
      case "isInteger":
        if (! /^(^-?\d+$)$/.test(val)) {
          callback('请输入整数！');
        }

        break;
      case "isDecimal":
        if (! /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(val)) {
          callback('请输入数字并且保留两位小数！');
        }
        break;
      case "isPlateNo": {
        if (val) {
          if (val.length === 7) { // 普通汽车
            const express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
            if (!express.test(val)) {
              callback('请输入正确的车牌号！');
            }
          } else if (val.length === 8) { // 新能源汽车
            const newex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
            if (!newex.test(val)) {
              callback('请输入正确的车牌号！');
            }
          } else {
            callback('请输入正确的车牌号！');
          }
        }
        break;
      }
      case "isMobile": {
        const express = /^(0|86|17951)?(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])[0-9]{8}$/;
        // const express = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (!express.test(val)) {
          callback('请输入正确的手机号！');
        }
        break;
      }
      case "isIdCardNo": {
        const express = func.IdentityCodeValid(val);
        if (!express) {
          callback('请输入正确的身份证号！');
        }
        break;
      }
      case "isSpecialCheck": {
        const { label } = this.props
        //  const express = new RegExp(dictCode);
        if (!/^\+?[1-9]\d*$/.test(val) && val !== '-1' && val !== -1) {
          callback(`请输入正确的${label}`);
        }
        break;
      }
      default: console.log("没有符合的数字校验格式")
    }
    callback();
  }

  checkBit = (val, callback) => {
    // 校验小数位数
    const { realbit } = this.props
    if (func.notEmpty(realbit)) {
      const y = String(val).indexOf(".") + 1;
      const count = String(val).length - y;
      if (String(val).indexOf(".") !== -1 && count > realbit) {
        callback(`小数位数超出，只能输入${realbit}位小数`);
      }
    }

  }

  render() {
    const { form, label, id, numberType, required, style, placeholder, maxLength, rules, initialValue, disabled, extra, hidden, onChange,
      onBlur, onPressEnter, xs } = this.props
    const { getFieldDecorator } = form
    const FormItem = Form.Item;
    const formItemLayout = {
      labelCol: {
        xs: { span: func.notEmpty(xs) ? xs : 6 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: func.notEmpty(xs) ? 24 - xs : 16 },
        sm: { span: 11 },
        md: { span: 9 },
      }
    };

    const checkRule =
    {
      rules: [
        {
          required,
          message: placeholder || "不能为空",
        },
        {
          pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
          message: '前后禁止输入空格',
        },
        { validator: (rule, value, callback) => this.numberValidator(rule, value, callback, numberType) },
      ],
      initialValue
    }
    for (const index in rules) {
      checkRule.rules.push(rules[index]);
    }
    return (
      <FormItem {...formItemLayout} label={label}>
        {getFieldDecorator(id, checkRule)
          (<Input
            style={style}
            placeholder={placeholder}
            maxLength={maxLength || 25}
            className="inputor"
            onBlur={() => { if (typeof onBlur === 'function') { onBlur() } }}
            onPressEnter={onPressEnter}
            disabled={disabled}
            onChange={onChange}
            hidden={hidden}
            extra={extra}
          />)}
      </FormItem>
    )
  }
}

