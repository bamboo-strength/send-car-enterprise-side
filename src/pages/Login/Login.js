import React, { Component } from 'react';
import { connect } from 'dva';
import LoginPage from  './Normal/Login'
import Login847975 from  './847975/Login'
import LoginWithTenant from  './LoginWithTenant/Login'
import { currentTenant} from '../../defaultSettings';

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginNomal extends Component {
  state = {

  };

  showPageByTenant=()=>{
    if(currentTenant === 'login' ){
      return <LoginPage />
    }
    if(currentTenant === '847975'){
      return <Login847975 />
    }
      return <LoginWithTenant />
  }

  render() {
    return (
      <div>
        {
         this.showPageByTenant()
        }
      </div>

    );
  }
}

export default LoginNomal;
