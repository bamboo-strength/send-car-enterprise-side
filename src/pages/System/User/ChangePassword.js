import React, { PureComponent } from 'react';
import { Form, Input, Card, Col, Button, Modal, Icon } from 'antd';
import { connect } from 'dva';
import { NavBar } from 'antd-mobile';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import { getCurrentUser } from '@/utils/authority';
import styles from '../../../layouts/Sword.less';
import { USER_DETAIL, USER_INIT, USER_UPDATEPASSWORD } from '@/actions/user';
import { clientId } from '@/defaultSettings';


const FormItem = Form.Item;
const { confirm } = Modal;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/submit'],
}))
@Form.create()
class UserEdit extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      help: '',
      visible: false,
    }
  }

  componentWillMount() {
    const {
      dispatch,
    } = this.props;

    const user = getCurrentUser();
    dispatch(USER_DETAIL(user.userId));
    dispatch(USER_INIT());

  }

  handleSubmit = e => {
      e.preventDefault();
      let tenant = '';
      if (getCurrentUser() !== null && getCurrentUser().tenantId !== undefined && getCurrentUser().tenantId !== 'undefined' && getCurrentUser().tenantId !== null) {
        tenant = getCurrentUser().tenantId;
      }
      const {
        dispatch,
        form,
      } = this.props;
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const user = getCurrentUser();
          const id = user.userId;
          const params = {
            id,
            ...values,
            tenant,
          };
          confirm({
            title: '确定要修改密码吗?',
            content: '修改密码后系统将重新登录',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              dispatch(USER_UPDATEPASSWORD(params));
            },
          });
        }
      });

  };

  goReturn = () => {
    if (clientId === 'kspt_driver') {
      router.push('/driverSide/personal/personalCenter');
    } else {
      router.push('/driverSide/personal/personalShipper');
    }
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { form } = this.props;
    const { visible } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value === form.getFieldValue('oldPassword')){
        this.setState({
          help: '新密码应与旧密码不一致！',
        })
        callback('error')
      }
      if (value.length < 6) {
        this.setState({
          help: formatMessage({ id: 'validation.password.required.length' }),
          visible: !!value,
        });
        callback('error');
      }
      callback();
    }
  };


  render() {
    const {
      form: { getFieldDecorator },
      user: {
        detail,
      },
      submitting,
    } = this.props;

    const {help} = this.state

    const formItemLayout = {
      labelCol: {
        span: 11,
      },
      wrapperCol: {
        span: 13,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting} block style={{ marginTop: '10px' }}>
        提交
      </Button>
    );

    const span = 24;
    const style = {marginBottom:15}

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={this.goReturn}
        >修改密码
        </NavBar>
        <div className='am-list'>
          <Form style={{ marginTop: 8 }}>
            <Card title="用户信息" className={styles.card} bordered={false}>
              <Col span={span} style={style}>
                <FormItem {...formItemLayout} label="登录账号">
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '请输入登录账号',
                      },
                    ],
                    initialValue: detail.account,
                  })(<Input placeholder="请输入登录账号" readOnly='readOnly' />)}
                </FormItem>
              </Col>

              {/* <Row gutter={24}>
                <Col span={22}>
                  <FormItem {...formItemLayout} label="用户昵称">
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          message: '请输入用户昵称',
                        },
                      ],
                      initialValue: detail.name,
                    })(<Input placeholder="请输入用户昵称" readOnly='readOnly' />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={22}>
                  <FormItem {...formItemLayout} label="用户姓名">
                    {getFieldDecorator('realName', {
                      rules: [
                        {
                          required: true,
                          message: '请输入用户姓名',
                        },
                      ],
                      initialValue: detail.realName,
                    })(<Input placeholder="请输入用户姓名" readOnly='readOnly' />)}
                  </FormItem>
                </Col>
              </Row> */}

              <Col span={span} style={style}>
                <FormItem {...formItemLayout} label="输入旧密码">
                  {getFieldDecorator('oldPassword', {
                    rules: [
                      {
                        required: true,
                        message: '请输入旧密码',
                      },
                    ],
                  })(<Input.Password autocomplete="new-password" maxLength={20} placeholder="请输入旧密码" />)}
                </FormItem>
              </Col>
              <Col span={span} style={style}>
                <FormItem {...formItemLayout} help={help} label="输入新密码">
                  {getFieldDecorator('newPassword', {
                    rules: [
                      {required: true,
                      },
                      {
                        validator: this.checkPassword,
                      },
                    ],
                  })(<Input.Password
                    placeholder="请输入新密码"
                    maxLength={16}
                  />)}
                </FormItem>
              </Col>

              <Col span={span} style={style}>
                <FormItem {...formItemLayout} label="再次输入新密码">
                  {getFieldDecorator('newPassword1', {
                    rules: [
                      {
                        required: true,
                        message: '请再次输入登录密码',
                      },
                      {
                        validator: this.checkConfirm,
                      },
                    ],
                  })(<Input.Password
                    placeholder="请再次输入新密码"
                    maxLength={16}
                  />)}
                </FormItem>
              </Col>
            </Card>
          </Form>
          {action}
        </div>
      </div>
    );
  }
}

export default UserEdit;
