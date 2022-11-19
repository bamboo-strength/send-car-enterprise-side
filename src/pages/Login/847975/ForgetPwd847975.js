import React, { Component } from 'react';
import { connect } from 'dva/index';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { AutoComplete, Button, Col, Form, Icon, Input, message, Row, Tooltip } from 'antd/lib/index';
import router from 'umi/router';
import styles from '../Login.less';
import Func from '@/utils/Func';
import { getToken } from '@/utils/authority';
import { requestApiByJson, requestListApi } from '../../../services/api';
import { clientId } from '../../../defaultSettings';
import func from '../../../utils/Func';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = AutoComplete;

@connect(({ joinus, loading }) => ({
  joinus,
  submitting: loading.effects['joinus/submit'],
}))
@Form.create()
class ForgetPwd847975 extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    phoneSuffix: false,
    autoResult:[], // 客户拼音码
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  onGetCaptcha = () => { // 获取验证码
    const { form } = this.props;
    const phone = form.getFieldValue('phone');
    if (Func.isEmpty(phone)){
      message.error(formatMessage({ id: 'validation.phone-number.required' }));
      return;
    }

    const myToken = getToken();

    fetch(`/api/mer-user/client/get-verification-code?account=${phone}&shipperTenantId=847975&verificationCodeType=resetPassword`,{
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
        const value = {
          ...values,
          tenantId:'847975'
        }
        requestApiByJson('/api/mer-user/client/merDriver/forget_password',value).then(resp=>{
          if(resp.success){
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
        help: formatMessage({ id: 'validation.password.required' }),
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
      if (value.length < 6) {
        this.setState({
          help: formatMessage({ id: 'validation.password.required.length' }),
          visible: !!value,
        });
        callback('error');
      }
      callback();
     /*   else if (this.getPasswordStrength(value) >1){
          const { form } = this.props;
          if (value && confirmDirty) {
            form.validateFields(['confirm'], { force: true });
          }
          callback();
        }else {
          this.setState({
            help: formatMessage({ id: 'validation.password.required.two-types' }),
            visible: !!value,
          });
          callback('error');
        } */
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

  handleSearch = (value) => {
    const { form } = this.props;
    this.setState({ autoResult: [] });
    const param = { 'sortl': value, 'type': clientId === 'kspt_shf'?'customer':'carrier' };

    if (func.notEmpty(value)&& value.length>=2) {
      // if(func.notEmpty(tenantId)){
      param['Blade-DesignatedTenant'] = '847975'
      param.tenantId = '847975'
      requestListApi('/api/mer-user/client/get_sortl', param).then(resp=>{
        if (func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
          this.setState({ autoResult: resp.data });
        } else {
          console.log('拼音码无返回值/检查参数是否正确');
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

  autoChange = (value, o,id, labelId, ) => {
    const {form,} = this.props;
    // 根据客户名称带出手机号
    const name = o.props.children
    if(id === 'custName'){
      requestListApi('/api/mer-user/client/getPhoneByAccount', {account:name,shipperTenantId:'847975'}).then(resp=>{
        if (resp.success) {
          form.setFieldsValue({
            phone:resp.data.phone
          })
        }
      })
    }
    form.setFieldsValue(
      {
        [id]: value,
        [labelId]: name,
      },
    );
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, help, phoneSuffix,autoResult} = this.state;
    return (
      <div className={styles.main}>
        <h3>
          重置密码
        </h3>
        <Form onSubmit={this.handleSubmit}>
          {
            clientId ==='kspt_shf'?
              <FormItem>
                {getFieldDecorator('custName',{
                  rules: [
                    {
                      required: true,
                      message: '客户不能为空',
                    }
                  ],
                  // initialValue: localStorage.getItem('rememberAccount')
                })
                (
                  <AutoComplete
                    style={{width:'100%'}}
                    onSearch={this.handleSearch}
                    placeholder="拼音码检索客户"
                    onSelect={(v, o) => this.autoChange(v, o,'custName','username')}
                  >
                    {autoResult.map(element => (
                      <Option key={element.code}>{element.name}</Option>
                    ))}
                  </AutoComplete>,
                )}
                {getFieldDecorator('username', {
                  //   initialValue: localStorage.getItem('rememberAccount')
                })(<Input style={{ display: 'none' }} />)
                }
              </FormItem>:undefined
          }
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
                  disabled={clientId==='kspt_shf'}
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

                />
              )}
            </InputGroup>
          </FormItem>
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
                  placeholder={formatMessage({ id: 'form.password.placeholder' })}
                  maxLength={16}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
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
              <Input.Password
                size="large"
                type="password"
                placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
                maxLength={16}
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

export default ForgetPwd847975;
