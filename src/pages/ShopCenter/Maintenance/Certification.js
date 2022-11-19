import React, { PureComponent } from 'react';
import { Button, NavBar, Text, Toast } from 'antd-mobile';
import { Divider, Form, Icon } from 'antd';
import '../ShopCenter.less';
import { connect } from 'dva';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import {
  MAINTENACE_QUERY_COMPANY_AUTHDETAIL,
  MAINTENACE_QUERY_USER_AUTHDETAIL,
  MAINTENACE_SUBMIT_COMPANYAUTH,
  MAINTENACE_SUBMIT_PERSONAL,
} from '@/actions/maintenance';
import NetWorkImage from '@/components/NetWorks/NetWorkImage';
import { CompanyIcon, PersonIcon } from '@/components/Matrix/image';

@connect(({ maintenance, merDriver }) => ({
  maintenance,
  merDriver,
}))
@Form.create()
class Certification extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      detail:{},
      personalDetail:{},
    };
  };


  componentDidMount() {
    const { dispatch, match: { params: { type } } } = this.props;
    // const { dispatch } = this.props;
    /* 个人认证结果 */
    dispatch(MAINTENACE_QUERY_USER_AUTHDETAIL()).then(() => {
      const { maintenance: { detail: { personalDetail } } } = this.props;
      if (personalDetail && personalDetail.success) {
        this.setState({
          personalDetail: personalDetail.data,
        });
      }
    });
    if (type !== 'personal'){
      /* 企业认证结果 */
      dispatch(MAINTENACE_QUERY_COMPANY_AUTHDETAIL()).then(() => {
        const { maintenance: { detail: { companyDetail } } } = this.props;
        if (companyDetail && companyDetail.success) {
          this.setState({
            detail: companyDetail.data,
          });
        }
      });
    }
  }

  /* 提交 */
  onBtn = (type) => {
    const { form, dispatch ,
      match: {
         params: { id },
    },
    } = this.props;
    const { detail,personalDetail } = this.state;
    form.validateFieldsAndScroll((err, value) => {
      if (err) {
        const { portrait } = err;
        if (portrait) {
          Toast.fail(portrait.errors[0].message);
        }
      } else if (type === 'personal') {
        this.setState({
          loading: true,
        });
        /* 个人认证提交 */
          dispatch(MAINTENACE_SUBMIT_PERSONAL({ ...value,id:JSON.stringify(personalDetail) !== '{}'?personalDetail.id:''})).then(() => {
            const { maintenance: { submit: { personalSubmit } } } = this.props;
            this.setState({
              loading: false,
            });
            if (personalSubmit && personalSubmit.success) {
              if (personalSubmit.data.authUrl) {
                window.open(personalSubmit.data.authUrl,'_self')
              }
            }
          });
        // if (JSON.stringify(personalDetail) !== '{}') {
        //   const params = {
        //     id,
        //     ...value,
        //     userAuthId:personalDetail.id
        //   };
        //   dispatch(MAINTENACE_SUBMIT_UPDATE(params)).then(() => {
        //     const { maintenance: { submit: { updateCompanyUser } } } = this.props;
        //     this.setState({
        //       loading: false,
        //     });
        //     if (updateCompanyUser && updateCompanyUser.success) {
        //       Toast.success('修改成功');
        //     }
        //   })
        // }else {
        //   /* 个人认证提交 */
        //   dispatch(MAINTENACE_SUBMIT_PERSONAL({ ...value,id:JSON.stringify(personalDetail) !== '{}'?personalDetail.id:''})).then(() => {
        //     const { maintenance: { submit: { personalSubmit } } } = this.props;
        //     this.setState({
        //       loading: false,
        //     });
        //     if (personalSubmit && personalSubmit.success) {
        //       if (personalSubmit.data.authUrl) {
        //         window.open(personalSubmit.data.authUrl,'_self')
        //       }
        //     }
        //   });
        // }
      } else {
        /* 企业认证提交 */
        if (typeof value.imgUrl === 'object'){
          Toast.loading('图片上传中，请等待！');
          return
        }
        this.setState({
          loading: true,
        });
        dispatch(MAINTENACE_SUBMIT_COMPANYAUTH({  ...value, terminalType:1,id:JSON.stringify(detail) !== '{}'?detail.id:'' })).then(() => {
          const { maintenance: { submit: { companySubmit } } } = this.props;
          this.setState({
            loading: false,
          });
          if (companySubmit && companySubmit.success) {
            window.open(companySubmit.data.result.authUrl,'_self')
          }
        });
      }
    });
  };

  render() {
    const { form, match: { params: { type } } } = this.props;
    const { loading, detail,personalDetail,} = this.state;
    const labelNumber = 7;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            window.history.back();
          }}
        >{type === 'personal' ? '个人实名认证' : '组织机构认证'}
        </NavBar>
        <div className='am-list'>
          {
            type === 'personal' ? (
              <div style={{ width: '100%' }}>
                <MatrixMobileInput
                  required
                  id='applicant'
                  label='姓名'
                  placeholder='请输入姓名'
                  form={form}
                  labelNumber={labelNumber}
                  initialValue={JSON.stringify(personalDetail) !== '{}'?personalDetail.applicant:''}
                />
                <Divider className='dividerStyle' />
                <MatrixMobileInput
                  required
                  id='idCard'
                  label='身份证号'
                  numberType='isIdCardNo'
                  placeholder='请输入身份证号'
                  form={form}
                  labelNumber={labelNumber}
                  disabled={JSON.stringify(personalDetail) !== '{}' && true}
                  initialValue={JSON.stringify(personalDetail) !== '{}' ? personalDetail.idCard :''}
                />
                <Divider className='dividerStyle' />
                <MatrixMobileInput
                  required
                  id='contact'
                  label='手机号'
                  numberType='isMobile'
                  placeholder='请输入手机号'
                  form={form}
                  labelNumber={labelNumber}
                  initialValue={JSON.stringify(personalDetail) !== '{}'?personalDetail.contact:''}
                />
                <Divider className='dividerStyle' />
                <div style={{margin:'15px',}}>
                  <span style={{color:'red'}}>*个人认证信息请填写公司法人正确信息，否则会影响后续的企业认证及合同签约。手机号需使用法人实名认证并办理的号码</span>
                </div>
                <Button
                  type="primary"
                  style={{ marginTop: 15}}
                  loading={loading}
                  onClick={() => this.onBtn(type)}
                >提交
                </Button>
              </div>) : (
                <div style={{ width: '100%' }}>
                  <div style={{marginBottom:'8px',marginTop:'8px'}}>
                    <div>
                      <img src={PersonIcon} alt='' style={{width:'15px',height:'15px',marginLeft:'15px',marginBottom:'5px',}} />
                      <Text style={{paddingLeft:'5px',fontSize:'15px',fontWeight:'500',lineHeight:'15px'}}>申请人信息</Text>
                    </div>
                    <Divider className='dividerStyle' />
                    <MatrixMobileInput
                      required
                      id='applicantName'
                      label='姓名'
                      placeholder='请输入申请人姓名'
                      form={form}
                      disabled={JSON.stringify(personalDetail) !== '{}' && true}
                      initialValue={JSON.stringify(personalDetail) !== '{}'?personalDetail.applicant:''}
                      labelNumber={labelNumber}
                    />
                    <Divider className='dividerStyle' />
                    <MatrixMobileInput
                      required
                      id='applicantPhone'
                      label='手机号'
                      numberType='isMobile'
                      placeholder='请输入申请人手机号'
                      form={form}
                      disabled={JSON.stringify(personalDetail) !== '{}' && true}
                      initialValue={JSON.stringify(personalDetail) !== '{}'?personalDetail.contact:''}
                      labelNumber={labelNumber}
                    />
                  </div>
                  <div>
                    <div>
                      <img src={CompanyIcon} alt='' style={{width:'15px',height:'15px',marginLeft:'15px',marginBottom:'5px'}} />
                      <Text style={{paddingLeft:'5px',fontSize:'15px',fontWeight:'500',lineHeight:'15px'}}>企业信息</Text>
                    </div>
                    <Divider className='dividerStyle' />
                    <MatrixMobileInput
                      required
                      id='name'
                      label='企业名称'
                      placeholder='请输入企业名称'
                      form={form}
                      initialValue={JSON.stringify(detail) !== '{}'?detail.name:''}
                      labelNumber={labelNumber}
                    />
                    <Divider className='dividerStyle' />
                    <MatrixMobileInput
                      id='registerNo'
                      required
                      label='信用代码'
                      placeholder='请输入统一社会信用代码'
                      numberType='isSocialCode'
                      form={form}
                      initialValue={JSON.stringify(detail) !== '{}'?detail.registerNo:''}
                      labelNumber={labelNumber}
                    />
                    <Divider className='dividerStyle' />
                    <NetWorkImage
                      label='营业执照'
                      id='imgUrl'
                      labelNumber={labelNumber}
                      required
                      url={JSON.stringify(detail) !== '{}'?detail.imgUrl:''}
                      form={form}
                    />
                    <Divider className='dividerStyle' />
                    <MatrixMobileInput
                      id='legalPerson'
                      required
                      label='法定代表人'
                      placeholder='请输入法定代表人'
                      form={form}
                      initialValue={JSON.stringify(personalDetail) !== '{}'?personalDetail.applicant:''}
                      labelNumber={labelNumber}
                    />
                    <Divider className='dividerStyle' />
                  </div>


                  <Button
                    type="primary"
                    style={{ marginTop: 15 }}
                    loading={loading}
                    onClick={() => this.onBtn(type)}
                  >{JSON.stringify(detail) !== '{}' ? '再次提交' : '提交'}
                  </Button>
                </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default Certification;
