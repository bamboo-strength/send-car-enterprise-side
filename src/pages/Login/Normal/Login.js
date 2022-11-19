import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Checkbox, Alert, Form, Select, } from 'antd';
import Link from 'umi/link';
// import { Toast,Modal } from 'antd-mobile';
import Login from '../../../components/Login';
import styles from '../Login.less';
import { clientId,ifNeedRegister} from '../../../defaultSettings';
import {jiGuang,requestApi} from '../../../services/api';
import Func from '@/utils/Func';
import {getParamSkipToken,getSystemParamByParamKey} from '../../../services/param'
import { getCurrentUser,getToken,removeAll } from '../../../utils/authority';
import { getTenantId } from '../../Merchants/commontable';
import cookie from 'react-cookies'

const { Tab, UserName, Password, Submit } = Login;
const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    tenants:[],
    ifShowRegister:ifNeedRegister,
    isShowTenant:false,
    tenantId:'login',
  };

  componentDidMount() {

    let {tenantId} = this.state
    try {
      tenantId=TenantId.getTenantId()?TenantId.getTenantId():'login'
    } catch (e) {
      // 通过过去前台登陆路径获取当前登陆的租户号
      tenantId = localStorage.getItem('tenantId')
    }
    this.setState({
      tenantId
    })

    if(tenantId !== 'login'){
      const param = {'key':'regist.ifShowRegister',tenantId}
      getParamSkipToken(param).then(resp => {
        if (resp.success && Func.notEmpty(resp.data) && JSON.stringify(resp.data) !== '{}' ) {
          // 配置了 需要显示注册功能
          this.setState({
            ifShowRegister:true
          })
        }
      });
    }
  }

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });


  handleSubmit = (err, values) => {
    removeAll();
    const {form} = this.props
    const { type,autoLogin, tenantId} = this.state;
    if (!err) {
      const { dispatch } = this.props;
      form.validateFieldsAndScroll((err2, value) => {
        if(!err2){
          const account = values.username?values.username:value.username
          if(clientId !== 'kspt'){ // 如果不是企业用户需要先判断是否审核通过再进行登录
            requestApi('/api/mer-user/client/userRelation/isCustomerUserCanLogin',
              { tenantId,account}).then(resp=>{
              if (resp.success) {
                if(resp.data.length>1){ // 多个租户 需要选择租户
                  this.setState({
                    isShowTenant:true,
                    tenants:resp.data
                  })
                }else {
                  dispatch({
                    type: 'login/login',
                    payload: {
                      ...values,
                      tenantId:resp.data.length===1?resp.data[0].tenant_id:tenantId,
                      type,
                      username:account
                    },
                  }).then(()=>{
                    const {login} = this.props
                    if(login.status === 'ok' && autoLogin){
                      if(clientId==='kspt_driver'){
                        const ifWx = window.__wxjs_environment === 'miniprogram'
                        if(!getCurrentUser().openId && ifWx){ // 未授权过并且是微信环境
                          const param = {'paramKey':'openid_get_config'}
                          param.tenantId = getTenantId()
                          getSystemParamByParamKey(param).then(rr => {
                            if(rr.success && rr.data.paramValue){ // 配置过获取openid相关参数的租户是需要绑定openid的
                              // 跳转到微信授权
                              const item ={
                                auth:getToken()
                              }
                              wx.miniProgram.navigateTo({url: `/pages/toAuthorize/toAuthorize?items=${JSON.stringify(item)}`});
                            }
                          })
                        }
                      }
                      // 记住密码
                      // localStorage.setItem('rememberAccount',account)
                      // localStorage.setItem('rememberPwd',values.password)
                      cookie.save('rememberAccount', account)
                      cookie.save('rememberPwd', values.password)
                    }
                    try {
                      if(clientId === 'kspt_driver' && login.status === 'ok' && Func.notEmpty(Urora) && Func.notEmpty(Urora.getRegId())){
                        // 保存成功 调用集成极光推送方法
                        jiGuang({
                          tenantId:'670777',
                          account:values.username,
                          jszh:values.username,
                          registrationId:Urora.getRegId()
                        })
                      }
                    } catch (e) {
                      console.log('当前环境不支持极光推送')
                    }
                  });
                }
              }
            })
          }else { // 企业
            dispatch({
              type: 'login/login',
              payload: {
                ...values,
                tenantId,
                type,
              },
            }).then(()=>{
              const {login} = this.props
              if(login.status === 'ok' && autoLogin){
                // 记住密码
                // localStorage.setItem('rememberAccount',values.username)
                // localStorage.setItem('rememberPwd',values.password)
                cookie.save('rememberAccount', values.username)
                cookie.save('rememberPwd', values.password)
              }
            });
          }
        }
      })

    }
  };

  // 发货方选择后
  selectShipper=(value)=>{
    this.setState({
      tenantId:value
    })
  }

  userNameChange=(e)=>{
    const {value} = e.target
    if(value === ''){
      this.setState({
        isShowTenant:false,
        tenantId:'login'
      })
    }
  }

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
    if(!e.target.checked){
      // localStorage.removeItem('rememberAccount');
      // localStorage.removeItem('rememberPwd');
      cookie.remove('rememberAccount')
      cookie.remove('rememberPwd')
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  autoChange = (value, o,id, labelId, ) => {
    const {form,} = this.props;
    form.setFieldsValue(
      {
        [id]: value,
        [labelId]: o.props.children,
      },
    );
  };

  render() {
    const { login, submitting,form } = this.props;
    const { type, autoLogin,tenants,ifShowRegister,isShowTenant,tenantId, } = this.state;
    const toUrl =   tenantId==='login'?'/user/joinus':`/user/joinus/${tenantId}`
    const { getFieldDecorator } = form;
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
              // defaultValue={localStorage.getItem('rememberAccount')}
              defaultValue={cookie.load('rememberAccount')}
              name="username"
              placeholder={clientId ==='kspt_driver'?'手机号':'用户名'}
              onChange={(e)=>this.userNameChange(e)}
              //  onBlur={(e)=>this.getSlectTenant(e)}
              allowClear
              rules={[
                {
                  required: true,
                  message: clientId ==='kspt_driver'?'请输入手机号':'请输入用户名',
                },
                {
                  pattern: /^[^\s]*$/,
                  message: '禁止输入空格',
                },
              ]}
            />
            {
              isShowTenant?
                <FormItem label="" className='chooseFhfStyle'>
                  {getFieldDecorator('tenantId',{
                    rules: [
                      {
                        required: true,
                        message: "请选择发货方",
                      },
                    ],
                    initialValue:undefined
                  })
                  (
                    <Select placeholder="请选择发货方" onSelect={(e)=>this.selectShipper(e)} >
                      {tenants.map(d => (
                        <Select.Option key={d.tenant_id} value={d.tenant_id} >
                          {d.tenant_name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>:undefined
            }

            <Password
              // defaultValue={localStorage.getItem('rememberPwd')}
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
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin} style={{ color: '#1890FF' }}>
              {/* <FormattedMessage id="app.login.remember-me" /> */}
              记住密码
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          {
            clientId ==='kspt_driver' || (ifShowRegister && clientId !=='kspt')?
              <div style={{display: 'flex',   justifyContent: 'space-between'}}>
                <Link className={styles.login} to={toUrl}>
                  <FormattedMessage id="app.login.signup" />
                </Link>
                <Link className={styles.login} to="/user/forgetPwd">
                  重置密码
                </Link>
              </div>
              :undefined
          }
        </Login>
      </div>
    );
  }
}

export default LoginPage;
