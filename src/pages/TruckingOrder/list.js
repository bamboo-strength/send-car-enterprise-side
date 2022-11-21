import React, { PureComponent } from 'react';
import { Row, Button, Form, Icon } from 'antd';
import router from 'umi/router';
import { Modal, NavBar, Toast, Card, WhiteSpace } from 'antd-mobile';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
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

  search = () => {}

  render() {
    const { resultData, expand } = this.state;
    const { form } = this.props;
    return (
      <div>
        <NavBar
          mode="light"
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
            title="派车单查询"
            className={styles['ou-modal']}
            transparen
            maskClosable
            onClose={() => this.toggle()}
            popup
            animationType='slide-down'
            platform='android'
          >
            <Row>
              <MatrixMobileInput id='vehicleNo' label='车号' labelNumber={8} placeholder='请输入车号' form={form} />
              <MatrixMobileInput id='driverName' label='司机姓名' labelNumber={8} placeholder='请输入司机姓名' className='list-class' form={form} />
              <MatrixMobileInput id='driverPhone' label='手机号' labelNumber={8} placeholder='请输入手机号' className='list-class' form={form} />
            </Row>
            <div style={{ marginTop: '8px', float: 'right' }}>
              <Button type="primary" size='small' inline onClick={() => this.search()} style={{ marginLeft: '8px' }}>查询</Button>
              <Button type="primary" size='small' inline onClick={() => this.search('reset')} style={{ marginLeft: '15px' }}>重置</Button>
            </div>
          </Modal>
        }
      </div>
    );
  }
}

export default TruckingOrderList;
