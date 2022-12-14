import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Checkbox, Icon, Tooltip } from 'antd';
import { Toast } from 'antd-mobile';
import styles from '../JoinUs.less';
import Func from '@/utils/Func';
import AgreementForkspt from '@/pages/JoinUs/AgreementForkspt';
import { clientId, loginTitle } from '../../../defaultSettings';
import MyModal from '@/components/Util/MyModal';

const FormItem = Form.Item;
const InputGroup = Input.Group;

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
    showShipperTenantId: '',
    ifShowCust: true,
    ifShowCarrier: true,
    dataSource: '0',
    ifShowRegister: false,
    showTenant: false,
  };

  componentDidMount() {
    let tenantId = '';
    try {
      tenantId = TenantId.getTenantId() ? TenantId.getTenantId() : '';
    } catch (e) {
      tenantId = localStorage.getItem('tenantId');
    }
    const { form } = this.props;
    form.setFieldsValue({
      shipperTenantId: tenantId,
      shipperTenantName: tenantId !== 'login' ? loginTitle[tenantId] : '',
    });
    this.setState({
      showShipperTenantId: tenantId,
    });
  }

  componentDidUpdate() {
    const { form, joinus } = this.props;
    const account = form.getFieldValue('mail');
    console.log(account);
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
    const { dataSource } = this.state;
    const { form, dispatch } = this.props;

    form.validateFields({ force: true }, (err, values) => {
      if (!!err) {
        return;
      }
      if (values.agreement === false) {
        Toast.info('???????????????????????????????????????????????????????????????!');
        return;
      }
      const realshipperTenantId = values.shipperTenantId;
      dispatch({
        type: 'joinus/submit',
        payload: {
          ...values,
          name: '-',
          realName: '-',
          account: values.phone,
          roleId: '1290107043370971138', // ????????? ??????????????????
          tenantId: realshipperTenantId,
          deptId: '1290107043467440129',
          clientId,
          shipperTenantId: realshipperTenantId,
          dataSource,
          driverRoleType: 2,
        },
      });
    });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPhone = (rule, value, callback) => {
    if (Func.notEmpty(value)) {
      this.setState({ phoneSuffix: true });
    } else {
      this.setState({ phoneSuffix: false });
    }
    callback();
  };

  checkPassword = (rule, value, callback) => {
    const { visible } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
      return
    }
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
      return
    }
    callback();
  };


  getPasswordStrength = password => {
    let strength = 0;

    // ????????????????????????????????????
    if (password.length < 1) return strength;
    if (/\d/.test(password)) strength += 1; // ??????
    if (/[a-z]/.test(password)) strength += 1; // ??????
    if (/[A-Z]/.test(password)) strength += 1; // ??????
    if (/\W/.test(password)) strength += 1; // ????????????
    return strength;
  };

  formattedMessage = () => {
    return (
      <div style={{ marginTop: 10 }}>
        <FormattedMessage id="validation.password.strength.msg" />
      </div>
    );
  };

  handleCancel = () => {
    this.setState({
      photovisible: false,
      showTenant: false,
    });
  };

  agreement = () => {
    this.setState({
      photovisible: true,
    });
  };

  getAgreement = (params, autoheight) => {
    return <AgreementForkspt params={params} autoheight={autoheight} />;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const {
      help,
      phoneSuffix,
      photovisible,
      ifShowRegister,
    } = this.state;
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
                    validator: this.checkPhone,
                  },
                ],
              })(
                <Input
                  size="large"
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
                  prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={
                    phoneSuffix ? (
                      ''
                    ) : (
                      <Tooltip title={formatMessage({ id: 'validation.phone-number.required' })}>
                        <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    )
                  }
                />
              )}
            </InputGroup>
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
                placeholder="??????????????????,???????????????"
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
                  message: '??????????????????',
                },
              ],
            })(
              <Checkbox className={styles.checkbox}>
                <Link className={styles.login} onClick={this.agreement}>
                  ??????????????????????????????????????????????????????
                </Link>
              </Checkbox>
            )}
          </FormItem>
        </Form>
        <MyModal
          top={0}
          modaltitel="????????????"
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
