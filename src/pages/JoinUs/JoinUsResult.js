import React, { Component } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Button, Form } from 'antd';
import Result from '@/components/Result';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './JoinUsResult.less';

@connect(({ joinus, loading }) => ({
  joinus,
  submitting: loading.effects['joinus/submit'],
}))
@Form.create()
class JoinUsResult extends Component {
  componentDidMount() {
    const {location} = this.props;
    sessionStorage.setItem('login-account',location.state.payload.account)
    sessionStorage.setItem('login-password',location.state.payload.password)
  }

    signin= () => {
    router.push({
      pathname: '/user/login',
    },)
  };

  render() {
    const { joinus:{data} } = this.props;
    const actions = (
      <div className={styles.actions}>
        {/* <a href=""> */}
        {/*  <Button size="large" type="primary"> */}
        {/*    <FormattedMessage id="app.register-result.view-mailbox" /> */}
        {/*  </Button> */}
        {/* </a> */}
        <Button size="large" onClick={this.signin}>
          去登录
        </Button>
        {/* <Link to="/user/login"> */}
        {/*  <Button size="large"> */}
        {/*    <FormattedMessage id="app.register-result.back-home" /> */}
        {/*  </Button> */}
        {/* </Link> */}
      </div>
    );


    return (
      <Result
        className={styles.joinUsResult}
        type="success"
        title={
          <div className={styles.title}>
            <FormattedMessage
              id="app.register-result.msg"
              values={{ email: data ? data.account : 'AntDesign@example.com' }}
            />
          </div>
        }
        // description={formatMessage({ id: 'app.register-result.activation-email' })}
        actions={actions}
        style={{ marginTop: 56 }}
      />
    )
  }
}

export default JoinUsResult;
