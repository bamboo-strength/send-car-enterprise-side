import React, { PureComponent } from 'react';
import { Form,TreeSelect } from 'antd';
import func from '@/utils/Func';
import { getTenantId } from '../../pages/Merchants/commontable';
import { tree } from '@/services/dept';
import {isAdminDetail} from '../../services/DongPing/common'
import { getCurrentUser } from '@/utils/authority';

const { TreeNode } = TreeSelect;

class MatrixGroupTree extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      deptTrees:[],
      initialValueDept:undefined,
      ifJinshi: false
    };
  }

  componentDidMount = () => {
    const {ifJinshi} = this.state
    if(ifJinshi){ // 东平特殊处理 判断集团还是厂区；
      isAdminDetail().then(res=>{
        if(res.data.data!=='-1'){ // 厂区；值为-1代表金石
          this.setState({
            initialValueDept:res.data.data.id,
          })
        }
      })
    }

    const param = {}
    param['Blade-DesignatedTenant'] = getTenantId()
    param.tenantId = getTenantId()
    tree(param).then(resp => {
      if(func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
        this.setState({ deptTrees: resp.data })
      }
    });
  }

  textAreaValidator = (rule, val, callback) => {
    if (!val) {
      callback();
    }
    callback();
  }

  render() {
    const FormItem = Form.Item;
    const {label,id,required,query,style,placeholder,rules,initialValue,onChange,form,xs,disabled,dictCode} = this.props
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
    const {deptTrees,ifJinshi,initialValueDept} =this.state

    const renderTreeNodes = data =>

      data.map(item => {
        if (item.children) {
          item.disabled = true;
          return (
            <TreeNode key={item.key} title={item.title} value={item.value} disabled={item.disabled}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...item} key={item.key} title={item.title} value={item.value} />;
      });
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
        initialValue:initialValue?`${initialValue}`:ifJinshi && initialValueDept?getCurrentUser().deptId:undefined
      }
    for(const index in rules){
      checkRule.rules.push(rules [index]);
    }
    if(query){
      return(
        <FormItem {...formItemLayout} label={label}>
          {getFieldDecorator(id, checkRule)
          (
            <TreeSelect
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={deptTrees}
              allowClear
              treeNodeFilterProp="title"
              placeholder={placeholder}
              style={style}
              onChange={onChange}
              treeCheckable={!(dictCode && dictCode ==='single')}
              treeDefaultExpandAll="true"
              disabled={ifJinshi?initialValueDept:disabled}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            />
          )}
        </FormItem>
      )
    }else {
      return(
        <FormItem {...formItemLayout} label={label}>
          {getFieldDecorator(id, checkRule)
          (
            <TreeSelect
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              // treeData={deptTrees}
              allowClear
              treeNodeFilterProp="title"
              placeholder={placeholder}
              style={style}
              onChange={onChange}
              // treeCheckable='false'
              treeDefaultExpandAll="true"
              disabled={disabled}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {renderTreeNodes(deptTrees)}
            </TreeSelect>
          )}
        </FormItem>
      )
    }
  }
}

export default MatrixGroupTree
