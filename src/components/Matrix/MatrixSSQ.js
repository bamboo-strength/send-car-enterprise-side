import React, { PureComponent } from 'react';
import { Form, Cascader, Input, Col } from 'antd';
import {rTree} from '@/services/RegionService';
import func from '@/utils/Func';
import { project } from '@/defaultSettings';

export default class MM  extends PureComponent{ // 区域选择组件/其他配置
  state = {
    regionTree: [],
    province: '',
    city: '',
    district: '',
  };

  async componentDidMount () {
    const param = { code: "100000",tenantId:'764537' }
    const {needDistrict,renderData} = this.props
    if(renderData){
      this.setState({
        regionTree:renderData
      })
    }else {
      const resp = await rTree(param)
      if (resp === undefined || resp.data.length<1){
        return
      }
      const tree1 = resp.data[0].children.map(function(value) {
        // 从省一级开始显示省市区信息
        if(value.children === undefined){
          return {
            id : value.id,
            label : value.title,
            value : value.title,
          };
        }
        const { title } = value;
        return {
          id : value.id,
          label : title,
          value : title,
          children : value.children.map(function(provinceValues) {
            if(provinceValues.children === undefined || (project==='kspt' && !needDistrict)){
              return {
                id : provinceValues.id,
                label : provinceValues.title,
                value : provinceValues.title,
              }
            }
            return {
              id : provinceValues.id,
              label : provinceValues.title,
              value : provinceValues.title,
              children : provinceValues.children.map(function(cityValues) {
                if(cityValues.children === undefined){
                  return {
                    id : cityValues.id,
                    label : cityValues.title,
                    value : cityValues.title,
                  }
                }
                return {
                  id : cityValues.id,
                  label : cityValues.title,
                  value : cityValues.title,
                  children : cityValues.children.map(function(districtValue) {
                    return {
                      id: districtValue.id,
                      label : districtValue.title,
                      value : districtValue.title,
                    }
                  }),
                }
              }),
            }
          }),
        }
      });
      this.setState({
        regionTree:tree1
      })
    }
  };


  textAreaValidator = (rule, val, callback) => {
    if (!val) {
      callback();
    }
    callback();
  }

  cascaderonChange = (value, selectedOptions) => {
    let province=''
    let city=''
    let district=''
      if(selectedOptions.length>0){
        if (selectedOptions.length >0 && selectedOptions[0].id!==null ){
          province =selectedOptions[0].id
          city=''
          district=''
        }
        if (selectedOptions.length >1 && selectedOptions[1].id!==null){
          province=selectedOptions[0].id
          city=selectedOptions[1].id
           district=''
        }
        if (selectedOptions.length >2 &&selectedOptions[2].id!==null){
          province=selectedOptions[0].id
          city=selectedOptions[1].id
          district=selectedOptions[2].id
        }
      }

    const {onChange} = this.props
    this.setState({
      province,
      city,
      district
    },()=>{
      if (typeof onChange === 'function'){
        onChange()
      }
    })
  }

  cascaderFilter= (inputValue, path) => {
    // console.log(inputValue,path);
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }


  render() {
    const FormItem = Form.Item;
    const {label,labelId,id,required,placeholder,defaultValue,style ,form,defaultCodeValue,xs,needDistrict} = this.props
    let areas=[]
    if(func.notEmpty(defaultValue) && defaultValue.includes('/')){
      areas=defaultValue.split('/').map(function(value) {
        return value;
      });
    }
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
    const { province, city, district,regionTree } = this.state;
    // console.log(city,defaultCodeValue,areas)
    const checkRule =
      {
        rules: [
          {
            required,
            message:  placeholder || "不能为空",
          },
          { validator: (rule, value, callback) => this.textAreaValidator(rule, value, callback) },
        ],
        initialValue:areas
      }
    return(
      <div>
        <FormItem {...formItemLayout} label={label}>
          {getFieldDecorator(labelId, checkRule)
          (
            <Cascader
              // fieldNames={{ label: 'date', value: 'date', children: 'children' }}
              options={regionTree}
              onChange={this.cascaderonChange}
              allowClear
              placeholder={placeholder}
              expandTrigger="hover"
              showSearch={this.cascaderFilter}
              style={style}
            />
          )}
        </FormItem>
        <Col span={10} style={{display: 'none'}}>
          {/* <FormItem {...formItemLayout} label="省">
            {getFieldDecorator(`${id}province`,{
              initialValue: province
            })(<Input placeholder="请选择省" readOnly="readOnly" />)}
          </FormItem> */}
          {
            !needDistrict ? // 是否需要三级区域
              <FormItem {...formItemLayout} label="市">
                {getFieldDecorator(id,{
                  initialValue: func.notEmpty(city)?city:defaultCodeValue
                })(<Input placeholder="请选择市" readOnly="readOnly" />)}
              </FormItem>:
              <FormItem {...formItemLayout} label="区">
                {getFieldDecorator(id,{
                    initialValue: district
                  }
                )(<Input placeholder="请选择区" readOnly="readOnly" />)}
              </FormItem>
          }
        </Col>
      </div>
    )
  }
}
