import React, { Component } from 'react';
import { connect } from 'dva';
import JoinUs from  './Normal/JoinUs'
import JoinUs847975 from  './847975/JoinUs'
import JoinUsWithTenant from  './JoinUsWithTenant/JoinUs'
import JoinUsWlhy from  './wlhy/JoinUs'
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
      return <JoinUs />
    }
    if(currentTenant === '847975'){
      return <JoinUs847975 />
    }
    if(currentTenant === 'wlhy'){
      return <JoinUsWlhy />
    }
    return <JoinUsWithTenant />
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
