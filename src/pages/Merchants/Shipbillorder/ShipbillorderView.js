import React, { PureComponent } from 'react';
import { Form, Card, Col } from 'antd';
import { connect } from 'dva';
import { Icon, NavBar } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { SHIPBILLORDER_DETAIL } from '@/actions/shipbillorder';

const FormItem = Form.Item;

@connect(({ shipbillorder, loading }) => ({
  shipbillorder,
  loading: loading.models.shipbillorder,
}))
@Form.create()
class CodeView extends PureComponent {

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(SHIPBILLORDER_DETAIL(id));
  }

  render() {
    const {
      shipbillorder: { detail },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 15 },
        sm: { span: 11 },
        md: { span: 9 },
      },
    };

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/shipbill/shipbillorder')}
        >查看委托单按订单
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="发货方所属租户">
                  <span>{detail.tenantIdName}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="承运商">
                  <span>{detail.carrierIdName}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="订单号">
                  <span>{detail.billno}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="委托类型">
                  <span>{detail.carrTypeName}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="委托来源">
                  <span>{detail.isfactoryName}</span>
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

export default CodeView;
