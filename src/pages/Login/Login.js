import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Checkbox, Alert, Form } from 'antd';
import Link from 'umi/link';
import Login from '@/components/Login';
import styles from './Login.less';
import { removeAll } from '@/utils/authority';
import cookie from 'react-cookies';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true
  };

  onTabChange = type => {
    this.setState({ type });
  };

  /**
   * removeAll 移除localStorage
   * @param {*} err
   * @param {*} values
   */
  handleSubmit = (err, values) => {
    removeAll();
    if (!!err) {
      return;
    }
    const { form } = this.props;
    const { type, autoLogin } = this.state;
    const { dispatch } = this.props;
    form.validateFieldsAndScroll((err2, value) => {
      if (err2) {
        return;
      }
      const account = values.username ?? value.username;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          username: account,
        },
      }).then(() => {
        const { login } = this.props;
        if (login.status === 'ok' && autoLogin) {
          cookie.save('rememberAccount', account);
          cookie.save('rememberPwd', values.password);
        }
      });
    });
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
    if (!e.target.checked) {
      cookie.remove('rememberAccount');
      cookie.remove('rememberPwd');
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={`${styles.main}`}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form1 => {
            this.loginForm = form1;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName
              defaultValue={cookie.load('rememberAccount')}
              name="username"
              placeholder="用户名"
              allowClear
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
                {
                  pattern: /^[^\s]*$/,
                  message: '禁止输入空格',
                },
              ]}
            />

            <Password
              defaultValue={cookie.load('rememberPwd')}
              name="password"
              placeholder={`${formatMessage({ id: 'app.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
                {
                  pattern: /^[^\s]*$/,
                  message: '禁止输入空格',
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <div>
            <Checkbox
              checked={autoLogin}
              onChange={this.changeAutoLogin}
              style={{ color: '#1890FF' }}
            >
              记住密码
            </Checkbox>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link className={styles.login} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
            <Link className={styles.login} to="/user/forgetPwd">
              重置密码
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
