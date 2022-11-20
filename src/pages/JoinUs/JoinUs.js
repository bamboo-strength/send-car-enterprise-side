import React, { Component } from 'react';
import { connect } from 'dva';
import JoinUs from  './Normal/JoinUs'

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginNomal extends Component {
  state = {

  };

  render() {
    return (
      <JoinUs />
    );
  }
}

export default LoginNomal;
