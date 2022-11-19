import React, { PureComponent } from 'react';
import { Button, Modal, NavBar } from 'antd-mobile';
import { Form, Icon } from 'antd';
import { router } from 'umi';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import { clientId } from '@/defaultSettings';
import { accountDetail, openAccount } from '@/services/KsWallet/AccountSerivce';
import { connect } from 'dva';
import style from './KsWallet.less';
import { InTheLoad } from '@/components/Stateless/Stateless';
import { MERDRIVER_DETAIL } from '@/actions/merDriver';
import { getCurrentUser, getUserType } from '@/utils/authority';


// const routerUrl = () => {
//   router.push(`/dashboard/function`);
// };

// window.gobackurl = function() {
//   // Toast.info('routerUrl')
//   routerUrl();
// };

@connect(({ merDriver,merVehicle }) => ({
  merDriver,merVehicle
}))
@Form.create()
class WalletOpen extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      loading: false,
      pageloading: false,
    };
  }

  componentDidMount() {
    const { match: { params: { type } } } = this.props;
    if (type !== 'not') {
      this.setState({
        pageloading: true,
      });
      accountDetail().then(item => {
        this.setState({
          pageloading: false,
        });
        if (item.success) {
          this.setState({
            detail: item.data,
          });
        }
      });
    }else if (clientId === 'kspt_driver'){
      this.setState({
        pageloading: true,
      });
      const { dispatch, } = this.props;
      dispatch(MERDRIVER_DETAIL(getCurrentUser().userId)).then(()=>{
        this.setState({
          pageloading: false,
        });
        const {merDriver:{detail}} = this.props
        this.setState({
          detail
        })
      })
    }
  }


  submit = () => {
    const { form ,match: { params: { type } }} = this.props;
    console.log(form.getFieldValue('certNo'),5555)
    const { detail } = this.state;
    console.log(detail,789)
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        this.setState({
          loading: true,
        });
        let params = {
          chanCode: '16',
          rebackUrl: '/kswallet/wallhomepage',
          customerType:clientId === 'kspt_driver'?2:clientId==='kspt_shf'&&custTypeFlag=== 1?3:0,
          ...values,
        }
        if (clientId === 'kspt_driver' ||clientId==='kspt_shf'&&custTypeFlag=== 1) {
          params = {
            ...params,
            // cpdId: type !== 'not' ? detail.cpdId :detail.id,
            cpdId:form.getFieldValue('certNo'),
          }
        }
        openAccount(params).then(resp => {
          this.setState({
            loading: false,
          });
          if (resp.success) {
            window.open(resp.data, '_self')
          }
        });
      }else if (Object.keys(errors).includes('certNo')){
        Modal.alert('您的身份证号格式有误', '去修改', [
          { text: 'Cancel', onPress: () => console.log('cancel') },
          { text: 'OK', onPress: () => router.push({
              pathname:`/driverSide/personal/DriverCertification/`,
              state:{ data:detail.id }
            })
          },
        ])
      }
    });
  };


  render() {
    const { form, match: { params: { type } } } = this.props;
    const { detail, loading, pageloading } = this.state;
    console.log(detail,998)
    const labelNumber = 7;
    const {custName,name,jszh,certNo,phone,mobileNo,legalRealName,legalCertNo,agentName,agentCertNo} = detail
    const propsText = {required:'required',form}
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    return (
      <div className={style.ksWallet}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            // router.push(`/dashboard/function`);
            // routerUrl()
            router.push( clientId !== 'kspt_driver'?'/driverSide/personal/personalShipper':'/driverSide/personal/personalCenter')
          }}
        >{type === '0' ? '修改' : '申请'}钱包开通
        </NavBar>
        {
          pageloading ? <InTheLoad /> : (
            clientId === 'kspt_driver' ||(custTypeFlag!==undefined&&custTypeFlag=== 1)?
              <div className='am-list'>
                <MatrixMobileInput {...propsText} id='custName' label='姓名' initialValue={type === 'not'?name:custName} placeholder='请输入姓名' maxLength={10} />
                <MatrixMobileInput {...propsText} id='certNo' numberType='isIdCardNo' label='身份证号' initialValue={type === 'not'?jszh: certNo} placeholder='请输入身份证号' maxLength={18} />
                <MatrixMobileInput {...propsText} id='mobileNo' numberType='isMobile' label='手机号' initialValue={type === 'not'?phone: mobileNo} placeholder='请输入手机号' maxLength={11} />
                <Button type="primary" style={{ marginTop: 15 }} loading={loading} onClick={this.submit}>提交</Button>
              </div> :
              <div className='am-list'>
                <MatrixMobileInput {...propsText} id='custName' label='企业名称' labelNumber={labelNumber} disabled placeholder='请输入企业名称' initialValue={type === 'not'?getCurrentUser().account: custName} maxLength={20} />
                <MatrixMobileInput {...propsText} id='certNo' label='信用代码' labelNumber={labelNumber} placeholder='请输入信用代码' initialValue={certNo} numberType='isCreditCode' maxLength={18} />
                <MatrixMobileInput {...propsText} id='legalRealName' label='法定代表人' labelNumber={labelNumber} placeholder='请输入法定代表人' initialValue={legalRealName} maxLength={10} />
                <MatrixMobileInput {...propsText} id='legalCertNo' label='法人身份证' labelNumber={labelNumber} placeholder='请输入法人身份证号' initialValue={legalCertNo} numberType='isIdCardNo' maxLength={18} />
                <MatrixMobileInput {...propsText} id='agentName' label='经办人' labelNumber={labelNumber} placeholder='请输入经办人' initialValue={agentName} maxLength={10} />
                <MatrixMobileInput {...propsText} id='agentCertNo' numberType='isIdCardNo' labelNumber={labelNumber} label='经办人身份证' placeholder='请输入经办人身份证号' initialValue={agentCertNo} maxLength={18} />
                <MatrixMobileInput {...propsText} id='mobileNo' numberType='isMobile' labelNumber={labelNumber} label='经办人手机号' placeholder='请输入经办人手机号' initialValue={mobileNo} maxLength={11} />
                <Button type="primary" style={{ marginTop: 15 }} loading={loading} onClick={this.submit}>提交</Button>
              </div>
          )
        }
      </div>
    );
  }
}

export default WalletOpen;
