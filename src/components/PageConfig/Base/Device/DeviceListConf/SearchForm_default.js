import React, { PureComponent } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';

const FormItem = Form.Item;

class SearchForm_default extends PureComponent {


  render() {

    const {parentProps,parentFuncs} = this.props;

    const {
      form,
      device: {
        init: { devicetypeName,deviceStatusName,moinDeviceTypeName},
      },
    } = parentProps;

    const { getFieldDecorator } = form;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="设备编号">
            {getFieldDecorator('deviceno')(<Input placeholder="请输入设备号查询" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="设备类型">
            {getFieldDecorator('devicetype')(
              <Select placeholder="请选择设备类型查询">
                <Select.Option key="devicetype" value="">
                  全部
                </Select.Option>
                {devicetypeName.map(d => (
                  <Select.Option key={d.dictKey} value={d.dictKey}>
                    {d.dictValue}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="设备状态">
            {getFieldDecorator('deviceStatus')(
              <Select placeholder="请选择设备状态查询">
                <Select.Option key='deviceStatus' value="">
                  全部
                </Select.Option>
                {deviceStatusName.map(d => (
                  <Select.Option key={d.dictKey} value={d.dictKey}>
                    {d.dictValue}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="监控类型">
            {getFieldDecorator('moindevicetype')(
              <Select placeholder="请选择监控类型查询">
                <Select.Option key='moindevicetype' value="">
                  全部
                </Select.Option>
                {moinDeviceTypeName.map(d => (
                  <Select.Option key={d.dictKey} value={d.dictKey}>
                    {d.dictValue}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col>
          <div style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={parentFuncs.onReset}>
              重置
            </Button>
          </div>
        </Col>
      </Row>
    );
  }
}
export default SearchForm_default;
