import React, { Component, } from 'react';
import { connect } from 'dva';
import cookie from 'react-cookies'
import { Toast, } from 'antd-mobile';

@connect(({ tokenLogin, loading }) => ({
  tokenLogin,
  submitting: loading.effects['tokenLogin/tokenLogin'],
}))
class TokenLoginPage extends Component {
  componentDidMount() {
    // Toast.info(cookie.load('access_token'))
    const accessToken = cookie.load('access_token')
    const redirect = cookie.load('redirect')
    if(accessToken){
      const { dispatch } = this.props;

      dispatch({
        type: 'tokenLogin/loginCookie',
        payload: {
          token: accessToken,
          redirect
        },
      });
    }
  }

  render() {
    return (
      <div/>
    );
  }
}

export default TokenLoginPage;
