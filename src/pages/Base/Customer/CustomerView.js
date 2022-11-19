import React, { PureComponent } from 'react';
import { Form, Card, Col } from 'antd';
import { connect } from 'dva';
import { Icon, NavBar } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { CUSTOMER_DETAIL } from '../../../actions/customer';

const FormItem = Form.Item;

@connect(({ customer, loading }) => ({
  customer,
  loading: loading.models.customer,
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
    dispatch(CUSTOMER_DETAIL(id));
  }

  render() {
    const {
      customer: { detail },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 12 },
        md: { span: 10 },
      },
      labelAlign:'right'
    };

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/base/customer')}
        >查看客户信息
        </NavBar>
        <Form hideRequiredMark>
          <Card title="基本信息" className={styles.card} bordered={false} style={{ paddingBottom: '45px' }}>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="客户编号">
                <span>{detail.id}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="客户名称">
                <span>{detail.custname}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="客户简称">
                <span>{detail.forshort}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="检索码">
                <span>{detail.sortl}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="行业">
                <span>{detail.industryname}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="统一社会信用代码">
                <span>{detail.creditCode}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="法人代表">
                <span>{detail.corp}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="邮编">
                <span>{detail.postcode}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="传真">
                <span>{detail.fax}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="准购证编号">
                <div style={{ wordBreak: 'break-all' }}>{detail.purchaselicense}</div>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="生产许可证">
                <div style={{ wordBreak: 'break-all' }}>{detail.productlicense}</div>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="经营许可证">
                <div style={{ wordBreak: 'break-all' }}>{detail.businesslicense}</div>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="注册类型">
                <span>{detail.registerflagname}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="联系人">
                <div style={{ wordBreak: 'break-all' }}>{detail.busideptprin}</div>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="办公电话">
                <span>{detail.phone}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="联系电话">
                <span>{detail.prinphone}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="创建时间">
                <span>{detail.createTime}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="创建人">
                <span>{detail.createUserName}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="备注">
                <div style={{ wordBreak: 'break-all' }}>{detail.remark}</div>
              </FormItem>
            </Col>
          </Card>
        </Form>
      </div>
    );
  }
}

export default CodeView;
