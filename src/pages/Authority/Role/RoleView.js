import React, { PureComponent } from 'react';
import { Form, Card, Button, Row, Col } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import { ROLE_DETAIL } from '../../../actions/role';
import styles from '../../../layouts/Sword.less';

const FormItem = Form.Item;

@connect(({ role }) => ({
  role,
}))
@Form.create()
class RoleView extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(ROLE_DETAIL(id));
  }

  handleEdit = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`/authority/role/edit/${id}`);
  };

  render() {
    const {
      role: { detail },
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
      <Panel title="查看角色" back="/authority/role" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
                <FormItem label="角色名称：">
                  <span>{detail.roleName}</span>
                </FormItem>
                <FormItem label="角色别名：">
                  <span>{detail.roleAlias}</span>
                </FormItem>
                <FormItem label="上级角色：">
                  <span>{detail.parentName}</span>
                </FormItem>
                <FormItem label="角色排序：">
                  <span>{detail.sort}</span>
                </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default RoleView;
