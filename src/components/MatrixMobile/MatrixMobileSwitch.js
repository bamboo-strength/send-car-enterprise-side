import React, { PureComponent } from 'react';
import { List, Switch } from 'antd-mobile';

export default class MatrixMobileSwitch extends PureComponent {


  render() {
    const {
      form, label, id, className, onChange,initialValue
    } = this.props;
    const { getFieldProps } = form;
    return (
      <div className={className}>
        <List.Item
          extra={<Switch
            {...getFieldProps(id, {
              valuePropName: 'checked',
              initialValue,
              onChange: (val) => {
                if (typeof onChange === 'function') {
                  onChange(val);
                }
              },
            })}
          />}
        >{label}：
        </List.Item>
      </div>
    );
  }

}

