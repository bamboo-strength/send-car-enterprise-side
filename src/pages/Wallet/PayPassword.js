import React, { PureComponent } from 'react';
import { Form, Card, Button, Icon, Input, Row, Col, message } from 'antd';
import { connect } from 'dva';
import { NavBar,  WhiteSpace, WingBlank, Toast, } from 'antd-mobile';
import { formatMessage, } from 'umi/locale';
import router from 'umi/router';
import styles from '@/pages/JoinUs/JoinUs.less';
import Func from '@/utils/Func';
import { getToken } from '@/utils/authority';
import { submit, reset } from '@/services/paypassword';
import md5 from 'js-md5';

const FormItem = Form.Item;

@connect(({ merDriver }) => ({
  merDriver,
}))
@Form.create()
class PayPassword extends PureComponent {
  state = {
    help: '',
    help1: '',
    state: '',
    count: 0,
    loading:false
  };



  componentWillMount() {
    const { location } = this.props;
    this.setState({
      state: location.state.passwordstate,
    });
  }

  goReturn = () => {
    router.push('/wallet/wallet');
  };

  handleSubmit = () => {
    // alert.info("信息填写有误,请修改后重试")
    const { form, } = this.props;
    const { state } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
         // password: CryptoJs.MD5(values.password).toString(),
          password:md5(values.password),
         //  password:values.password,
          phoneno: values.phoneno,
          verificationcode: values.verificationcode,
        };
        delete params.confirm;
        this.setState({
          loading:true
        })
        if (state === 0) {
          submit(params).then((resp) => {
            if (resp.success) {
              Toast.success('设置成功');
              this.goReturn();
            }
            this.setState({
              loading:false
            })
          });
        } else {
          reset(params).then((resp) => {
            if (resp.success) {
              Toast.success('设置成功');
              this.goReturn();
            }
            this.setState({
              loading:false
            })
          });
        }
      }
    });
  };

  checkConfirm = (rule, value, callback) => {
    const { visible } = this.state;
    const { form } = this.props;
    if (!value) {
      this.setState({
        help1: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help1: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (! /^(^-?\d+$)$/.test(value)) {
        this.setState({
          help1: '请输入纯数字密码',
        });
        callback('请输入数字！');
      }
      if (value && value !== form.getFieldValue('password')) {
        this.setState({
          help1: '两次输入的密码不同！',
        });
        callback(formatMessage({ id: 'validation.password.twice' }));
      } else {
        callback();
      }
      if (value.length > 6) {
        this.setState({
          help1: '请输入六位数字密码',
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

  checkPassword = (rule, value, callback) => {
    const { visible } = this.state;
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
      if ((! /^(^-?\d+$)$/.test(value))||(!/^([0-9]\d*(\.\d+)?|0)$/.test(value))) {
        this.setState({
          help: '请输入纯数字密码',
        });
        callback('请输入数字！');
      }
      if (value.length !== 6) {
        this.setState({
          help: '请输入六位数字密码',
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


  onGetCaptcha = () => {
    const { form } = this.props;
    const phone = form.getFieldValue('phoneno');
    if (Func.isEmpty(phone)) {
      message.error(formatMessage({ id: 'validation.phone-number.required' }));
      return;
    }
    const myToken = getToken();
    fetch(`/api/mer-user/client/get-verification-code?account=${phone}&verificationCodeType=resetPassword`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic c3dvcmQ6c3dvcmRfc2VjcmV0',
        'Blade-Auth': myToken,
      },
      name: 'captcha',
      // body: formData,
      mode: 'cors',
      cache: 'default',
    })
      .then(res => res.json())
      .then((data) => {
        if (data.success) {
          message.success(data.msg);
          let count = 59;
          this.setState({ count });
          this.interval = setInterval(() => {
            if (count === 0) {
              clearInterval(this.interval);
            } else {
              count -= 1;
              this.setState({ count });
            }
          }, 1000);
        } else {
          message.error(data.msg);
        }
      });
  };

  render() {
    const { merDriver: { detail }, form: { getFieldDecorator }, } = this.props;

    const { help, help1, state, count,loading } = this.state;

    const action = (
      <WingBlank>
        <Button type="primary" block style={{ marginTop: '10px' }} onClick={this.handleSubmit} loading={loading}>
          完成
        </Button>
      </WingBlank>
    );
    return (
      <div>
        <div>
          {state === 0 ?
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={this.goReturn}
            >设置支付密码
            </NavBar>
            :
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={this.goReturn}
            >重置支付密码
            </NavBar>
          }
        </div>
        <div className='am-list'>
          <Form style={{ marginTop: 8 }}>
            <Card bordered={false}>
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
                    placeholder='请设置六位数字支付密码'
                    type="num"
                    maxLength={6}
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />,
                )}
              </FormItem>
              <WhiteSpace size="xl" />
              <FormItem help={help1}>
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
                    type="num"
                    placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
                    maxLength={6}
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />,
                )}
              </FormItem>
              <WhiteSpace size="xl" />
              <FormItem>
                {getFieldDecorator('phoneno', {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                  initialValue: detail.phone,
                })(
                  <Input
                    size="large"
                    placeholder='请输入手机号'
                    type="phone"
                    disabled
                    maxLength={11}
                  />,
                )}
              </FormItem>
              <WhiteSpace size="xl" />
              <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('verificationcode', {
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
                      />,
                    )}
                  </Col>
                  <Col span={8}>
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
              {action}
            </Card>
          </Form>
        </div>
      </div>
    );
  }
}

export default PayPassword;
