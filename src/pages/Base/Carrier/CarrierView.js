import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card} from 'antd';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { CARRIER_DETAIL } from '@/actions/carrier';
import { Icon, NavBar } from 'antd-mobile';
import router from 'umi/router';

const FormItem = Form.Item;


@connect(({ carrier, loading })=>({
  carrier,
  loading: loading.models.carrier,
}))
@Form.create()
class CarrierView extends PureComponent {

  // 加载页面完成后，执行
  componentWillMount() {
    const {
      dispatch,
      match :{
        params:{ id },
      }
    } = this.props;
    dispatch(CARRIER_DETAIL(id));
  }

  render() {
    const {
      carrier: { detail },
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
          onLeftClick={() => router.push('/base/carrier')}
        >查看承运商
        </NavBar>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="承运商名称">
              <div style={{wordBreak:'break-all'}}>{detail.name}</div>
            </FormItem>

            <FormItem {...formItemLayout} label="简称">
              <span>{detail.shortname}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="编码">
              <span>{detail.code}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="拼音码">
              <div style={{wordBreak:'break-all'}}>{detail.spellcode}</div>
            </FormItem>
            <FormItem {...formItemLayout} label="地址">
              <div style={{wordBreak:'break-all'}}>{detail.addr}</div>
            </FormItem>
            <FormItem {...formItemLayout} label="联系人">
              {detail.contacts}
            </FormItem>
            <FormItem {...formItemLayout} label="联系人手机">
              {detail.phone}
            </FormItem>
          </Card>
        </Form>
      </div>
    );

  }

}

export default CarrierView;
