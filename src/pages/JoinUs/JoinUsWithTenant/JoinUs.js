import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Select, Progress, Checkbox, Icon, Tooltip, Row, Col, message,AutoComplete } from 'antd';
import {  Toast,Modal } from 'antd-mobile';
import styles from '../JoinUs.less';
import Func from '@/utils/Func';
import AgreementForkspt from '@/pages/JoinUs/AgreementForkspt';
import { getToken} from '@/utils/authority';
import { clientId, loginTitle, project, currentTenant} from '../../../defaultSettings';
import func from '../../../utils/Func';
import { requestListApi, } from '../../../services/api';
import MyModal from '@/components/Util/MyModal';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = AutoComplete;
const {alert} = Modal;

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ joinus, loading }) => ({
  joinus,
  submitting: loading.effects['joinus/submit'],
}))
@Form.create()
class JoinUs extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    phoneSuffix: false,
    autoResult:[], // 拼音码
    shipperTenantId:currentTenant, // 当前租户id
    ifShowCust:true,
    ifShowCarrier:true,
    dataSource:'0',
    ifShowRegister:false,
  };

  componentDidUpdate() {
    const { form, joinus } = this.props;
    const account = form.getFieldValue('mail');
    if (joinus.status === 'ok') {
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  onGetCaptcha = () => {
    const { form } = this.props;
    const {shipperTenantId} = this.state
    const phone = form.getFieldValue('phone');
    if (Func.isEmpty(phone)){
      message.error(formatMessage({ id: 'validation.phone-number.required' }));
      return;
    }
    const myToken = getToken();
    fetch(`/api/mer-user/client/get-verification-code?account=${phone}&shipperTenantId=${shipperTenantId}&verificationCodeType=registerUser`,{
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
            if (count === 0) {
              clearInterval(this.interval);
            }else {
              count -= 1;
              this.setState({ count });
            }
          }, 1000);
        }else{
          message.error(data.msg);
        }
      })
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length && this.getPasswordStrength(value) > 3) {
      return 'ok';
    }
    if (value && value.length && this.getPasswordStrength(value) > 1) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const {dataSource,shipperTenantId} = this.state
    const { form, dispatch } = this.props;

    form.validateFields({ force: true }, (err, values) => {
      // console.log(err,values)
      if (!err) {
        if (values.agreement ===false){
          Toast.info("请勾选我已阅读并同意相关服务条款和隐私政策!");
        }else{
          alert('注册', `确定成为${loginTitle[shipperTenantId]}用户?`, [
            { text: '取消', style: 'default' },
            { text: '确定', onPress: () => {
                dispatch({
                  type: 'joinus/submit',
                  payload: {
                    ...values,
                    //  name:Func.isEmpty(values.name)?values.realName:values.name,
                    name:'-',
                    realName:'-',
                    account:values.phone,
                    roleId:'1290107043370971138', // 司机端 默认赋予权限
                    tenantId:shipperTenantId,
                    deptId:'1290107043467440129',
                    clientId,
                    shipperTenantId,
                    dataSource,
                    driverRoleType:2
                  },
                })
              } },
          ]);
        }
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPhone = (rule, value, callback) =>{
    if (Func.notEmpty(value)){
      this.setState({phoneSuffix: true})
    }else {
      this.setState({phoneSuffix: false})
    }
    callback();
  }

  checkPassword = (rule, value, callback) => {
    const { visible, } = this.state;
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
        else {
          callback();
        }
      }

  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
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

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');

    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={this.getPasswordStrength(value) * 10 === 40 ? 100 : this.getPasswordStrength(value) * 30}
          showInfo={false}
          size="small"
        />
      </div>
    ) : null;
  };

  formattedMessage = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    return (
      <div style={{ marginTop: 10 }}>
        <FormattedMessage id="validation.password.strength.msg" />
      </div>
    )
  }

  handleCancel = () => {
    this.setState({
      photovisible: false,
    });
  };

  agreement =()=>{
    this.setState({
      photovisible: true,
    });
  }

  getAgreement =(params, autoheight)=>{
    if(project === 'kspt'){
      return <AgreementForkspt params={params} autoheight={autoheight} />;
    }
  }

  handleSearch = (value) => {
    const { form } = this.props;
    const {shipperTenantId} = this.state
    this.setState({ autoResult: [] });
    const param = { 'sortl': value, 'type': clientId === 'kspt_shf'?'customer':'carrier' };
      if (func.notEmpty(value)) {
        param['Blade-DesignatedTenant'] = shipperTenantId
        param.tenantId = shipperTenantId
        requestListApi('/api/mer-user/client/get_sortl', param).then(resp=>{
          if (func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
            this.setState({ autoResult: resp.data });
          } else {
            console.log('拼音码无返回值/检查参数是否正确');
          }
        })

    }else {
        form.setFieldsValue({
          'custno': '',
        });
      }
  };

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
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count,help,phoneSuffix,photovisible,autoResult,ifShowCust,ifShowCarrier,ifShowRegister} = this.state;
    return (
      <div className={styles.main}>
        <h3>
          <FormattedMessage id="app.register.register" />
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

                />
              )}
            </InputGroup>
          </FormItem>
          {
            clientId === 'kspt_shf' && ifShowCust?
              <FormItem>
                {getFieldDecorator('custno',{
                  rules: [
                    {
                      required: true,
                      message: '客户不能为空',
                    }
                  ],
                })
                (
                  <AutoComplete
                    style={{width:'100%'}}
                    onSearch={this.handleSearch}
                    placeholder="拼音码检索客户"
                    onSelect={(v, o) => this.autoChange(v, o,'custno','custName')}
                  >
                    {autoResult.map(element => (
                      <Option key={element.code}>{element.name}</Option>
                    ))}
                  </AutoComplete>,
                )}
                {getFieldDecorator('custName', {
                })(<Input style={{ display: 'none' }} />)
                }
              </FormItem>:undefined
          }
          {
            clientId === 'kspt_cyf' && ifShowCarrier?
              <FormItem>
                {getFieldDecorator('carrierno',{
                  rules: [
                    {
                      required: true,
                      message: '请选择承运方',
                    }
                  ],
                })
                (
                  <AutoComplete
                    style={{width:'100%'}}
                    onSearch={this.handleSearch}
                    placeholder="请选择承运方"
                    onSelect={(v, o) => this.autoChange(v, o,'carrierno','carrierName')}
                  >
                    {autoResult.map(element => (
                      <Option key={element.code}>{element.name}</Option>
                    ))}
                  </AutoComplete>,
                )}
                {getFieldDecorator('carrierName', {
                })(<Input style={{ display: 'none' }} />)
                }
              </FormItem>:undefined
          }

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
                  placeholder='至少六位密码,区分大小写'
                  maxLength={16}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              )}
            {/* </Popover> */}
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
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('openId', {
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
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
              disabled={ifShowRegister}
            >
              <FormattedMessage id="app.register.joinus" />
            </Button>
            <Link className={`${styles.login} ${styles.code}`} to="/user/login">
              <FormattedMessage id="app.register.sign-in" />
            </Link>
          </FormItem>
          <FormItem>
            {getFieldDecorator('agreement', {
              valuePropName: 'checked',
              rules: [
                {
                  required: true,
                  message: '同意条款注册',
                },
              ],
            })(
              <Checkbox className={styles.checkbox}>
                <Link
                  className={styles.login}
                  onClick={this.agreement}
                >
                  我已阅读并同意相关服务条款和隐私政策
                </Link>
              </Checkbox>
            )}
          </FormItem>
        </Form>
        <MyModal
          top={0}
          modaltitel="服务条款"
          visible={photovisible}
          onCancel={this.handleCancel}
          popupContent={this.getAgreement}
          selectRow={[]}
          popupwidth={0.9}
          height={0.6}
          isfangdaDisplay={false}
        />
      </div>
    );
  }
}

export default JoinUs;
