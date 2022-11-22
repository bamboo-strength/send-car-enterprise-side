import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Icon } from 'antd';
import router from 'umi/router';
import { Modal, NavBar, Toast, Card, WhiteSpace } from 'antd-mobile';
import MatrixInput from '@/components/Matrix/MatrixInput';
import styles from './index.less';

@Form.create()
class TruckingOrderList extends PureComponent {
  state = {
    resultData: {},
    expand: false
  };

  // 查询弹出框状态控制
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  CreateFormManFun = () => {

  }

  handleSearch = () => {
    const { form } = this.props;
    const values = form.getFieldsValue();
  }

  reset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { resultData, expand } = this.state;
    const { form } = this.props;
    return (
      <div>
        <NavBar
          mode="light"
          style={{ zIndex: 1000 }}
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/function')}
          rightContent={[
            <Icon
              key="0"
              type="search"
              style={{ fontSize: '18px' }}
              onClick={() => this.toggle()}
            />
          ]}
        >
          <span className={styles.trader}>派车单查询</span>
        </NavBar>
        <div />
        {
          expand &&
          <Modal
            visible={expand}
            style={{ marginTop: 45 }}
            transparen
            maskClosable
            onClose={() => this.toggle()}
            popup
            animationType='slide-down'
            platform='android'
          >
            <Col span={24} style={{ padding: 12 }}>
              <MatrixInput label='合同编号' id='current' form={form} />
            </Col>
            <Col span={24} style={{ padding: 12 }}>
              <Button type="primary" onClick={() => this.handleSearch()} style={{ marginLeft: '8px' }}>查询</Button>
              <Button onClick={() => this.reset()} style={{ marginLeft: '15px' }}>重置</Button>
            </Col>
          </Modal>
        }
      </div>
    );
  }
}

export default TruckingOrderList;
