import React, { PureComponent } from 'react';
import { Input,Form } from 'antd';
import func from '@/utils/Func';

const { TextArea } = Input;
export default class MatrixTextArea extends PureComponent {

  textAreaValidator = (rule, val, callback) => {
    if (!val) {
      callback();
    }
    if(/,/.test(val) || /'/.test(val)){
      callback('不能输入无效字符！');
    }
    callback();
  }

  render() {
    const FormItem = Form.Item;
    const {form,label,id,required,style,placeholder,maxLength,rules,row,cols,initialValue,xs} = this.props
    const { getFieldDecorator } = form
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

    const checkRule =
      {
        rules: [
          {
            required,
            message:  placeholder || "不能为空",
          },
          {
            pattern: /^[^\s]*$/,
            message: '禁止输入空格',
          },
          { validator: (rule, value, callback) => this.textAreaValidator(rule, value, callback) },
        ],
        initialValue
      }
    for(const index in rules){
      checkRule.rules.push(rules [index]);
    }

    return(
      <FormItem {...formItemLayout} label={label}>
        {getFieldDecorator(id, checkRule)
        (
          <TextArea style={style} placeholder={placeholder} maxLength={maxLength} rows={row} />
        )}
      </FormItem>
    )
  }

}

