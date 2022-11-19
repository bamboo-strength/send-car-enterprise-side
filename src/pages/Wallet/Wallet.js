import React, { PureComponent } from 'react';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import NetWorkListMeta from '@/components/NetWorks/NetWorkListMeta';
import NetWorkListItem from '@/components/NetWorks/NetWorkListItem';
import { Card, Icon, Row, Col, Button, Avatar, Popover } from 'antd';
import router from 'umi/router';
import { NavBar, Flex, Modal } from 'antd-mobile';
import Text from 'antd/es/typography/Text';
import Title from 'antd/es/typography/Title';
import { connect } from 'dva';
import { ALLTHEBILL_LIST } from '@/actions/allthebill';
import { page, walletaccount } from '@/services/allthebill';
import Func from '@/utils/Func';
import { MERDRIVER_DETAIL } from '@/actions/merDriver';
import { getCurrentUser } from '@/utils/authority';
import { getTenantId } from '@/pages/Merchants/commontable';
import { getPasswordSetstatus } from '@/services/paypassword';
import { getWalletStatus } from '@/services/wallet';

const { Meta } = Card;
const { alert } = Modal;

@connect(({ allthebill, loading }) => ({
  allthebill,
  loading: loading.models.allthebill,
}))
@connect(({ merDriver }) => ({
  merDriver,
}))
class Wallet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showEye: true,
      nowYear: '',
      nowMonth: '',
      detail: {},
      Balance: '0',
      withdrawable: '0',
      unwithdrawable: '0',
      data: {},
      income: '',
      spending: '',
      merDriverdetail: {},
      passwordsetstate: '',
      walletstate: '',
      walletstateName: '',
    };
  }
  componentWillMount() {
    const {
      dispatch,
      location,
      merDriver: {
        detail,
      },
    } = this.props;
    dispatch(MERDRIVER_DETAIL(getCurrentUser().userId));
    this.setState({
      merDriverdetail: detail,
    });
    getPasswordSetstatus().then((res) => {
      if (res.success) {
        this.setState({
          passwordsetstate: res.data,
        });
      }
    });
    const Year = new Date().getFullYear();
    const Month = new Date().getMonth() + 1;
    let income = 0;
    let spending = 0;
    const params = {
      current: 1,
      size: 15,
      querytime: `${Year}-${Month}`,
      // jszh:detail.jszh,
    };
    page(params).then((res) => {
      if (res.success) {
        for (let i = 0; i < res.data.records.length; i += 1) {
          if (res.data.records[i].bussType === 2) {
            spending += (+res.data.records[i].outAmount);
          } else if (res.data.records[i].bussType === 4) {
            income += (+res.data.records[i].outAmount);
          }
        }
        this.setState({
          spending,
          income: income.toFixed(2),
          data: res.data,
          nowYears: Year,
          nowMonth: Month,
        });
      }
    });
    let walletstate = '';
    let walletstateName = '';
    getWalletStatus().then((resp) => {
      if (resp.data !== '') {
        switch (resp.data) {
          case 'REVIEWING':
            walletstate = 1;
            walletstateName = '申请审核中';
            break;   // 申请审核中
          case 'BUSINESS_OPENING':
            walletstate = 1;
            walletstateName = '业务开通中';
            break;// 业务开通中
          case 'AGREEMENT_SIGNING':
            walletstate = 1;
            walletstateName = '协议待签署';
            break;// 协议待签署
          case 'REVIEW_BACK':
            walletstate = 2;
            walletstateName = `申请已驳回:${  resp.msg}`;
            break;// 已驳回
          case 'COMPLETED':
            walletstate = 3;
            walletaccount().then((res) => {
              this.setState({
                Balance: res.data.zong,
                withdrawable: res.data.fund,
                unwithdrawable: res.data.settle,
              });
            });
            ;
            break;// 申请已完成
        }
        ;
        this.setState({
          walletstate,
          walletstateName,
        });
      } else {
        this.setState({
          walletstate: 0,
          walletstateName: '钱包未开通',
        });
      }
    });
  }

  showMoney = () => {
    const { showEye } = this.state;
    this.setState({
      showEye: !showEye,
    });
  };

  render() {
    const { form, location } = this.props;
    const { showEye, Balance, withdrawable, unwithdrawable, nowMonth, nowYear, data, spending, income, merDriverdetail, passwordsetstate, walletstate, walletstateName } = this.state;
    const tenantId = getTenantId();
    return (
      <div id={NetWorkLess.netWork}>
        {walletstate === 3 ?
          <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
            >我的钱包
            </NavBar>
            <div className='am-list networkDetail'>
              <div className='networkDetailDiv'>
                <Card
                  className='walletCard'
                  actions={[
                    <Flex justify="space-between" className='walletCardActions'>
                      <Col xs={{ span: 8, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Icon type="credit-card" theme="twoTone" />
                        <Text
                          onClick={() => {
                            if (passwordsetstate) {
                              router.push({ pathname: `/wallet/wallet/authentication`, state: { path: '/driverSide/personal/myBankcard', },},);
                            } else {
                              alert('', '为了您的账户安全,请先设置支付密码',
                                [
                                  { text: '暂不设置', },
                                  { text: '去设置', onPress: () => router.push({ pathname: `/wallet/wallet/paypassword`, state: { passwordstate: 0 }, }), },]);
                            }
                          }
                          }
                        >
                          银行卡
                        </Text>
                      </Col>
                      <Col xs={{ span: 7, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Icon type="credit-card" theme="twoTone" />
                        <Text
                          style={{ color: '#1890ff' }}
                          onClick={() => {
                            if (passwordsetstate) {
                              router.push({ pathname: `/wallet/wallet/authentication`, state: { path: '/wallet/wallet/withdrawal' }, });
                            } else {
                              alert('', '为了您的账户安全,请先设置支付密码',
                                [
                                  { text: '暂不设置', },
                                  { text: '去设置', onPress: () => router.push({ pathname: `/wallet/wallet/paypassword`, state: { passwordstate: 0 }, }), },
                                ]);
                            }
                          }
                          }
                        >提现
                        </Text>
                      </Col>
                      <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Icon type="credit-card" theme="twoTone" />
                        <Text
                          style={{ color: '#1890ff' }}
                          onClick={() => {
                            if (passwordsetstate) {router.push({ pathname: `/wallet/wallet/paypassword`, state: { passwordstate: 1 }, });
                            } else {router.push({ pathname: `/wallet/wallet/paypassword`, state: { passwordstate: 0 }, });}}
                          }
                        >支付密码
                        </Text>
                      </Col>
                    </Flex>,
                  ]}
                >
                  <Flex justify="space-between" direction='column' className='walletCardFLex'>
                    <div>
                      <Text>账户余额(元)</Text>
                      <Icon type={showEye ? 'eye' : 'eye-invisible'} onClick={this.showMoney} />
                    </div>
                    <Title>
                      {showEye ? Balance : '*********'}
                    </Title>
                  </Flex>
                  <div>
                    <Col xs={{ span: 12, offset: 1 }}>
                      <Text>可提现金额(元)</Text>
                      <h4>
                        {withdrawable}
                      </h4>
                    </Col>
                    <Col xs={{ span: 8, offset: 1 }}>

                      <Popover placement="top" content="收款之后次日可提现">
                        <Text>不可提现金额(元)</Text>
                      </Popover>
                      <h4>
                        {unwithdrawable}
                      </h4>
                    </Col>
                  </div>
                </Card>
                <Flex justify='between' className='detailTitle'>
                  <Text strong>账单明细</Text>
                  <Text type="secondary" onClick={() => router.push('/wallet/wallet/allthebills')}>查看全部账单<Icon
                    type="right"
                  />
                  </Text>
                </Flex>
                <NetWorkListItem
                  // years={nowYear}
                  month={nowMonth}
                  spending={spending}
                  income={income}
                />
                <NetWorkListMeta data={data.records} />
              </div>
            </div>
          </div>
          : walletstate === 0 || walletstate === 1 || walletstate === 2 ?
            <div>
              <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
              >我的钱包
              </NavBar>
              <div className='am-list networkDetail'>
                <div className='networkDetailDiv'>
                  <Card
                    className='walletCard'
                    actions={[
                      <Flex justify='center' className='walletCardActions'>
                        {/* <Col> */}
                        {/* <Icon type="credit-card" theme="twoTone"/> */}
                        {/* { */}
                        {/*  walletstate===0?<div align='center' style={{ color: '#1890ff' }} */}
                        {/*                onClick={() => router.push({ pathname:'/wallet/wallet/openwallet', state:{ type:0 } })}>申请开通</div> */}
                        {/*    :walletstate===1?<div align='center' style={{ color: '#1890ff' }} */}
                        {/*                   onClick={() => router.push({ pathname:'/wallet/wallet/openwallet', state:{ type:1 } })}>查看申请</div> */}
                        {/*    :walletstate===2?<div align='center' style={{ color: '#1890ff' }} */}
                        {/*                   onClick={() => router.push({ pathname:'/wallet/wallet/openwallet', state:{ type:2 } })}>修改申请</div> */}
                        {/*      :'' */}
                        {/* } */}

                        {/* <Text */}
                        {/*  onClick={() => */}
                        {/*  { */}
                        {/*    if(passwordsetstate){ */}
                        {/*      router.push( */}
                        {/*        { */}
                        {/*          pathname: `/wallet/wallet/authentication`, */}
                        {/*          state: { */}
                        {/*            path: '/driverSide/personal/myBankcard', */}
                        {/*          }, */}
                        {/*        }, */}
                        {/*      ) */}
                        {/*    }else */}
                        {/*    { */}
                        {/*      alert('', '为了您的账户安全,请先设置支付密码', */}
                        {/*        [ */}
                        {/*          { text: '暂不设置', */}
                        {/*            onPress: () =>{ */}
                        {/*              router.push( */}
                        {/*                '/driverSide/personal/myBankcard' */}
                        {/*                // '/wallet/wallet/authentication' */}
                        {/*              ) */}
                        {/*            } */}
                        {/*          }, */}
                        {/*          { text: '去设置', onPress: () => */}
                        {/*              router.push( */}
                        {/*                {pathname:`/wallet/wallet/paypassword`, */}
                        {/*                  state:{passwordstate:0}}) */}
                        {/*          }, */}
                        {/*        ]) */}
                        {/*    } */}
                        {/*  } */}
                        {/*  } */}
                        {/* > */}
                        {/*  银行卡 */}
                        {/* </Text> */}
                        {/* </Col> */}
                        {
                          walletstate === 0 ?
                            <Col>
                              <Text
                                style={{ color: '#1890ff' }}
                                onClick={() => router.push({
                                pathname: '/wallet/wallet/openwallet',
                                state: { type: 0 },
                              })}
                              >
                                申请开通
                              </Text>
                            </Col>
                            : walletstate === 1 ?
                              <Col>
                                <Text
                                  style={{ color: '#1890ff' }}
                                  onClick={() => router.push({
                                pathname: '/wallet/wallet/openwallet',
                                state: { type: 1 },
                              })}
                                >
                                查看申请
                                </Text>
                              </Col>
                            : walletstate === 2 ?
                              <Col>
                                <Text
                                  style={{ color: '#1890ff' }}
                                  onClick={() => router.push({
                                  pathname: '/wallet/wallet/openwallet',
                                  state: { type: 2 },
                                })}
                                >
                                  修改申请
                                </Text>
                              </Col>
                              : ''
                        }
                        {/* <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 2 }}> */}
                        {/*  <Text style={{ color: '#1890ff' }} */}
                        {/*        onClick={() => */}
                        {/*        { */}
                        {/*          if(passwordsetstate){ */}
                        {/*            router.push( */}
                        {/*              {pathname:`/wallet/wallet/paypassword`, */}
                        {/*                state:{passwordstate:1}}) */}
                        {/*          }else */}
                        {/*          { */}
                        {/*            router.push( */}
                        {/*              {pathname:`/wallet/wallet/paypassword`, */}
                        {/*                state:{passwordstate:0}}) */}
                        {/*          } */}
                        {/*        } */}
                        {/*        }>支付密码</Text> */}

                        {/*  /!*<div align='center' style={{ color: '#1890ff' }}*!/ */}
                        {/*  /!*     onClick={() => router.push('/wallet/wallet/openwallet')}>申请开通</div>*!/ */}
                        {/* </Col> */}
                      </Flex>,

                    ]}
                  >
                    {/* <Card.Header title='11' thumb={require(`../DriverSide/Personal/personalImg/${tenantId}.jpg`)} thumbStyle={{ width: '20%' }} /> */}
                    {/* <Card.Header  thumb={require(`./personalImg/${tenantId}.jpg`)} thumbStyle={{ width: '20%' }} /> */}
                    {/* <Flex justify='between' className='detailTitle'> */}
                    <Flex justify="between" className='walletCardFLex'>
                      <Meta
                        avatar={<Avatar
                          size={64}
                          src={require(`../DriverSide/Personal/personalImg/wlhy.jpg`)}
                          thumbStyle={{ width: '50%' }}
                        />}
                        title={merDriverdetail.name}
                        description={walletstateName}
                      />
                    </Flex>
                    {/* <Flex justify="space-between" direction='column' className='walletCardFLex'> */}
                    {/*  <div> */}
                    {/*    <Text>账户余额(元)</Text> */}
                    {/*  </div> */}
                    {/* </Flex> */}
                  </Card>
                  <Card size="small" title="开通钱包拥有以下权限" style={{ margin:'0 11px',width: 350 }}>
                    {/* <div> */}
                    {/*  <Avatar size={50} icon="user" /> */}
                    {/* </div> */}
                    <Flex justify="space-between" className='walletCardFLex'>
                      {/* <Avatar size={50} icon="user" /> */}
                      <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Avatar size={45} style={{ backgroundColor: '#1890ff' }} src="/image/yue.png" />
                      </Col>
                      <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Avatar size={45} style={{ backgroundColor: '#90ff18' }} src="/image/zhangdan.png" />
                      </Col>
                      <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Avatar size={45} style={{ backgroundColor: '#ff8718' }} src="/image/tixian.png" />
                      </Col>
                    </Flex>
                    <Flex justify="space-between" className='walletCardFLex'>
                      <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <h5>查询余额</h5>
                      </Col>
                      <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <h5>查询账单</h5>
                      </Col>
                      <Col xs={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <h5>在线提现</h5>
                      </Col>
                    </Flex>
                  </Card>
                </div>
              </div>
            </div> : ''

        }
      </div>
    );
  }
}

export default Wallet;
