import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Row, Col } from 'antd';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { LOG_DETAIL } from '@/actions/LogActions';


const FormItem = Form.Item;
@connect(({ mylog, loading }) => ({
  mylog,
  loading: loading.models.mylog,
}))

class LogView extends PureComponent {

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    dispatch(LOG_DETAIL(id));
  }

  render() {
    const {
      mylog: { detail },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <Panel title="查看" back="/base/log">
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <Card title="日志信息详情" className={styles.card} bordered={false}>

            <Row gutter={20}>

              <Col span={10}>
                <FormItem {...formItemLayout} label="租户ID">
                  <span>{detail.tenantId}</span>
                </FormItem>
              </Col>

              <Col span={10}>
                <FormItem {...formItemLayout} label="日志类型">
                  <span>{detail.logtype}</span>
                </FormItem>
              </Col>

              <Col span={10}>
                <FormItem {...formItemLayout} label="操作">
                  <span>{detail.operation}</span>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="创建人">
                  <span>{detail.createUser}</span>
                </FormItem>
              </Col>

              <Col span={15}>
                <FormItem {...formItemLayout} label="修改前数据">
                  <span>{detail.befor}</span>
                </FormItem>
              </Col>

              <Col span={15}>
                <FormItem {...formItemLayout} label="修改后数据">
                  <span>{detail.after}</span>
                </FormItem>
              </Col>

              <Col span={10}>
                <FormItem {...formItemLayout} label="创建部门">
                  <span>{detail.createDept}</span>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="创建时间">
                  <span>{detail.createTime}</span>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="修改人">
                  <span>{detail.updateUser}</span>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="修改时间">
                  <span>{detail.updateTime}</span>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="状态">
                  <span>{detail.status}</span>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="机构">
                  <span>{detail.deptId}</span>
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="执行类">
                  <span>{detail.executes}</span>
                </FormItem>
              </Col>

            </Row>

          </Card>

        </Form>
      </Panel>
    );
  }
}
export default LogView;
