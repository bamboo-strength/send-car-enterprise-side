import React, { PureComponent } from 'react';
import { Input, Select } from 'antd';
import '../../global.less';
import { getTenantId } from '@/pages/Merchants/commontable';
import func from '@/utils/Func';
import { autocomplete } from '@/services/matrixCommon';
import { requestListApi, requestPostHeader } from '@/services/api';
import { dict } from '@/services/dict';
import _ from 'lodash';
import styles from '@/global.less';

const { Option } = Select;

export default class MatrixMobileSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      renderStatus: false,
    };
  }

  componentWillMount = () => {
    const { dictCode, options, initialValue, labelId, form, id,custom,name,deptCategory } = this.props;
    const ops = [];
    const param = {};
    param['Blade-DesignatedTenant'] = getTenantId();
    param.tenantId = getTenantId();
    if (func.isEmpty(options) && dictCode.includes('ByFunc')) {
      param.sortl = '';
      param.type = dictCode;
      autocomplete(param).then(resp => {
        if (func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
          resp.data.forEach(function(element) {
            ops.push(<Option key={element.code}>{element.name}</Option>);
          });
        }
        this.setState({ result: ops });
      });
    } else if (func.isEmpty(options) && dictCode.includes('/')) { // 从后台查询数据后赋值
      const dictCodelen = dictCode.split(',')
      if (dictCode.includes(',') && dictCodelen.length === 3 ) {
        const dictCodes = dictCode.split(','); // 通用功能使用
        requestPostHeader('/api/mer-tableextend/commonBusiness/queryData', {
          'tableName': dictCodes[0],
          'modulename': dictCodes[1],
          'btnCode': id,
        }).then(resp => {
          if (resp.success && resp.data.data.length > 0) {
            resp.data.data.forEach(function(element) {
              ops.push(<Option key={element.discountNm}>{element.discountName}</Option>);
            });
            this.setState({ result: ops });
          }
        });
      } else if (dictCode.includes(',') && dictCodelen.length === 4){
        // dictkey改为用逗号分开的四个 分别是 取值key,取值value,请求路径，请求param
        // 例：dictKey,dictValue,/api/mer-driver-vehicle/dictBiz/dictionary,code|axles
        const [key, value, path, parameter] = dictCodelen;
        const [label, values] = parameter.split('|');
        /* 自定义接口和传递的参数 */
        requestListApi(path, { [label]: values, }).then(resp => {
          if (resp.success) {
            const data = resp.data?.data || resp.data.records;
            data.forEach(function(element) {
              ops.push(<Option key={element[key]}>{element[value]}</Option>);
            });
            this.setState({ result: ops });
          }
        });
      } else if (custom) {
        /* 自定义接口和传递的参数 */
        requestListApi(dictCode, custom).then(resp => {
          if (resp.success) {
            resp.data.records.forEach(function(element) {
              ops.push(<Option key={element.id}>{element[name]}</Option>);
            });
            this.setState({ result: ops });
          }
        });
      } else {
        const params = {
          ...param,
          deptCategory:deptCategory||null
        }
        requestListApi(dictCode, params).then(resp => {
          if (resp.success && resp.data.length > 0) {
            resp.data.forEach(function(element) {
              ops.push(<Option key={element.id}>{element.name ? element.name : element.title}</Option>);
            });
            if (func.notEmpty(initialValue) && func.notEmpty(labelId)) {
              form.setFieldsValue(
                { [labelId]: resp.data[0].title },
              );
            }
            this.setState({ result: ops });
          }
        });
      }
    } else if (options === undefined && !dictCode.includes('ByFunc')) {
      param.code = dictCode;
      dict(param).then(resp => {
        if (resp.success && resp.data.length > 0) {
          resp.data.forEach(function(element) {
            ops.push(<Option key={element.dictKey}>{element.dictValue}</Option>);
          });
          if (func.notEmpty(initialValue) && func.notEmpty(labelId)) {
            form.setFieldsValue(
              { [labelId]: resp.data[0].dictValue },
            );
          }
          this.setState({ result: ops });
        }
      });
    } else {
      options.forEach(function(element) {
        ops.push(<Option key={element.key}>{element.value}</Option>);
      });
      this.setState({ result: ops });
    }
  };

  componentWillReceiveProps(nextProps) {  // 外部修改对下拉框数据的改变
    const { form, dictCode, bringData, id,options,name } = nextProps;
    const { renderStatus } = this.state;
    let ops = [];
    let paramNullValus = 0;
    if (bringData && bringData.includes('|')) {
      const param = {};
      param['Blade-DesignatedTenant'] = getTenantId();
      param.tenantId = getTenantId();
      param.sortl = '';
      param.type = dictCode;
      const aa = bringData.split('|'); //  |分开 第一部分是需要传的参数 后一部分是要赋值的字段
      aa[0].split(',').map((item) => {
        if (item.includes('WithParam')) { // 说明该下拉框需要获取外边的值重新渲染下拉框内容
          const realColumn = item.replace('WithParam', '');
          param[realColumn] = form.getFieldValue(realColumn);
          if (func.isEmpty(form.getFieldValue(realColumn))) { // 参数值为空时
            paramNullValus++;
            this.setState({
              renderStatus: true,
              result: [],
            }, () => {
              const tt = form.getFieldsValue([id])[id];
              if (tt) {
                form.setFieldsValue({
                  [id]: '',
                });
                aa[1].split(',').map((vv, index) => {
                  form.setFieldsValue({
                    [vv]: '',
                  });
                });
              }
            });
          }
        }
      });
      if (renderStatus && paramNullValus === 0) {
        ops = [];
        autocomplete(param).then(resp => {
          if (func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
            resp.data.forEach(function(element) {
              ops.push(<Option key={element.code}>{element.name}</Option>);
            });
          } else {
            ops = [];
          }
          this.setState({
            result: ops,
            renderStatus: false,
          });
        });
      }

    }
    if(!_.isEqual(options, this.props.options)&&options){
      options.forEach(function(element) {
        ops.push(<Option key={element.id}>{element[name]}</Option>);
      });
      this.setState({ result: ops })
    }
  }


  changea = (v, o) => {
    const { bringData, labelId, form, onSelect, dataType, dictCode } = this.props;

    if (bringData && bringData.includes('|')) {
      this.setState({
        renderStatus: false,
      });
    }
    if (func.notEmpty(labelId)) {
      form.setFieldsValue(
        { [labelId]: o.props.children },
      );
    }
    if (bringData) {  // 需要查找带回
      const param = { 'sortl': dataType !== 'vehicleno' ? v : o.props.children, 'type': dataType };
      param['Blade-DesignatedTenant'] = getTenantId();
      param.tenantId = getTenantId();
      param.type = dictCode;
      if (bringData.includes('|')) {
        const aa = bringData.split('|'); //  |分开 第一部分是需要传的参数 后一部分是要赋值的字段
        aa[0].split(',').map((item) => {
          if (item.includes('WithBringParam')) {
            const realColumn = item.replace('WithBringParam', '');
            param[realColumn] = form.getFieldValue(realColumn);
          }
        });
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
      } else {
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
    if (typeof onSelect === 'function') {
      onSelect(v, o);
    }

  };

  textAreaValidator = (rule, val, callback) => {
    if (!val) {
      callback();
    }
    callback();
  };

  render() {
    const {
      label, id, required, style, placeholder, rules, initialValue, disabled, labelId, labelNumber,
      onBlur, onChange, onFocus, onSearch, form, allowClear,showAllDefault
    } = this.props;
    const { getFieldDecorator ,getFieldError} = form;
    const { result } = this.state;
    const checkRule =
      {
        rules: [
          {
            required,
            message: placeholder || '不能为空',
          },
          {
            pattern: /^[^\s]*$/,
            message: '禁止输入空格',
          },
          { validator: (rule, value, callback) => this.textAreaValidator(rule, value, callback) },
        ],
        initialValue: func.notEmpty(initialValue) ? `${initialValue}` : undefined,
      };

    for (const index in rules) {
      checkRule.rules.push(rules [index]);
    }
    return (
      <div className='list-class' style={{ position: 'relative' }}>
        <div className="am-list-item am-list-item-middle" style={{ height: 'auto !important' }}>
          <div className='am-list-line'>
            <div className={`am-input-label am-input-label-${labelNumber}`}>{required ?
              <span style={{ color: 'red' }}>*</span> : ''} {label}：
            </div>
            {getFieldDecorator(id, checkRule)
            (
              <Select
                style={style}
                placeholder={placeholder}
                className="mobile-select"
                onBlur={() => {
                  if (typeof onBlur === 'function') {
                    onBlur();
                  }
                }}
                onChange={onChange}
                onSearch={onSearch}
                onFocus={onFocus}
                onSelect={(v, o) => this.changea(v, o)}
                disabled={disabled}
                allowClear={allowClear}
              >
                {showAllDefault?<Option key=' ' value={required ? '-1':''}>全部</Option>:undefined}
                {result}
              </Select>,
            )}
            {
              func.notEmpty(labelId) ?
                getFieldDecorator(labelId)(<Input style={{ display: 'none' }} />) : undefined
            }
          </div>
        </div>
        {/* { */}
        {/*  !!getFieldError(id) === true && <div className={styles.inputError}>{getFieldError(id)}</div> */}
        {/* } */}
        {
          !!getFieldError(id) === true && <div className={`am-list-item ${styles.errorlistItem}`}><div className={`am-input-label am-input-label-${labelNumber}`} /> {getFieldError(id)}</div>
        }
      </div>
    );
  }
}
