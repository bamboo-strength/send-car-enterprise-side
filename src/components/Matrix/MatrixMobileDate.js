import React, { PureComponent } from 'react';
import { DatePicker, List, LocaleProvider,Toast } from 'antd-mobile';
import styles from './index.less'
export default class MatrixMobileDate extends PureComponent {

  validateIdp = (rule, date, callback) => {
    const {label,required} =this.props
    // console.log(label,required,date,'=====')
    if(required && !date){
      Toast.info(`请选择${label}`, 1);
      callback(new Error('Invalid Date'));
    }
    callback();
  }

  onValueChange = ()=>{
    console.log('2222222222222')
  }

  render() {
    const {form,label,id,required,placeholder,rules,initialValue,format='YYYY-MM-DD HH:mm:ss',style,disabled,onBlur,xs,onChange} = this.props
    const { getFieldProps,getFieldError } = form
    let datep =
      <LocaleProvider>
        <DatePicker
          {...getFieldProps(id, {
            initialValue:initialValue && initialValue!== 'undefined'?new Date(initialValue):undefined,
            rules: [
              { required, message:placeholder },
              { validator: this.validateIdp },
            ],
          })}
          id='dddddddddddddddddd'
          placeholder={placeholder}
          mode='date'
          error={getFieldError(id)}
          disabled={disabled}
          maxDate={new Date(2130, 12, 12, 23, 59, 59)}
          className='data-picker'
          onValueChange={this.onValueChange}
          // wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <List.Item arrow="horizontal">{label}:</List.Item>
        </DatePicker>
      </LocaleProvider>


     if (format.includes('hh') || format.includes('HH')) {
       datep =
         <LocaleProvider>
           <DatePicker
             {...getFieldProps(id, {
               initialValue:initialValue?new Date(initialValue):undefined,
               rules: [
                 { required, message:placeholder },
                 { validator: this.validateIdp },
               ]
             })}
            
           >
             <List.Item arrow="horizontal" className={styles.parmer}>{label}:</List.Item>
           </DatePicker>
         </LocaleProvider>
     }
    return(datep)
  }

}

