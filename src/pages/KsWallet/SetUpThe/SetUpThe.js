import React, { PureComponent } from 'react';
import { router } from 'umi';
import { Icon, List, NavBar } from 'antd-mobile';
import { ChangePassword, ResetPassword } from '@/services/KsWallet/AccountSerivce';
import { clientId } from '@/defaultSettings';
import { getCurrentUser, getUserType } from '@/utils/authority';

const { Item } = List;

const routerUrl = () => {
  router.push(`/kswallet/wallhomepage`);
};

// window.gobackurl = function() {
//   routerUrl();
// };

class SetUpThe extends PureComponent {

  /* 企业结算帐户、个人结算账户 */
  jump = () => {
    // 0=待打款，1=绑定成功，2=绑定失败，3=未绑定(绑定中)
    // ifSettlement().then(resp => {
    //   if (resp.success) {
    //     if (resp.data === 0) {
    //       Toast.fail('正在首笔打款认证，请等待！');
    //     } else if (resp.data === 2 || resp.data === 3) {
    //       router.push('/kswallet/personalsettleaccount/unboundcard/1'); // 绑定银行卡
    //     } else if (resp.data === 1) {
    //       router.push('/kswallet/personalsettleaccount/unboundcard/2'); // 银行卡列表
    //     }
    //   }
    // });
    router.push('/kswallet/personalsettleaccount/unboundcard/2'); // 银行卡列表
  };

  // 修改支付密码
  xiu = () => {
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    localStorage.setItem('package',3)
    ChangePassword({ chanCode: 16, rebackUrl: '/kswallet/wallhomepage' ,userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:undefined}).then(resp => {
      if (resp.success) {
        window.open(resp.data, '_self');
      }
    });
  };

  // 重置支付密码
  reset = () => {
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    ResetPassword({ chanCode: 16, rebackUrl: '/kswallet/wallhomepage',userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:undefined }).then(resp => {
      if (resp.success) {
        window.open(resp.data, '_self');
      }
    });
  };

  // 钱包账户信息
  xinxi = () => {
    router.push(`/kswallet/personalsettleaccount/accountinformation`);
  };

  render() {
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            routerUrl()
          }}
        >设置
        </NavBar>
        {
          <div className='am-list'>
            <List className='static-list shipper_list'>
              <Item arrow="horizontal" onClick={this.jump}>
                {clientId === 'kspt_shf'&&custTypeFlag===0 ? '企业结算帐户' : clientId === 'kspt_driver'?'个人结算账户':'个人结算账户'}
              </Item>
              <Item arrow="horizontal" onClick={this.xiu}>修改支付密码</Item>
              <Item arrow="horizontal" onClick={this.reset}>重置支付密码</Item>
              <Item arrow="horizontal" onClick={this.xinxi}>钱包账户信息</Item>
            </List>
          </div>
        }
      </div>
    );
  }
}

export default SetUpThe;
