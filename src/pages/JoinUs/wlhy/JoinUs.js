import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Select, Progress, Checkbox, Icon, Tooltip, Row, Col, message,AutoComplete } from 'antd';
import {  Toast,Modal } from 'antd-mobile';
import styles from '../JoinUs.less';
import Func from '@/utils/Func';
import MyModal from '@/components/Util/MyModal';
import Agreement from '@/pages/JoinUs/Agreement';
import AgreementForwlhy from '@/pages/JoinUs/AgreementForwlhy';
import { getToken} from '@/utils/authority';
import { clientId, loginTitle, project } from '../../../defaultSettings';
import func from '../../../utils/Func';
import { tenantDetailByTenantId, requestListApi, getTenantList, requestApi } from '../../../services/api';
import { getParamSkipToken } from '../../../services/param';

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
class JoinUsWlhy extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    // prefix: '86',
    photovisible : false,
    top: '0',
    popupwidth: 0.9,
    height: 0.6,
    isfangdaDisplay: false,
    phoneSuffix: false,
    //  realNameSuffix: false,
    //  sfzSuffix: false,
    relationTenantName:[],
    autoResult:[], // 拼音码
    shipperTenantId:'',
    ifShowCust:true,
    ifShowCarrier:true,
    dataSource:'0',
    ifShowRegister:false
  };


  componentDidMount() {
    const defaultfhf =[]
    getTenantList({tenantName:''}).then(resp =>{
      if(resp.success){
        (resp.data || []).forEach(item => {
          defaultfhf.push({
            key:item.tenantId,
            value:item.tenantName
          })
        });
        this.setState({
          relationTenantName:defaultfhf
        })
      }
    })
    let tenantId = ''
    try {
      tenantId=TenantId.getTenantId()?TenantId.getTenantId():''
    } catch (e) {
      // 通过过去前台登陆路径获取当前登陆的租户号
      const loginHref = window.location.href;
      const loginUrl = loginHref.split('/');
      tenantId = loginUrl[loginUrl.length-1] === 'joinus' || loginUrl[loginUrl.length-1] === ''?'':loginUrl[loginUrl.length-1]
    }
    this.setState({
      shipperTenantId:tenantId
    })
  }

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
    let {shipperTenantId} = this.state
    const phone = form.getFieldValue('phone');
    if (Func.isEmpty(phone)){
      message.error(formatMessage({ id: 'validation.phone-number.required' }));
      return;
    }
    const myToken = getToken();
    if(project === 'wlhy')
    {
      shipperTenantId='077778'
    }else {
      shipperTenantId = form.getFieldValue('shipperTenantId') ? form.getFieldValue('shipperTenantId') : shipperTenantId
      if (!shipperTenantId) {
        message.info('请选择发货方')
        return;
      }
    }
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
    const {shipperTenantId,dataSource} = this.state
    const { form, dispatch } = this.props;
    // console.log(form.getFieldsValue(),'=====')
    if(shipperTenantId){
      form.setFieldsValue({shipperTenantId})
    }
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        if (values.agreement ===false){
          Toast.info("请勾选我已阅读并同意相关服务条款和隐私政策!");
        }else{
          if(project === 'wlhy')
          {
            values.shipperTenantId='077778'
          }
          const realshipperTenantId = values.shipperTenantId?values.shipperTenantId:shipperTenantId
          let title = ''
          if (values.shipperTenantId === '077778' && project === 'wlhy'){
            title = '网络货运平台'
          }else {
            title = loginTitle[realshipperTenantId]
          }
          alert('注册', `确定成为${title}用户?`, [
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
                    tenantId:realshipperTenantId,
                    deptId:'1290107043467440129',
                    clientId,
                    shipperTenantId:realshipperTenantId,
                    dataSource,
                    driverRoleType:project && project==='wlhy'?1:2
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

  checkRealName = (rule, value, callback) =>{
    if (Func.notEmpty(value)){
      this.setState({realNameSuffix: true})
    }else {
      this.setState({realNameSuffix: false})
    }
    callback();
  }

  checksfz = (rule, value, callback) =>{
    if (Func.notEmpty(value)){
      this.setState({sfzSuffix: true})
    }else {
      this.setState({sfzSuffix: false})
    }
    callback();
  }

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty,shipperTenantId } = this.state;
    // console.log(shipperTenantId,'===shipperTenantId')
    if(shipperTenantId === '077779' || project==='wlhy'){ // 宁煤、网络货运校验方式复杂
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
    }else {
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
        } else if (this.getPasswordStrength(value) >1){
          const { form } = this.props;
          if (value && confirmDirty) {
            form.validateFields(['confirm'], { force: true });
          }
          callback();
        }
        /* else { // 需输入包含大小字母、数字、符号中至少2种
           this.setState({
             help: formatMessage({ id: 'validation.password.required.two-types' }),
             visible: !!value,
           });
           callback('error');
         } */
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
    if(project === 'wlhy'){
      return <AgreementForwlhy params={params} autoheight={autoheight} />;
    }
    return <Agreement params={params} autoheight={autoheight} />;

  }

  handleSearch = (value) => {
    const { form } = this.props;
    const {shipperTenantId} = this.state
    this.setState({ autoResult: [] });
    const param = { 'sortl': value, 'type': clientId === 'kspt_shf'?'customer':'carrier' };
    const tenantId = form.getFieldValue('shipperTenantId')?form.getFieldValue('shipperTenantId'):shipperTenantId

    if (func.notEmpty(value)) {
      if(func.notEmpty(tenantId)){
        param['Blade-DesignatedTenant'] = tenantId
        param.tenantId = tenantId
        requestListApi('/api/mer-user/client/get_sortl', param).then(resp=>{
          if (func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
            this.setState({ autoResult: resp.data });
          } else {
            console.log('拼音码无返回值/检查参数是否正确');
          }
        })
      } else {
        message.info('请先选择发货方')
      }
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

  // 发货方选择后
  selectShipper=(value)=>{
    // const {shipperTenantId,ifShowCust} = this.state
    const param = {'key':'regist.ifShowRegister',tenantId:value}
    getParamSkipToken(param).then(resp => {
      if (clientId ==='kspt_driver' || (resp.success && Func.notEmpty(resp.data) && JSON.stringify(resp.data) !== '{}')) {
        // 配置了 可以注册
        tenantDetailByTenantId({tenatId:value}).then(resp=>{
          const shipperTenantIdType = resp.data.dataSource
          if(shipperTenantIdType === '0'){ // 平台租户 不用选客户/承运商
            this.setState({
              ifShowCust:false,
              ifShowCarrier:false,
              dataSource:shipperTenantIdType,
            })
          }
        })
        this.setState({
          ifShowRegister:false
        })
      }else {
        Toast.info('该厂区不允许注册')
        this.setState({
          ifShowRegister:true
        })
      }
    });
  }

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count,help, photovisible, top, popupwidth, height, isfangdaDisplay,
      phoneSuffix,relationTenantName,autoResult,shipperTenantId,ifShowCust,ifShowCarrier,ifShowRegister } = this.state;
    return (
      <div className={styles.main}>
        <h3>
          <FormattedMessage id="app.register.register" />
        </h3>
        <Form onSubmit={this.handleSubmit}>
          {
            project!== 'wlhy'?
              <FormItem style={{display:shipperTenantId?'none':'block'}}>
                {getFieldDecorator('shipperTenantId',{
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
                    onSelect={(e)=>this.selectShipper(e)}
                  >
                    {relationTenantName.map(d => (
                      <Select.Option key={d.key} value={d.key} >
                        {d.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              :
              ''
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
          {/* <FormItem>
            {getFieldDecorator('realName', {
              rules: [
                {
                  required: true,
                  message: '请输入姓名!',
                },
                {
                  pattern: /^[^\s]*$/,
                  message: '禁止输入空格',
                }
                ,
                {
                  validator: this.checkRealName
                }
                // {
                //   type: 'userName',
                //   message: formatMessage({ id: 'validation.userName.required' }),
                // },
              ],
            })(
              <Input
                size="large"
                placeholder='姓名'
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                suffix={
                  realNameSuffix?
                    ""
                    :
                    <Tooltip title="请输入姓名!">
                      <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                }
              />
              // <Input size="large" placeholder={formatMessage({ id: 'app.login.userName' })} />
            )}
          </FormItem>
           <FormItem>
            {getFieldDecorator('sfz', {
              rules: [
                {
                  required: true,
                  message: '请输入身份证号码!',
                },
                {
                  pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                  message: '身份证号码格式错误                     },
                {
                  validator: this.checksfz
                }
              ],
            })(
              <Input
                size="large"
                placeholder='身份证号码'
                prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                suffix={
                  sfzSuffix?
                    ""
                    :
                    <Tooltip title="请输入身份证号码!">
                      <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                }
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: false,
                  message: formatMessage({ id: 'validation.email.required' }),
                },
                {
                  type: 'email',
                  message: formatMessage({ id: 'validation.email.wrong-format' }),
                },
              ],
            })(
              <Input
                size="large"
                placeholder={formatMessage({ id: 'form.email.placeholder' })}
                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: false,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
                // {
                //   type: 'userName',
                //   message: formatMessage({ id: 'validation.userName.required' }),
                // },
              ],
            })(
              <Input
                size="large"
                placeholder='昵称'
                prefix={<Icon type="user-add" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
              // <Input size="large" placeholder={formatMessage({ id: 'app.login.userName' })} />
            )}
          </FormItem> */}
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
                placeholder={project==='wlhy'?'请设置六位数字密码':formatMessage({ id: 'form.confirm-password.placeholder' })}
                maxLength={project==='wlhy'?6:16}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            )}
          </FormItem>

          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
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
              </Checkbox>,

            )}
          </FormItem>
        </Form>

        <MyModal
          top={top}
          modaltitel="服务条款"
          visible={photovisible}
          onCancel={this.handleCancel}
          popupContent={this.getAgreement}
          selectRow={[]}
          popupwidth={popupwidth}
          height={height}
          isfangdaDisplay={isfangdaDisplay}
        />
      </div>
    );
  }
}

export default JoinUsWlhy;
