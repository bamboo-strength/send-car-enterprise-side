import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'antd';
import { dict } from '../../services/dict';
import func from '@/utils/Func';
import { getTenantId } from '../../pages/Merchants/commontable';
import { autocomplete } from '../../services/matrixCommon';
import { requestListApi, requestPostHeader } from '../../services/api';

const { Option } = Select;


 class MatrixSelect extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      result:[],
      renderStatus:false
    };
  }

  componentWillMount = () => {
    const { dictCode, options ,initialValue,labelId,form,id} = this.props;
    const ops = [];
    const param = {}
    param['Blade-DesignatedTenant'] = getTenantId()
    param.tenantId = getTenantId()
    // console.log(labelId,dictCode,'====')
    if(dictCode.includes('ByFunc')){
      param.sortl=''
      param.type = dictCode
      autocomplete(param).then(resp => {
        if(func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}'){
          resp.data.forEach(function(element) {
            ops.push(<Option key={element.code}>{element.name}</Option>);
          });
        }
        this.setState({ result: ops })
      });
    }else if(dictCode.includes('/')){ // 从后台查询数据后赋值
      if(dictCode.includes(',')){
        const [tableNameOrpath,modulename,keyOrvalue,serarchParam] = dictCode.split(',') // 通用功能使用
        const [keyParam,valueParam] = keyOrvalue?keyOrvalue.split('|'):['discountNm','discountName']
        const params = {}
        if(serarchParam){
          params[serarchParam] = form.getFieldValue(serarchParam)
        }
        if(dictCode.includes('/abnormal')){ // 例如：path,'',key以及param,要传给后台的参数,/abnormal
          requestListApi(tableNameOrpath,params).then(resp => {
            if(resp.success && resp.data.length>0){
              resp.data.forEach(function(element) {
                ops.push(<Option key={element[keyParam]} obj={element}>{element[valueParam]}</Option>);
              });
              if(func.notEmpty(initialValue) && func.notEmpty(labelId)){
                form.setFieldsValue(
                  {[labelId]:resp.data[0].title}
                )
              }
              this.setState({ result: ops })
            }
          })
        }else { // 例如：tableName,byMoney,key以及param,要传给后台的参数,/
          requestPostHeader('/api/mer-tableextend/commonBusiness/queryData', {tableNameOrpath,modulename,'btnCode':id,...params })
            .then(resp=>{
              if (resp.success && resp.data.data.length>0) {
                resp.data.data.forEach(function(element) {
                  ops.push(<Option key={element[keyParam]}>{element[valueParam]}</Option>);
                });
                this.setState({ result: ops })
              }
            })
        }

      }else {
        const {keyParam,valueParam} = this.props
        requestListApi(dictCode,param).then(resp => {
          if(resp.success && resp.data.length>0){
            resp.data.forEach(function(element) {
              ops.push(<Option key={keyParam?element[keyParam]:element.id}>{element.name?element.name:element.title?element.title:element[valueParam]}</Option>);
            });
            if(func.notEmpty(initialValue) && func.notEmpty(labelId)){
              form.setFieldsValue(
                {[labelId]:resp.data[0].title}
              )
            }
            this.setState({ result: ops })
          }
        })
      }
    } else if(!dictCode.includes('ByFunc')) {
      param.code = dictCode
      dict(param).then(resp => {
        if(resp.success && resp.data.length>0){
          resp.data.forEach(function(element) {
            ops.push(<Option key={element.dictKey}>{element.dictValue}</Option>);
          });
          if(func.notEmpty(initialValue) && func.notEmpty(labelId)){
            form.setFieldsValue(
              {[labelId]:resp.data[0].dictValue}
            )
          }
          this.setState({ result: ops })
        }
      });
    } else {
      options.forEach(function(element) {
        ops.push(<Option key={element.key}>{element.value}</Option>);
      });
      this.setState({ result: ops })
    }
  }

    componentWillReceiveProps(nextProps) {  // 外部修改对下拉框数据的改变
      const {form,dictCode,bringData,id,disabled} = nextProps
      const {renderStatus} = this.state
     //  console.log(renderStatus,nextProps,this.props)
      let ops = [];
      let paramNullValus =0
      if(bringData && bringData.includes('|') && !disabled){
        const param = {}
        param['Blade-DesignatedTenant'] = getTenantId()
        param.tenantId = getTenantId()
        param.sortl=''
        param.type = dictCode
        const aa = bringData.split('|') //  |分开 第一部分是需要传的参数 后一部分是要赋值的字段
        aa[0].split(',').map((item) => {
          if(item.includes('WithParam')){ // 说明该下拉框需要获取外边的值重新渲染下拉框内容
            const realColumn = item.replace('WithParam','')
            param[realColumn] = form.getFieldValue(realColumn)
            // console.log(form.getFieldValue(realColumn),bringData,'=====')
            if(func.isEmpty(form.getFieldValue(realColumn)) ){ // 参数值为空时
              paramNullValus ++
              this.setState({
                renderStatus:true,
                result:[]
              },()=>{
                const  tt = form.getFieldsValue([id])[id]
                if(tt){
                  form.setFieldsValue({
                    [id]:''
                  })
                  aa[1].split(',').map((vv, index) => {
                    form.setFieldsValue({
                      [vv]: '',
                    });
                  });
                }
              })
            }
          }
        })
        if(renderStatus && paramNullValus === 0){
          ops = [];
          autocomplete(param).then(resp => {
            if(func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}'){
              resp.data.forEach(function(element) {
                ops.push(<Option key={element.code}>{element.name}</Option>);
              });
            }else{
              ops=[];
            }
            this.setState({
              result: ops,
              renderStatus:false,
            })
          });
        }

      }
   }

   changea= (v,o)=>{
     const {labelId,form,onSelect,dataType,dictCode,bringData} =this.props
     if(bringData && bringData.includes('|')){
     this.setState({
       renderStatus:false
     })
      }
      if (func.notEmpty(labelId)) {
       form.setFieldsValue(
         {[labelId]:o.props.children}
       )
     }
     if (bringData) {  // 需要查找带回
       if(o.props.obj){
          const {obj} = o.props
         Object.keys(JSON.parse(bringData)).map(key => {
           let keyValue = key
           if(labelId.includes('.')){
             const [xiabiao] = labelId.split('.')
             keyValue = `${xiabiao}.${key}`
           }
           form.setFieldsValue({
             [keyValue] :obj[JSON.parse(bringData)[key]]
           })
         })
       }else {
         const param = { 'sortl': dataType !== 'vehicleno' ? v : o.props.children, 'type': dataType };
         param['Blade-DesignatedTenant'] = getTenantId();
         param.tenantId = getTenantId();
         param.type = dictCode
         if(bringData.includes('|')){
           const aa = bringData.split('|') //  |分开 第一部分是需要传的参数 后一部分是要赋值的字段
           aa[0].split(',').map((item) => {
             if(item.includes('WithBringParam')) {
               const realColumn = item.replace('WithBringParam','')
               param[realColumn] = form.getFieldValue(realColumn)
             }
           })
           requestListApi('/api/mer-tableextend/sortl/getBringData', param).then(resp => {
             if (resp.success) {
               const detail = resp.data;
               aa[1].split(',').map((vv, index) => {
                 form.setFieldsValue({
                   [vv]: `${detail[vv]}`,
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
                   [vv]: `${detail[vv]}`,
                 });
               });
             }
           });
         }
       }
     }
     if (typeof onSelect === 'function'){
       onSelect(v,o)
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
    const {label,id,required,style,placeholder,rules,initialValue,disabled,labelId,
      onBlur,onChange,onFocus,onSearch,form,xs,allowClear,showAll} = this.props

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
    const { getFieldDecorator } = form
    const {result} =this.state
/*
    result.unshift(<Option key=' '>全部</Option>)
*/
    // console.log(labelId,result,'====')
    const checkRule =
      {
        rules: [
          {
            required,
            message:  placeholder || "不能为空",
          },
       /*   {
            pattern: /^[^\s]*$/,
            message: '禁止输入空格',
          }, */
          { validator: (rule, value, callback) => this.textAreaValidator(rule, value, callback) },
        ],
        initialValue:initialValue?`${initialValue}`:(showAll?'':undefined)
      }
    for(const index in rules){
      checkRule.rules.push(rules [index]);
    }
    return(
      <FormItem {...formItemLayout} label={label} className='11111'>
        {getFieldDecorator(id, checkRule)
        (

          <Select
            style={style}
            placeholder={placeholder}
            className="selector"
            onBlur={()=>{if (typeof onBlur === 'function'){onBlur()}}}
            onChange={onChange}
            onSearch={onSearch}
            onFocus={onFocus}
            onSelect={(v, o)=>this.changea(v, o)}
            disabled={disabled}
            allowClear={allowClear}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {showAll?<Option key=' ' value=''>全部</Option>:undefined}
            {result}
          </Select>
        )}
        {
          func.notEmpty(labelId)?
          getFieldDecorator(labelId)(<Input style={{display:'none'}} />) :undefined
        }
      </FormItem>
    )
  }

}

export default MatrixSelect
