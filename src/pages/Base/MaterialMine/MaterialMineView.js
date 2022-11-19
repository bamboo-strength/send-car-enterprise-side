import React, { PureComponent } from 'react';
import { Form, Card } from 'antd';
import { connect } from 'dva';
import { Icon, NavBar } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { MATERIALMINE_DETAIL } from '@/actions/materialMine';

const FormItem = Form.Item;
@connect(({ materialMine, loading }) => ({
  materialMine,
  loading: loading.models.materialMine,
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
    dispatch(MATERIALMINE_DETAIL(id));
  }

  render() {
    const {
      materialMine: { detail },
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
          onLeftClick={() => router.push('/base/materialMine')}
        >查看物资计划信息
        </NavBar>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false} style={{paddingBottom:'120px'}}>
            <FormItem {...formItemLayout} label="物资">
              <span>{detail.materialnoName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="矿点">
              <span>{detail.minecodeName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="规格">
              <span>{detail.specName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label='产品介绍'>
              <div style={{wordBreak:'break-all'}}>{detail.remark}</div>
            </FormItem>
            <FormItem {...formItemLayout} label="计划日期车数">
              <div style={{wordBreak:'break-all'}}>{detail.materialDetailALL}</div>
            </FormItem>
          </Card>
        </Form>
      </div>
    );
  }
}
export default CodeView;
