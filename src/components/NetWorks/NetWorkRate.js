import {Col, Form, Rate} from 'antd';
import React, {PureComponent} from "react";

const desc = ['糟糕', '不满', '一般', '较好', '非常棒'];
const FormItem = Form.Item;
export default class NetWorkRate extends PureComponent {
  state = {
    value: 3,
  };

  handleChange = value => {
    this.setState({value});
    console.log(value)
  };

  render() {
    const {value} = this.state;
    const {form: {getFieldDecorator}, id, label, onChange,required,initialValue,rules,disabled} = this.props
    const formItemLayout = {
      labelCol: {
        xs: {span: 8},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 16},
        sm: {span: 16},
        md: {span: 16},
      },
    };
    const checkRule = {
      rules: [
        {required, message: "请选择一项"}
      ],
      initialValue:Number(initialValue)
    }
    for (const index in rules) {
      checkRule.rules.push(rules [index])
    }
    return (
      <FormItem {...formItemLayout} label={label} >
        {getFieldDecorator(id,checkRule)(
          <Rate tooltips={desc} onChange={onChange} value={value} disabled={disabled}/>
        )}
      </FormItem>
    );
  }
}

