import React, { PureComponent } from 'react';
import { Modal, NavBar } from 'antd-mobile';
import { Avatar, Icon } from 'antd';
import { router } from 'umi';
import Meta from 'antd/lib/card/Meta';
import './KsWallet.less';
import Text from 'antd/lib/typography/Text';
import { connect } from 'dva';
import { IconBalance, IconBill, IconWithdrawal } from '@/components/Matrix/image';
import { queryOpenStatus, queryPersonOpenStatus } from '@/services/KsWallet/AccountSerivce';
import WalletPage from './WalletPage';
import { clientId, logoImgUrl, project } from '@/defaultSettings';
import { getCurrentUser, getUserType } from '@/utils/authority';
import { MERDRIVER_DETAIL } from '@/actions/merDriver';
import { getTenantId } from '@/pages/Merchants/commontable';
import { InTheLoad } from '@/components/Stateless/Stateless';
import { MERVEHIVL_LIST } from '@/actions/merVehicle';

const {alert} = Modal

const routerUrl = () => {
  router.push( clientId !== 'kspt_driver'?'/driverSide/personal/personalShipper':'/driverSide/personal/personalCenter')
};

window.gobackurl = () =>{
  router.push( clientId !== 'kspt_driver'?'/driverSide/personal/personalShipper':'/driverSide/personal/personalCenter')
};

@connect(({ merDriver,merVehicle }) => ({
  merDriver,merVehicle
}))
class WalletHomePage extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      ifOpen:-1,
      detail:{},
      loading:true
    };
  }

  componentDidMount() {
    const { dispatch,history } = this.props;
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    if (clientId === 'kspt_driver'){
      dispatch(MERDRIVER_DETAIL(getCurrentUser().userId)).then(()=>{
        const {merDriver:{detail}} = this.props
        if (JSON.stringify(detail) === '{}'){
          alert('司机未认证','请前去司机认证',[
            {text:'取消',onPress:()=>router.push('/dashboard/function')},
            {text:'去认证',onPress:()=>router.push({
                pathname:`/driverSide/personal/DriverCertification/`,
                state:{ data:detail.id }
              })
            }
          ])
          return
        }
        this.setState({
          detail
        })
        const param = {
          current:1,
          size:5
        }
        dispatch(MERVEHIVL_LIST(param)).then(() => {
          const { merVehicle: { data } } = this.props;
          if (data.list.length === 0){
            alert('车辆未认证','请前去进行车辆认证',[
              {text:'取消',onPress:()=>router.push(history.goBack())},
              {text:'去认证',onPress:()=>router.push('/driverSide/personal/myCars')}
            ])
          }
        })
      });
    }
    if (clientId === 'kspt_shf'&&custTypeFlag===1){
      const {userId} = getCurrentUser()
      queryPersonOpenStatus({ "subAcctName": userId }).then(resp=>{
        this.setState({
          loading:false
        })
        if(resp.success){
          this.setState({
            ifOpen:resp.data // -1=未提交申请记录;0=申请中,1=申请完成，2=申请已驳回
          })
        }
      })
    }else{
      queryOpenStatus().then(resp=>{
        this.setState({
          loading:false
        })
        if(resp.success){
          this.setState({
            ifOpen:resp.data // -1=未提交申请记录;0=申请中,1=申请完成，2=申请已驳回
          })
        }
      });
    }


  }

  render() {
    const permisslist = [
      {img:IconBalance,text:'查询余额'},
      {img:IconBill,text:'查询账单'},
      {img:IconWithdrawal,text:'在线提现'},
    ]
    const {detail,loading,ifOpen} =this.state
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            // router.push( clientId !== 'kspt_driver'?'/driverSide/personal/personalShipper':'/driverSide/personal/personalCenter')
            // router.push('/dashboard/function')
            routerUrl()
          }}
        >我的钱包
        </NavBar>
        { loading ? <InTheLoad />:(
          ifOpen === 1? // 申请成功
            <WalletPage />:(
              <div className='am-list'>
                <div className="home-page-div">
                  <Meta
                    avatar={<Avatar src={project==='wlhy'?`${logoImgUrl}/personalImg/wlhy.jpg`:`${logoImgUrl}/personalImg/${getTenantId()}.jpg`} />}
                    title={detail.name ? detail.name:getCurrentUser().realname}
                    description={ifOpen === -1?'未申请开通':ifOpen === 0?'钱包申请中':ifOpen === 1?'申请完成':"申请已驳回"}
                    className="home-page-meta"
                  />
                  <div className='home-page-open' onClick={()=>router.push(`/kswallet/wallhomepage/walletopen/${ifOpen === -1?'not':ifOpen}`)}>
                    {ifOpen === -1?'申请开通':"修改申请"}
                  </div>
                </div>
                <div className='home-page-permissions'>
                  <div>开通钱包拥有以下权限</div>
                  <div className='per-round'>
                    {
                      permisslist.map(item=>{
                        return (
                          <div className='per-div'>
                            <img src={item.img} alt='' />
                            <Text>{item.text}</Text>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    );
  }
}
export default WalletHomePage
