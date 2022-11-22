import React, { PureComponent } from 'react';
import func from '@/utils/Func';
import { InputItem } from 'antd-mobile';
import styles from '../../global.less';

export default class MatrixMobileInput extends PureComponent {

  numberValidator = (rule, val, callback) => {
    const { numberType } = this.props;
    if (!val) {
      callback();
    }
    switch (numberType) {
      case 'isIntGtZero':
        if (!/^\+?[1-9]\d*$/.test(val)) {
          callback('请输入正整数！');
        }
        break;
      case 'isIntGteZero':
        if (!/^(0|[1-9][0-9]*)$/.test(val)) {
          callback('请输入大于等于0的整数！');
        }
        break;
      case 'isFloatGtZero': {
        if (!/^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/.test(val)) {
          // this.maxNumber(val, callback)
          callback('请输入大于0的数字！');
        }
        this.checkBit(val, callback);
        break;
      }
      case 'isFloatGteZero':
        if (!/^([0-9]\d*(\.\d+)?|0)$/.test(val)) {
          callback('请输入大于等于0的数字！');
        }
        this.checkBit(val, callback);
        break;
      case 'isNumber':
        if (!/^[-+]?([1-9]\d*(\.\d+)?)$/.test(val)) {
          callback('请输入数字！');
        }
        break;
      case 'isInteger':
        if (!/^(^-?\d+$)$/.test(val)) {
          callback('请输入整数！');
        }

        break;
      case 'isPlateNo': {
        const express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        if (val.length === 7) { // 普通汽车
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
        break;
      }
      case 'isMobile': {
        const express = /^(0|86|17951)?(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])[0-9]{8}$/;
        // const express = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (!express.test(val)) {
          callback('请输入正确的手机号！');
        }
        break;
      }
      case 'isIdCardNo': {
        const express = func.IdentityCodeValid(val);
        if (!express) {
          callback('请输入正确的身份证号！');
        }
        break;
      }
      case "isBankCardNo": {
        const express = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/;
        if (!express.test(val)) {
          callback('请输入正确的银行卡号！');
        }
        break;
      }
      case "isSocialCode": {
        const express = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g;
        if (!express.test(val)) {
          callback('请输入正确的统一社会信用代码！');
        }
        break;
      }
      case "temp": {
        const x = String(val).indexOf('.') + 1; // 小数点的位置
        const y = (x !== 0) ? String(val).length - x : 0; // 小数的位数
        const elementNum = Number.parseFloat(val);
        if (Number.isNaN(elementNum) || (y > 1) || (elementNum < 36) || (elementNum > 40)) {
          callback('请输入正确体温！');
          return false;
        }
        break
      }
      default: console.log('没有符合的数字校验格式');
    }
    const { validator } = this.props
    if (validator) {
      validator(rule, val, callback)
    }
    callback();
  };

  checkBit = (val, callback) => {
    // 校验小数位数
    const { realbit, maximumLength } = this.props;
    if (func.notEmpty(realbit)) {
      const y = String(val).indexOf('.') + 1;
      const count = String(val).length - y;
      if (String(val).indexOf('.') !== -1 && count > realbit) {
        callback(`小数位数超出,只能输入${realbit}位小数`);
      }
    }
    // 校验小数点前面数字位数
    if (func.notEmpty(maximumLength)) {
      const aa = String(val).split('.')
      if (aa[0].length > maximumLength) {
        callback(`位数超出，只能输入${maximumLength}位数`)
      }
    }
  };

  render() {
    const {
      form, label, id, numberType, required, placeholder, maxLength, initialValue, className,
      onBlur, editable, onClick, style, labelNumber, disabled, isColon, extra, type, moneyKeyboardAlign = 'left', readonly
    } = this.props;
    const { getFieldError, getFieldProps } = form;
    return (
      <div className={className} style={{ ...style, position: 'relative' }}>
        <InputItem
          {...getFieldProps(id, {
            initialValue,
            rules: [
              { required, message: placeholder },
              {
                pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                message: '前后禁止输入空格',
              },
              { validator: (rule, value, callback) => this.numberValidator(rule, value, callback, numberType) },
            ],
          })}
          placeholder={placeholder}
          maxLength={maxLength || 25}
          onBlur={onBlur}
          onClick={onClick}
          clear
          type={type || ''}
          extra={extra || ''}
          disabled={disabled}
          moneyKeyboardAlign={moneyKeyboardAlign}
          editable={editable}
          labelNumber={labelNumber || 6}
          readonly={readonly}
          form={form}
        >
          {required ? <span style={{ color: 'red' }}>*</span> : ''} {label}{isColon ? null : '：'}

        </InputItem>
        {
          !!getFieldError(id) === true && <div className={`am-list-item ${styles.errorlistItem}`}><div className={`am-input-label am-input-label-${labelNumber || 6}`} /> {getFieldError(id)}</div>
        }
      </div>
    );
  }

}

