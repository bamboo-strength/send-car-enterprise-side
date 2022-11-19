import React, { PureComponent } from 'react';
import { TreeSelect } from 'antd';
import func from '@/utils/Func';
import { getTenantId } from '../../pages/Merchants/commontable';
import { tree } from '@/services/dept';
import styles from '@/global.less';

const { TreeNode } = TreeSelect;

class MatrixMobileGroupTree extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      deptTrees: [],
    };
  }

  componentDidMount = () => {
    const param = {};
    param['Blade-DesignatedTenant'] = getTenantId();
    param.tenantId = getTenantId();
    tree(param).then(resp => {
      if (func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
        this.setState({ deptTrees: resp.data });
      }
    });
  };

  textAreaValidator = (rule, val, callback) => {
    if (!val) {
      callback();
    }
    callback();
  };

  render() {
    const { label, id, required, query, style, placeholder, rules, initialValue, onChange, form, xs, disabled, dictCode, labelNumber } = this.props;
    const { getFieldDecorator, getFieldError } = form;
    const { deptTrees } = this.state;
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
              query ? (
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={deptTrees}
                  allowClear
                  treeNodeFilterProp="title"
                  placeholder={placeholder}
                  style={style}
                  onChange={onChange}
                  treeCheckable={!(dictCode && dictCode === 'single')}
                  treeDefaultExpandAll="true"
                  disabled={disabled}
                  className="mobile-select"
                />
              ) : (
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  allowClear
                  treeNodeFilterProp="title"
                  placeholder={placeholder}
                  style={style}
                  onChange={onChange}
                  treeDefaultExpandAll="true"
                  disabled={disabled}
                  className="mobile-select"
                >
                  {renderTreeNodes(deptTrees)}
                </TreeSelect>
              ),
            )}
          </div>
        </div>
        {
          !!getFieldError(id) === true && <div className={`am-list-item ${styles.errorlistItem}`}><div className={`am-input-label am-input-label-${labelNumber}`} />{getFieldError(id)}</div>
        }
      </div>
    );
  }
}

export default MatrixMobileGroupTree;
