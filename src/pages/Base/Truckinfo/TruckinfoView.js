import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Form, Card, Col } from 'antd';
import { connect } from 'dva';
import { Icon, NavBar } from 'antd-mobile';
import styles from '../../../layouts/Sword.less';
import { TRUCKINFO_DETAIL } from '../../../actions/truckinfo';

const FormItem = Form.Item;

@connect(({ truckinfo }) => ({
  truckinfo,
}))
@Form.create()
class TruckinfoView extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(TRUCKINFO_DETAIL(id));
  }

  render() {
    const {
      truckinfo: { detail },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 9 },

      },
      wrapperCol: {
        xs: { span: 15 },
      },
    };

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/base/truckinfo')}
        >查看车辆信息
        </NavBar>
        <div className='am-list'>
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="车号">
                  <span>{detail.truckno}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="车轴数">
                  <span>{detail.axlesName}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="司机姓名">
                  <span>{detail.drivername}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="司机身份证">
                  <span>{detail.driveridno}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="司机手机号">
                  <span>{detail.phone}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="备注">
                  <span>{detail.remark}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="创建人">
                  <span>{detail.createUserName}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="创建时间">
                  <span>{detail.createTime}</span>
                </FormItem>
              </Col>
            </Card>
          </Form>
        </div>
      </div>
    );
  }
}

export default TruckinfoView;
