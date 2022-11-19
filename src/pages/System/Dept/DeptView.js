import React, { PureComponent } from 'react';
import { Form, Card, Button, Row, Col } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import { DEPT_DETAIL } from '../../../actions/dept';
import styles from '../../../layouts/Sword.less';

const FormItem = Form.Item;

@connect(({ dept }) => ({
  dept,
}))
@Form.create()
class DeptView extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(DEPT_DETAIL(id));
  }

  handleEdit = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`/system/dept/edit/${id}`);
  };

  render() {
    const {
      dept: { detail },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleEdit}>
        修改
      </Button>
    );

    return (
      <Panel title="查看机构" back="/system/dept" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <FormItem label="机构名称">
              <span>{detail.deptName}</span>
            </FormItem>
            <FormItem label="机构全称">
              <span>{detail.fullName}</span>
            </FormItem>
            <FormItem label="上级机构">
              <span>{detail.parentName}</span>
            </FormItem>
            <FormItem label="机构类型">
              <span>{detail.deptCategoryName}</span>
            </FormItem>
          </Card>
          <br />
          <Card title="其他信息" className={styles.card} bordered={false}>
            <FormItem {...formAllItemLayout} label="机构排序">
              <span>{detail.sort}</span>
            </FormItem>
            <FormItem {...formAllItemLayout} label="机构备注">
              <span>{detail.remark}</span>
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default DeptView;
