import React, { Component } from 'react';
import { connect } from 'dva/index';
import { formatMessage,  } from 'umi/locale';
import Link from 'umi/link';
import { Form, Input, Button, Icon, Tooltip, Row, Col, message, List, Select } from 'antd/lib/index';
import router from 'umi/router';
import cookie from 'react-cookies';
import styles from '../Login.less';
import Func from '@/utils/Func';
import { getToken} from '@/utils/authority';
import { getTenantList, requestApiByJson,getUserTypeAndTenantIdByAccount } from '../../../services/api';
import { project } from '../../../defaultSettings';

const FormItem = Form.Item;
const InputGroup = Input.Group;


@connect(({ joinus, loading }) => ({
  joinus,
  submitting: loading.effects['joinus/submit'],
}))
@Form.create()
class ForgetPwd extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    phoneSuffix: false,
    relationTenantName:[],
    isShowTenant:false,
    shippetenantId:''
  };

  componentDidMount() {
    const {form} = this.props
    form.resetFields();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => { // 获取验证码
    const { form } = this.props;
    const {shippetenantId} = this.state
    const phone = form.getFieldValue('phone');
    const tenantId = form.getFieldValue('tenantId')
    if (Func.isEmpty(phone)){
      message.error(formatMessage({ id: 'validation.phone-number.required' }));
      return;
    }
    // console.log(tenantId,shippetenantId,'----- ')
    if(!tenantId && !shippetenantId){
      message.error('未选择发货方或手机号未注册，不能获取验证码')
      return;
    }
    const realTenantId = tenantId || shippetenantId
    const myToken = getToken();
    fetch(`/api/mer-user/client/get-verification-code?account=${phone}&shipperTenantId=${realTenantId}&verificationCodeType=resetPassword`,{
      method:'GET',
      headers: {
        'Authorization':'Basic c3dvcmQ6c3dvcmRfc2VjcmV0',
        'Blade-Auth': myToken,
      },
      name: 'captcha',
      // body: formData,
      mode:'cors',
      cache:'default'
    })
      .then(res =>res.json())
      .then((data) => {
        if(data.success){
          message.success(data.msg);
          let count = 59;
          this.setState({ count });
          this.interval = setInterval(() => {
            count -= 1;
            this.setState({ count });
            if (count === 0) {
              clearInterval(this.interval);
            }
          }, 1000);
        }else{
          message.error(data.msg);
        }
      })
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        requestApiByJson('/api/mer-user/client/merDriver/forget_password',values).then(resp=>{
          if(resp.success){
            cookie.remove('rememberPwd')
            message.info('密码重置成功')
            router.push('/user/login')
          }
        })
      }
    });
  };


  checkPhone = (rule, value, callback) =>{
    if (Func.notEmpty(value)){
      this.setState({phoneSuffix: true})
    }else {
      this.setState({phoneSuffix: false})
    }
    callback();
  }

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: '请输入六位数字密码',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      // if ((! /^(^-?\d+$)$/.test(value))||(!/^([0-9]\d*(\.\d+)?|0)$/.test(value))) {
      //   this.setState({
      //     help: '请输入纯数字密码',
      //   });
      //   callback('请输入数字！');
      // }
      if (value.length < 6) {
        this.setState({
          help: formatMessage({ id: 'validation.password.required.length' }),
          visible: !!value,
        });
        callback('error');
      }
      callback();
    }
  };


  getPasswordStrength = (password) =>{
    let strength=0;

    // 正则表达式验证符合要求的
    if(password.length < 1) return strength;
    if(/\d/.test(password)) strength+=1; // 数字
    if(/[a-z]/.test(password)) strength+=1; // 小写
    if(/[A-Z]/.test(password)) strength+=1; // 大写
    if(/\W/.test(password)) strength+=1; // 特殊字符
    return strength;
  }

  // 选择发货方

  userNameChange=(e)=>{
    const {value} = e.target
    const that = this
    if(value === ''){
      this.setState({
        isShowTenant:false
      })
    }else if(value.length === 11){
      getUserTypeAndTenantIdByAccount({account:value}).then(resp=>{
          if(resp.success){
            if(resp.data.length>1){
              const defaultfhf = []
              resp.data.forEach(item => {
                defaultfhf.push({
                  key:item.tenant_id,
                  value:item.tenant_name
                })
              });
              this.setState({
                isShowTenant:true,
                relationTenantName:defaultfhf
              })
            }else if(resp.data.length === 1){
              that.setState({
                shippetenantId:resp.data[0].tenant_id
              })
            }

          }
      })
    }
  }

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, help, phoneSuffix,relationTenantName,isShowTenant} = this.state;
    return (
      <div className={styles.main}>
        <h3>
          重置密码
        </h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            <InputGroup compact>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.phone-number.required' }),
                  },
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                  },
                  {
                    validator: this.checkPhone
                  }
                ],
              })(
                <Input
                  size="large"
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
                  prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={
                    phoneSuffix?
                      ""
                      :
                      <Tooltip title={formatMessage({ id: 'validation.phone-number.required' })}>
                        <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                  }
                  onChange={(e)=>this.userNameChange(e)}
                />
              )}
            </InputGroup>
          </FormItem>
          {
            project!== 'wlhy' && isShowTenant?
              <FormItem>
                {getFieldDecorator('tenantId',{
                  rules: [
                    {
                      required: false,
                      message: '请选择发货方',
                    },
                    {
                      required: true,
                      message: '请选择发货方',
                    },
                  ],
                })(
                  <Select
                    placeholder="请选择发货方"
                    size="large"
                  >
                    {relationTenantName.map(d => (
                      <Select.Option key={d.key} value={d.key}>
                        {d.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              :
              undefined
          }
          <FormItem>
            <Row gutter={8}>
              <Col span={14}>
                {getFieldDecorator('verificationCode', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.verification-code.required' }),
                    },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                  />
                )}
              </Col>
              <Col span={6}>
                <Button
                  size="large"
                  disabled={count}
                  className={styles.getCaptcha}
                  onClick={this.onGetCaptcha}
                >
                  {count
                    ? `${count} s`
                    : formatMessage({ id: 'app.register.get-verification-code' })}
                </Button>
              </Col>
            </Row>
          </FormItem>


          <FormItem help={help}>
            {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input.Password
                  size="large"
                  type="password"
                  placeholder={project==='wlhy'?'请设置六位数字密码':formatMessage({ id: 'form.password.placeholder' })}
                  maxLength={project==='wlhy'?6:16}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
                // <Input.Password
                //   size="large"
                //   type="password"
                //   placeholder={'请设置六位数字密码'}
                //   maxLength={6}
                //   prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                // />
              )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.confirm-password.required' }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              // <Input.Password
              //   size="large"
              //   type="password"
              //   placeholder={'请设置六位数字密码'}
              //   maxLength={6}
              //   prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              // />
              <Input.Password
                size="large"
                type="password"
                placeholder={project==='wlhy'?'请设置六位数字密码':formatMessage({ id: 'form.confirm-password.placeholder' })}
                maxLength={project==='wlhy'?6:16}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            )}
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
              style={{width:'100%'}}
            >
              重置密码
            </Button>
          </FormItem>

          <div style={{textAlign: 'right',fontWeight: 'bold'}}>
            <Link to="/user/login">
              去登录
            </Link>
          </div>

        </Form>


      </div>
    );
  }
}

export default ForgetPwd;
