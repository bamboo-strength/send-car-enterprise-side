import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Alert, AutoComplete, Checkbox, Form, Icon, Input, Modal as PcModal, Select } from 'antd';
import { Modal, Toast } from 'antd-mobile';
import Link from 'umi/link';
import { router } from 'umi';
import Login from '../../../components/Login';
import styles from '../Login.less';
import { clientId, ifNeedRegister } from '../../../defaultSettings';
import MyModal from '@/components/Util/MyModal';
import { jiGuang, requestApi, requestListApi } from '../../../services/api';
import Func from '@/utils/Func';
import { getParamSkipToken } from '../../../services/param';
import func from '../../../utils/Func';
import AgreementUserService from './AgreementUserService';
import AgreementPrivacy from './AgreementPrivacy';
import { checkDrivingPermit, checkUserType } from '../../../services/DongPing/Login';
import { getCurrentUser, setUserType } from '../../../utils/authority';

const { Tab, UserName, Password, Submit } = Login;
const FormItem = Form.Item;
const { Option } = AutoComplete;
const { confirm } = PcModal

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class Login847975 extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    tenants:[],
    ifShowRegister:ifNeedRegister,
    isShowTenant:false,
    tenantId:'847975',
    autoResult:[], // 客户拼音码
    serviceModal:false,
    tosvisible1: false,
    tosvisible2: false,
    ifFirstLogin:false,
  };

  componentDidMount() {
    const {tenantId} = this.state
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

    if(clientId !== 'kspt'){ // 不是发货方
      const account = localStorage.getItem('rememberAccount')
      if(account){
        this.checkIfFirstLogin(account)
      }
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
    const {form} = this.props
    const { type,autoLogin, tenantId} = this.state;
    if(form.getFieldValue('agreement') === false){
      Toast.info('请勾选用户服务协议')
      return
    }
    if (!err) {
      const { dispatch } = this.props;
      form.validateFieldsAndScroll((err2, value) => {
        if(!err2){
          if(clientId !== 'kspt'){ // 如果是客户需要先判断是否审核通过再进行登录
            const account = clientId ==='kspt_shf'? value.username || value.custName :values.username
            let submitParam = {tenantId,account}
            if(account === 'admin'){   // admin 需要分配权限 特殊处理
              submitParam = {tenantId:'000000',account}
            }
            requestApi('/api/mer-user/client/userRelation/isCustomerUserCanLogin',submitParam).then(resp=>{
              if (resp.success) {
                if (clientId === 'kspt_shf'){
                  // 客户端登录记住拼音码账号
                  const aa = {code:account,name:account}
                  let accountCache = []
                  accountCache.push(aa)
                  if (localStorage.getItem('accountCache') !== null){
                    const cache = JSON.parse(localStorage.getItem('accountCache'))
                    // 将缓存里取出来的账号信息和新增的账户信息合并
                    accountCache = [...accountCache,...cache]
                  }
                  // 去除重复的数据
                  accountCache = accountCache.reduce((acc, cur) => {
                    !acc.some(v => v.name === cur.name) && acc.push(cur);
                    return acc;
                  }, []);
                  localStorage.setItem('accountCache',JSON.stringify(accountCache))
                }
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
                      tenantId:account === 'admin'?'000000':tenantId,
                      type,
                      username:account
                    },
                  }).then(()=>{
                    const {login} = this.props
                    if(login.status === 'ok' && autoLogin){
                      // 记住密码
                      localStorage.setItem('rememberAccount',account)
                      localStorage.setItem('rememberPwd',values.password)
                    }
                    if(clientId === 'kspt_driver'&&login.status === 'ok'){
                      // 校验司机是否认证车辆行驶证
                      checkDrivingPermit({tenantId:'847975',userId:getCurrentUser().userId}).then(rr=>{
                        if(!rr.data){
                          Modal.alert('车辆行驶证认证', rr.msg, [
                            { text: '取消'},
                            { text: '去认证', onPress: () => router.push('/driverSide/personal/myCars') },
                          ]);

                        }
                      })
                    }

                    if(clientId === 'kspt_shf'&&login.status === 'ok'){
                      // 区分登录账号是客户还是个人  0 客户   1 个人客户
                      checkUserType().then(resp1=>{
                        // console.log(resp1)
                        if(resp1.success){
                          setUserType({custTypeFlag:resp1.data.custTypeFlag})
                        }
                      })
                    }

                    try {
                      if((clientId === 'kspt_driver'||clientId === 'kspt_shf') && login.status === 'ok' && Urora && Urora.getRegId()){
                        // 保存成功 调用集成极光推送方法
                        jiGuang({
                          tenantId:'670777',
                          account,
                          jszh:account,
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
          }else { // 企业端
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
                localStorage.setItem('rememberAccount',values.username)
                localStorage.setItem('rememberPwd',values.password)
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
        isShowTenant:false
      })
    }
    if(clientId==='kspt_driver' && value.length === 11){
      this.checkIfFirstLogin(value)
    }
  }

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
    if(!e.target.checked){
      localStorage.removeItem('rememberAccount');
      localStorage.removeItem('rememberPwd');
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  autoChange = (value, o,id, labelId, ) => {
    const {form,} = this.props;
    this.loginForm.setFieldsValue({
      password: ''
    })
    form.setFieldsValue(
      {
        [id]: value,
        [labelId]: o.props.children,
      },
    );
    this.checkIfFirstLogin(o.props.children)
  };

  handleSearch = (value) => {
    const { form } = this.props;
    this.setState({ autoResult: [] });
    const param = { 'sortl': value, 'type': clientId === 'kspt_shf'?'customer':'carrier' };
    if (value && value.length>=2) {
     // if(func.notEmpty(tenantId)){
        param['Blade-DesignatedTenant'] = '847975'
        param.tenantId = '847975'
        requestListApi('/api/mer-user/client/get_sortl', param).then(resp=>{
          if (resp.success){
            if (func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
              this.setState({ autoResult: resp.data });
            } else {
              console.log('拼音码无返回值/检查参数是否正确');
            }
          }

        })
      // } else {
      //   message.info('请先选择发货方')
      // }
    }else {
      form.setFieldsValue({
        'username': '',
      });
    }
  };

  showServiceModal=()=>{
    this.setState({
      serviceModal:true
    })
  }

  onClose=()=>{
    this.setState({
      serviceModal:false
    })
  }

  handleCancel = () => {
    this.setState({
      tosvisible1: false,
      tosvisible2: false,
    });
  };

  agreement1 =()=>{
    this.setState({
      tosvisible1: true,
    });
  }

  agreement2 =()=>{
    this.setState({
      tosvisible2: true,
    });
  }

  getAgreement =(type)=>{
    if(type === 'tos1'){
      return <AgreementUserService />;
    }
    return <AgreementPrivacy />;
  }

  checkIfFirstLogin=(account)=>{
    // console.log(account)
    // 校验该用户是否是第一次登录
    requestListApi('/api/mer-user/client/recordUserLoginLog', {account,shipperTenantId:'847975'}).then(resp=>{
      if(resp.success && !resp.data){ // 不是第一次登录
        this.setState({
          ifFirstLogin:true
        })
      }else {
        this.setState({
          ifFirstLogin:false
        })
      }
    })
  }

  callPhone = (text)=>{
    confirm({
      title:'确定要拨打电话？',
      onOk(){
        /* 调用安卓端方法进行拨打电话操作 */
        MakeAPhoneCall.callPhone(text)
      }
    })
  }

  onFocus = () => {
    // 客户端登录时获取缓存里的账号
    const accountCache = localStorage.getItem('accountCache')
    if (accountCache !== null){
      this.setState({
        autoResult:JSON.parse(accountCache)
      })
    }
  }

  render() {
    const { login, submitting,form } = this.props;
    const { type, autoLogin,tenants,ifShowRegister,isShowTenant,tenantId,autoResult,serviceModal,tosvisible1,tosvisible2,ifFirstLogin } = this.state;
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
            {
              clientId==='kspt_shf'? // 东平砂石用客户拼音码登录
                <FormItem>
                  {getFieldDecorator('custName',{
                    rules: [
                      {
                        required: true,
                        message: '客户不能为空',
                      }
                    ],
                    initialValue: localStorage.getItem('rememberAccount')
                  })
                  (
                    <AutoComplete
                      style={{width:'100%'}}
                      onSearch={this.handleSearch}
                      placeholder="拼音码检索客户"
                      onFocus={this.onFocus}
                      onSelect={(v, o) => this.autoChange(v, o,'custName','username')}
                      allowClear
                    >
                      {autoResult.map(element => (
                        <Option key={element.code}>{element.name}</Option>
                      ))}
                    </AutoComplete>,
                  )}
                  {getFieldDecorator('username', {
                    initialValue: localStorage.getItem('rememberAccount')
                  })(<Input style={{ display: 'none' }} />)
                  }
                </FormItem>:
                <UserName
                  defaultValue={localStorage.getItem('rememberAccount')}
                  name="username"
                  placeholder={clientId ==='kspt_driver'?'手机号':'用户名'}
                  onChange={(e)=>this.userNameChange(e)}
                //  onBlur={(e)=>this.checkIfFirstLogin(e.target.value)}
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
            }
            {
              isShowTenant?
                <FormItem label="">
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
                    <Select placeholder="请选择发货方" onSelect={(e)=>this.selectShipper(e)}>
                      {tenants.map(d => (
                        <Select.Option key={d.tenant_id} value={d.tenant_id}>
                          {d.tenant_name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>:undefined
            }

            <Password
              defaultValue={localStorage.getItem('rememberPwd')}
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
                {
                  clientId==='kspt_shf'?
                    <p style={{color:'#1890FF'}} onClick={this.showServiceModal}>
                      没有账号？联系客服
                    </p>:
                    <Link className={styles.login} to={toUrl}>
                      <FormattedMessage id="app.login.signup" />
                    </Link>
                }
                <Link className={styles.login} to="/user/forgetPwd/847975">
                  重置密码
                </Link>
              </div>
              :undefined
          }
          {
            clientId === 'kspt_shf'?
              <FormItem>
                {getFieldDecorator('agreement', {
                  valuePropName: 'checked',
                  rules: [
                    {
                      required: true,
                      message: '同意条款注册',
                    },
                  ],
                  initialValue:ifFirstLogin
                })(
                  <Checkbox className={styles.checkbox} style={{fontSize: '12px',color: 'gray'}}>
                    我已阅读并同意
                    <Link
                      className={styles.login}
                      onClick={this.agreement1}
                    >
                      《用户服务协议》
                    </Link>及
                    <Link
                      className={styles.login}
                      onClick={this.agreement2}
                    >
                      《用户隐私政策》
                    </Link>
                  </Checkbox>

                )}
              </FormItem>:undefined
          }
        </Login>

        <Modal
          visible={serviceModal}
          transparent
          maskClosable={false}
          onClose={this.onClose}
          title="联系客服"
          footer={[{ text: '我知道了', onPress: () => this.onClose() }]}
        >
          <div style={{ height: 60}}>
            <p><Icon type="phone" theme="twoTone" /> <a onClick={()=>this.callPhone('0538-2720008')}>0538-2720008</a></p>
          </div>
        </Modal>
        <MyModal
          top='0'
          modaltitel="用户服务协议"
          visible={tosvisible1}
          onCancel={this.handleCancel}
          popupContent={()=>this.getAgreement('tos1')}
          selectRow={[]}
          popupwidth='0.9'
          height='0.6'
          isfangdaDisplay={false}
        />
        <MyModal
          top='0'
          modaltitel="用户隐私政策"
          visible={tosvisible2}
          onCancel={this.handleCancel}
          popupContent={()=>this.getAgreement('tos2')}
          selectRow={[]}
          popupwidth='0.9'
          height='0.6'
          isfangdaDisplay={false}
        />
      </div>
    );
  }
}

export default Login847975;
