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
        ??????
      </Button>
    );

    return (
      <Panel title="????????????" back="/system/user" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="????????????" className={styles.card} bordered={false}>
                <FormItem {...formAllItemLayout} label="????????????">
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '?????????????????????',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '??????????????????',
                      }
                    ],
                    initialValue: detail.account,
                  })(<Input placeholder="?????????????????????" maxLength={20} />)}
                </FormItem>
            {tenantMode ? (
                  <FormItem {...formAllItemLayout} label="????????????">
                    {getFieldDecorator('tenantId', {
                      rules: [
                        {
                          required: true,
                          message: '?????????????????????',
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
                        placeholder="?????????????????????"
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
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '?????????????????????',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '??????????????????',
                      }
                    ],
                    initialValue: detail.name,
                  })(<Input placeholder="?????????????????????" maxLength={20} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator('realName', {
                    rules: [
                      {
                        required: true,
                        message: '?????????????????????',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '??????????????????',
                      }
                    ],
                    initialValue: detail.realName,
                  })(<Input placeholder="?????????????????????" maxLength={20} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator('roleId', {
                    rules: [
                      {
                        required: true,
                        message: '?????????????????????',
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
                      placeholder="?????????????????????"
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator('deptId', {
                    rules: [
                      {
                        required: true,
                        message: '?????????????????????',
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
                      placeholder="?????????????????????"
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator('phone', {
                    initialValue: detail.phone,
                    rules: [
                      {
                        pattern: /^[^\s]*$/,
                        message: '??????????????????',
                      },
                      {
                        pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/,
                        message: '????????????????????????',
                      }
                    ]
                  })(<Input placeholder="?????????????????????" maxLength={20} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator('email', {
                    initialValue: detail.email,
                    rules:[
                      {
                        pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                        message: '?????????????????????',
                      }
                    ]
                  })(<Input placeholder="?????????????????????" maxLength={40} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="??????">
                  {getFieldDecorator('sex',{
                    initialValue: detail.sex===-1?"":detail.sex,
                  })(
                    <Select
                      placeholder="?????????????????????"
                    >
                      {sexName.map(d => (
                        <Select.Option key={d.dictKey} value={d.dictKey}>
                          {d.dictValue}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator('birthday', {
                    initialValue: func.moment(detail.birthday),
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      placeholder="?????????????????????"
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
