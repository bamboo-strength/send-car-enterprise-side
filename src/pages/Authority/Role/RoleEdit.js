import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, InputNumber, TreeSelect, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { ROLE_DETAIL, ROLE_INIT, ROLE_SUBMIT } from '../../../actions/role';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ role, loading }) => ({
  role,
  submitting: loading.effects['role/submit'],
}))
@Form.create()
class RoleEdit extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(ROLE_DETAIL(id));
    dispatch(ROLE_INIT());
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      dispatch,
      match: {
        params: { id },
      },
      form,
    } = this.props;
    const parentId = form.getFieldValue('parentId');
    if (id === parentId.toString()) {
      message.warn('上级角色不能选择自身!');
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id,
          ...values,
        };
        dispatch(ROLE_SUBMIT(params));
      }
    });
  };

  onParentIdChange = (value, title) => {
    console.log(value);
    console.log(title);
  };

  render() {
    const {
      form: { getFieldDecorator },
      role: {
        detail,
        init: { tree },
      },
      submitting,
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
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );

    return (
      <Panel title="修改角色" back="/authority/role" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
                <FormItem label="角色名称">
                  {getFieldDecorator('roleName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入角色名称',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                    initialValue: detail.roleName,
                  })(<Input placeholder="请输入角色名称" maxLength={20} />)}
                </FormItem>
                <FormItem label="角色别名">
                  {getFieldDecorator('roleAlias', {
                    rules: [
                      {
                        required: true,
                        message: '请输入角色别名',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                    initialValue: detail.roleAlias,
                  })(<Input placeholder="请输入角色别名" maxLength={20} />)}
                </FormItem>
                <FormItem label="上级角色">
                  {getFieldDecorator('parentId', {
                    initialValue: detail.parentId,
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={tree}
                      placeholder="请选择上级角色"
                      allowClear
                      showSearch
                      treeNodeFilterProp="title"
                      onChange={this.onParentIdChange}
                    />
                  )}
                </FormItem>
                <FormItem className={styles.inputItem} label="角色排序">
                  {getFieldDecorator('sort', {
                    rules: [
                      {
                        required: true,
                        message: '请输入角色排序',
                      },
                    ],
                    initialValue: detail.sort,
                  })(<InputNumber placeholder="请输入角色排序" />)}
                </FormItem>
          </Card>

        </Form>
      </Panel>
    );
  }
}

export default RoleEdit;
