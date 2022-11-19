import React, { PureComponent } from 'react';
import { Form, Card } from 'antd';
import { connect } from 'dva';
import { Icon, NavBar } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { SHIPBILLPLAN_DETAIL } from '@/actions/shipbillplan';

const FormItem = Form.Item;
@connect(({ shipbillplan, loading }) => ({
  shipbillplan,
  loading: loading.models.shipbillplan,
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
    dispatch(SHIPBILLPLAN_DETAIL(id));
  }

  render() {
    const {
      shipbillplan: { detail },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/shipbill/shipbillplan')}
        >查看委托单按计划
        </NavBar>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="发货方所属租户">
              <span>{detail.tenantIdName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="承运商">
              <span>{detail.carrierIdName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="计划号">
              <span>{detail.billno}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="委托类型">
              <span>{detail.carrTypeName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="委托来源">
              <span>{detail.isfactoryName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="创建人">
              <span>{detail.createUserName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="创建时间">
              <span>{detail.createTime}</span>
            </FormItem>
          </Card>
        </Form>
      </div>
    );
  }
}
export default CodeView;
