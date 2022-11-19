import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, TreeSelect, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { USER_INIT, USER_CHANGE_INIT, USER_SUBMIT } from '../../../actions/user';
import func from '../../../utils/Func';
import { tenantMode } from '../../../defaultSettings';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class UserAdd extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(USER_INIT());
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const password = form.getFieldValue('password');
        const password2 = form.getFieldValue('password2');
        if (password !== password2) {
          message.warning('两次密码输入不一致');
        } else {
          const params = {
            ...values,
            roleId: func.join(values.roleId),
            deptId: func.join(values.deptId),
            birthday: func.format(values.birthday),
          };
          dispatch(USER_SUBMIT(params));
        }
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
      <Panel title="新增用户" back="/system/user" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
                <FormItem label="登录账号">
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
                  })(<Input placeholder="请输入登录账号" maxLength={20} />)}
                </FormItem>
            {tenantMode ? (
                  <FormItem label="所属租户">
                    {getFieldDecorator('tenantId', {
                      rules: [
                        {
                          required: true,
                          message: '请选择所属租户',
                        },
                      ],
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
                <FormItem label="密码">
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      }
                    ],
                  })(<Input type="password" placeholder="请输入密码" maxLength={20} />)}
                </FormItem>
                <FormItem label="确认密码">
                  {getFieldDecorator('password2', {
                    rules: [
                      {
                        required: true,
                        message: '请输入确认密码',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      }
                    ],
                  })(<Input type="password" placeholder="请输入确认密码" maxLength={20} />)}
                </FormItem>
                <FormItem label="用户昵称">
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
                  })(<Input placeholder="请输入用户昵称" maxLength={20} />)}
                </FormItem>
                <FormItem label="用户姓名">
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
                  })(<Input placeholder="请输入用户姓名" maxLength={20} />)}
                </FormItem>
                <FormItem label="所属角色">
                  {getFieldDecorator('roleId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属角色',
                      },
                    ],
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
                <FormItem label="所属机构">
                  {getFieldDecorator('deptId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属机构',
                      },
                    ],
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
                <FormItem label="手机号码">
                  {getFieldDecorator('phone',{
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
                <FormItem label="电子邮箱">
                  {getFieldDecorator('email',{
                    rules:[
                      {
                        pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                        message: '邮箱格式不正确',
                      }
                    ]
                  })(<Input placeholder="请输入电子邮箱" maxLength={40} />)}
                </FormItem>
                <FormItem label="性别">
                  {getFieldDecorator('sex')(
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
                <FormItem label="用户生日">
                  {getFieldDecorator('birthday')(
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

export default UserAdd;
