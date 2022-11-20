import React, { Component } from 'react';
import { connect } from 'dva/index';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Form, Input, Button, Icon, Tooltip, message } from 'antd/lib/index';
import router from 'umi/router';
import cookie from 'react-cookies';
import styles from './Login.less';
import Func from '@/utils/Func';
import { requestApiByJson } from '../../services/api';
import { project } from '../../defaultSettings';

const FormItem = Form.Item;
const InputGroup = Input.Group;

@connect(({ joinus, loading }) => ({
  joinus,
  submitting: loading.effects['joinus/submit'],
}))
@Form.create()
class ForgetPwd extends Component {
  state = {
    visible: false,
    help: '',
    phoneSuffix: false
  };

  componentDidMount() {
    const { form } = this.props;
    form.resetFields();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        requestApiByJson('/api/mer-user/client/merDriver/forget_password', values).then(resp => {
          if (resp.success) {
            cookie.remove('rememberPwd');
            message.info('密码重置成功');
            router.push('/user/login');
          }
        });
      }
    });
  };

  checkPhone = (rule, value, callback) => {
    if (Func.notEmpty(value)) {
      this.setState({ phoneSuffix: true });
    } else {
      this.setState({ phoneSuffix: false });
    }
    callback();
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible } = this.state;
    if (!value) {
      this.setState({
        help: '请输入六位数字密码',
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

  getPasswordStrength = password => {
    let strength = 0;

    // 正则表达式验证符合要求的
    if (password.length < 1) return strength;
    if (/\d/.test(password)) strength += 1; // 数字
    if (/[a-z]/.test(password)) strength += 1; // 小写
    if (/[A-Z]/.test(password)) strength += 1; // 大写
    if (/\W/.test(password)) strength += 1; // 特殊字符
    return strength;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { help, phoneSuffix } = this.state;
    return (
      <div className={styles.main}>
        <h3>重置密码</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            <InputGroup compact>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.phone-number.required' }),
                  },
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                  },
                  {
                    validator: this.checkPhone,
                  },
                ],
              })(
                <Input
                  size="large"
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
                  prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={
                    phoneSuffix ? (
                      ''
                    ) : (
                      <Tooltip title={formatMessage({ id: 'validation.phone-number.required' })}>
                        <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    )
                  }
                />
              )}
            </InputGroup>
          </FormItem>
          <FormItem help={help}>
            {getFieldDecorator('password', {
              rules: [
                {
                  validator: this.checkPassword,
                },
              ],
            })(
              <Input.Password
                size="large"
                type="password"
                placeholder={
                  project === 'wlhy'
                    ? '请设置六位数字密码'
                    : formatMessage({ id: 'form.password.placeholder' })
                }
                maxLength={project === 'wlhy' ? 6 : 16}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.confirm-password.required' }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input.Password
                size="large"
                type="password"
                placeholder={
                  project === 'wlhy'
                    ? '请设置六位数字密码'
                    : formatMessage({ id: 'form.confirm-password.placeholder' })
                }
                maxLength={project === 'wlhy' ? 6 : 16}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            )}
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
            >
              重置密码
            </Button>
          </FormItem>

          <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
            <Link to="/user/login">去登录</Link>
          </div>
        </Form>
      </div>
    );
  }
}

export default ForgetPwd;
