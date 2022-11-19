import React, { PureComponent } from 'react';
import { Radio,Form  } from 'antd';
import { autocomplete } from '../../services/matrixCommon';
import { getTenantId } from '../../pages/Merchants/commontable';

export default class MatrixRadio extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      result:[],
    };
  }

  componentDidMount() {
    const { dictCode, options } = this.props;
    const ops = [];
    const param = {}
    param['Blade-DesignatedTenant'] = getTenantId()
    param.tenantId = getTenantId()
    if(options){
      options.forEach(function(element) {
        ops.push(<Radio value={element.code}>{element.name}</Radio>);
      });
      this.setState({ result: ops })
    }
    if(!options && dictCode){
      param.sortl=''
      param.type = dictCode
      autocomplete(param).then(resp => {
        if(resp && JSON.stringify(resp.data) !== '{}'){
          resp.data.forEach(function(element) {
            ops.push(<Radio value={element.code}>{element.name}</Radio>);
          });
        }
        this.setState({ result: ops })
      });
    }

    if(ops.length<1){
      ops.push(<Radio value='0'>否</Radio>)
      ops.push(<Radio value='1'>是</Radio>)
      this.setState({ result: ops })
    }


  }

  textAreaValidator = (rule, val, callback) => {
    if (!val) {
      callback();
    }
    callback();
  }


  render() {
    const FormItem = Form.Item;
    const {label,id,required,rules,placeholder,initialValue,onChange,form ,xs} = this.props
    const {result} = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: xs || 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: xs?24-xs:16 },
        sm: { span: 11 },
        md: { span: 9 },
      },
    };

    const { getFieldDecorator } = form
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
    return(
      <FormItem {...formItemLayout} label={label}>
        {getFieldDecorator(id, checkRule)
        (
          <Radio.Group onChange={onChange}>
            {result}
          </Radio.Group>
          )}
      </FormItem>
    )
  }

}

