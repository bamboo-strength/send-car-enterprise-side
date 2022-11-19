import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, TreeSelect, DatePicker, Select } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import func from '../../../utils/Func';
import styles from '../../../layouts/Sword.less';
import { USER_CHANGE_INIT, USER_DETAIL, USER_INIT, USER_UPDATE } from '../../../actions/user';
import { tenantMode } from '../../../defaultSettings';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class UserEdit extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(USER_DETAIL(id));
    dispatch(USER_INIT());
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
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id,
          ...values,
          roleId: func.join(values.roleId),
          deptId: func.join(values.deptId),
          birthday: func.format(values.birthday),
        };
        dispatch(USER_UPDATE(params));
      }
    });
  };

  handleChange = value => {
    const { dispatch, form } = this.props;
    form.resetFields(['roleId', 'deptId']);
    dispatch(USER_CHANGE_INIT({ tenantId: value }));
  };

  render() {
    const {
      form: { getFieldDecorator },
      user: {
        detail,
        init: { roleTree, deptTree, tenantList, sexName },
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
      <Panel title="修改用户" back="/system/user" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
                <FormItem {...formAllItemLayout} label="登录账号">
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '请输入登录账号',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      }
                    ],
                    initialValue: detail.account,
                  })(<Input placeholder="请输入登录账号" maxLength={20} />)}
                </FormItem>
            {tenantMode ? (
                  <FormItem {...formAllItemLayout} label="所属租户">
                    {getFieldDecorator('tenantId', {
                      rules: [
                        {
                          required: true,
                          message: '请选择所属租户',
                        },
                      ],
                      initialValue: detail.tenantId,
                    })(
                      <Select
                        showSearch
                        onChange={this.handleChange}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        allowClear
                        placeholder="请选择所属租户"
                      >
                        {tenantList.map(d => (
                          <Select.Option key={d.tenantId} value={d.tenantId}>
                            {d.tenantName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
            ) : null}
                <FormItem {...formItemLayout} label="用户昵称">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户昵称',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      }
                    ],
                    initialValue: detail.name,
                  })(<Input placeholder="请输入用户昵称" maxLength={20} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="用户姓名">
                  {getFieldDecorator('realName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户姓名',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      }
                    ],
                    initialValue: detail.realName,
                  })(<Input placeholder="请输入用户姓名" maxLength={20} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="所属角色">
                  {getFieldDecorator('roleId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属角色',
                      },
                    ],
                    initialValue: func.split(detail.roleId),
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={roleTree}
                      allowClear
                      showSearch
                      treeNodeFilterProp="title"
                      multiple
                      placeholder="请选择所属角色"
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="所属机构">
                  {getFieldDecorator('deptId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属机构',
                      },
                    ],
                    initialValue: func.split(detail.deptId),
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={deptTree}
                      allowClear
                      showSearch
                      treeNodeFilterProp="title"
                      multiple
                      placeholder="请选择所属机构"
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="手机号码">
                  {getFieldDecorator('phone', {
                    initialValue: detail.phone,
                    rules: [
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                      {
                        pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/,
                        message: '手机号格式不正确',
                      }
                    ]
                  })(<Input placeholder="请输入手机号码" maxLength={20} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="电子邮箱">
                  {getFieldDecorator('email', {
                    initialValue: detail.email,
                    rules:[
                      {
                        pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                        message: '邮箱格式不正确',
                      }
                    ]
                  })(<Input placeholder="请输入电子邮箱" maxLength={40} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="性别">
                  {getFieldDecorator('sex',{
                    initialValue: detail.sex===-1?"":detail.sex,
                  })(
                    <Select
                      placeholder="请选择用户性别"
                    >
                      {sexName.map(d => (
                        <Select.Option key={d.dictKey} value={d.dictKey}>
                          {d.dictValue}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="用户生日">
                  {getFieldDecorator('birthday', {
                    initialValue: func.moment(detail.birthday),
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder="请选择用户生日"
                    />
                  )}
                </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default UserEdit;
