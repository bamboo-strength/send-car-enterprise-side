import React, { PureComponent } from 'react';
import { Form, Card, Button, Row, Col } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import { USER_DETAIL } from '../../../actions/user';
import styles from '../../../layouts/Sword.less';
import { tenantMode } from '../../../defaultSettings';

const FormItem = Form.Item;

@connect(({ user }) => ({
  user,
}))
@Form.create()
class UserView extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(USER_DETAIL(id));
  }

  handleEdit = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`/system/user/edit/${id}`);
  };

  render() {
    const {
      user: { detail },
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
      <Panel title="查看用户" back="/system/user" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
                <FormItem label="登录账号：">
                  <span>{detail.account}</span>
                </FormItem>
            {tenantMode ? (
                  <FormItem label="所属租户：">
                    <span>{detail.tenantId}</span>
                  </FormItem>
            ) : null}
                <FormItem label="用户昵称：">
                  <span>{detail.name}</span>
                </FormItem>
                <FormItem label="用户姓名：">
                  <span>{detail.realName}</span>
                </FormItem>
                <FormItem label="所属角色：">
                  <span>{detail.roleName}</span>
                </FormItem>
                <FormItem label="所属机构：">
                  <span>{detail.deptName}</span>
                </FormItem>
                <FormItem label="手机号码：">
                  <span>{detail.phone}</span>
                </FormItem>
                <FormItem label="电子邮箱：">
                  <span>{detail.email}</span>
                </FormItem>
                <FormItem label="用户性别：">
                  <span>{detail.sexName}</span>
                </FormItem>
                <FormItem label="用户生日：">
                  <span>{detail.birthday}</span>
                </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default UserView;
