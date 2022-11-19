import React, { PureComponent } from 'react';
import { Checkbox ,Form } from 'antd';

const CheckboxGroup = Checkbox.Group;
export default class MatrixCheckbox extends PureComponent {

  textAreaValidator = (rule, val, callback) => {
    if (!val) {
      callback();
    }
    callback();
  }

  /* onCheckAllChange = (e,plainOptions) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
   */

  render() {
    const FormItem = Form.Item;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const {label,id,required,rules,placeholder,plainOptions,initialValue,onChange } = this.props
    const { getFieldDecorator } = this.props.form
    const checkRule =
      {
        rules: [
          {
            required,
            message:  placeholder || "不能为空",
          },
          { validator: (rule, value, callback) => this.textAreaValidator(rule, value, callback) },
        ],
        initialValue
      }
    for(const index in rules){
      checkRule.rules.push(rules [index]);
    }

    const options = [
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ];
    let realOps =[]
    if(plainOptions === undefined){
      realOps = options
    }else {
      realOps = plainOptions
    }
    return(
      <FormItem {...formItemLayout} label={label}>
        {getFieldDecorator(id, checkRule)
        (
          <CheckboxGroup options={realOps} onChange={onChange} />
        )}
      </FormItem>
    )
  }

}

