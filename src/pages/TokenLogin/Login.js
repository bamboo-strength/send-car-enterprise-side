import React, { Component,message } from 'react';
import { connect } from 'dva';
import Func from '@/utils/Func';

@connect(({ tokenLogin, loading }) => ({
  tokenLogin,
  submitting: loading.effects['tokenLogin/tokenLogin'],
}))
class TokenLoginPage extends Component {
  componentDidMount() {
    const p_token = this.props.location.query.token;
 //   const queryFlag = this.props.location.query.kspt;
    /* 获取到平台端传递过来的 url 的参数 */
  //  localStorage.setItem('queryFlag', queryFlag);
  //   localStorage.setItem('queryToken', p_token);
    if (Func.notEmpty(p_token)) {
      const { dispatch } = this.props;
      dispatch({
        type: 'tokenLogin/login',
        payload: {
          token: p_token,
        },
      });
    } else {
      const urlParams = new URL(window.location.href);
      window.location.href = urlParams.origin + '/#';
    }

  }

  render() {
    return (
      <div/>
    );
  }
}

export default TokenLoginPage;
