import React, { Component } from 'react';
import { connect } from 'dva';
import { getPageQuery } from '../../utils/utils';
import { getToken, getCurrentUser, removeAll } from '../../utils/authority';





@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class SSOLoginPage extends Component {
  state = {
    type: 'account',
  };

  componentDidMount() {
    const { type } = this.state;
    if (this.props.location.query.username !== undefined && this.props.location.query.tenantid !== undefined) {


      const current_user = getCurrentUser();
      const params = getPageQuery();
      let { redirect,username } = params;
      let isLogin = false;

      if (current_user!==null && username!==null && username!==undefined && username!=="" && current_user.account===username) {
        isLogin = true;
        console.log("已经登录过")
      } else {
        console.log("没有登录过或切换了用户")
        localStorage.removeItem(getToken())
        removeAll();
        localStorage.removeItem('isSimplify');
      }

      const token = getToken();
      if (token) {

        const tokendate = localStorage.getItem(token);
        console.log(tokendate)
        const diff = new Date().getTime()-tokendate
        // 一小时内不用重复登录
        if ((diff/(1000*60))<60 && isLogin) {
          // alert(diff)
          const urlParams = new URL(window.location.href);


          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              redirect = null;
            }
          }
          console.log(urlParams)
          console.log(redirect)
          window.location.href = urlParams.origin + '/#' +redirect;
          return;
        }
      }


      const { dispatch } = this.props;
      dispatch({
        type: 'login/ssologin',
        payload: {
          tenantId: this.props.location.query.tenantid,
          username: this.props.location.query.username,
          password: this.props.location.query.password===undefined?'jyjdinterface2019@':this.props.location.query.password,
          type,
        },
      });
    }


  }

  render() {
    return (
      <div>
        正在加载数据。。。。。。
      </div>
    );
  }
}

export default SSOLoginPage;
