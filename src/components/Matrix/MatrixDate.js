import React, { PureComponent } from 'react';
import { DatePicker, Form } from 'antd';
import moment from 'moment';
import func from '../../utils/Func';

const { RangePicker,MonthPicker } = DatePicker;
export default class MatrixDate extends PureComponent {

  textAreaValidator = (rule, val, callback) => {
    if (!val) {
      callback();
    }
    callback();
  }

  render() {
    const FormItem = Form.Item;

    const {form,label,id,required,placeholder,rules,initialValue,initialEndValue,format,style,ifRange,disabled,onBlur,xs,onChange,disabledDate,disabledTime} = this.props
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
    let checkRule =
      {
        rules: [
          {
            required,
            message:  placeholder || "不能为空",
          },
        ],
        initialValue:func.notEmpty(initialValue)?moment(initialValue):""
      }
    if(ifRange){
      checkRule =
        {
          rules: [
            {
              required,
              message:  placeholder || "不能为空",
            },
            { validator: (rule, value, callback) => this.textAreaValidator(rule, value, callback) },
          ],
          /* initialValue: func.notEmpty(initialValue)?[moment(initialValue.split(';')[1]), moment(initialValue.split(';')[0])]:undefined, */
          initialValue: func.notEmpty(initialValue)?[moment(initialValue), moment(initialEndValue)]:undefined
        }
    }
    for(const index in rules){
      checkRule.rules.push(rules [index]);
    }
    let picker ="";
    let showTime=false;
    if (format.includes('hh') || format.includes('HH')) {
      showTime = true
    }
    let datep =<DatePicker
      showTime={showTime}
      format={format}
      style={style}
      onBlur={onBlur}
      disabled={disabled}
      onChange={onChange}
      allowClear={false}
      disabledDate={disabledDate || null}
      disabledTime={disabledTime || null}
      getCalendarContainer={triggerNode => triggerNode.parentNode}
    />
    if (format === "YYYY") {
      picker="year"
    }else if (format === "YYYY-MM" || format === "YYYY/MM") {
      picker="month"
      datep =
        <MonthPicker
          showTime={showTime}
          format={format}
          style={style}
          onBlur={onBlur}
          disabled={disabled}
          onChange={onChange}
          allowClear={false}
          getCalendarContainer={triggerNode => triggerNode.parentNode}
        />
    }

    if(ifRange){
      datep =<RangePicker
        mode={picker}
        showTime={showTime}
        format={format}
        style={style}
        onBlur={onBlur}
        disabled={disabled}
        onChange={onChange}
        allowClear={false}
        getCalendarContainer={triggerNode => triggerNode.parentNode}
      />
    }
    return(
      <FormItem {...formItemLayout} label={label}>
        {getFieldDecorator(id, checkRule)
        (datep)
        }
      </FormItem>
    )
  }

}

