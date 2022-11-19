import React, { PureComponent } from 'react';
import { Card, Col, Icon } from 'antd';
import { router } from 'umi';
import { Flex, Modal, NavBar, Toast } from 'antd-mobile';
import Text from 'antd/es/typography/Text';
import Title from 'antd/es/typography/Title';
import NetWorkListItem from '@/components/NetWorks/NetWorkListItem';
import { IconTopUpLine, IconWithdrawalLine, ImageBg } from '@/components/Matrix/image';
import {
  billincome,
  CardInformation,
  ifSettlement,
  page,
  personBillincome,
  personPage,
  queryBalance,
  recharge,
  rechargePerson,
  Unbindpage,
} from '@/services/KsWallet/AccountSerivce';
import './KsWallet.less';
import MatrixListView from '@/components/MatrixMobile/MatrixListView';
import { BilllistStyle } from '@/pages/KsWallet/GeneralStyle';
import { clientId } from '@/defaultSettings';
import { getCurrentUser, getUserType } from '@/utils/authority';

const routerUrl = () => {
  router.push( clientId !== 'kspt_driver'?'/driverSide/personal/personalShipper':'/driverSide/personal/personalCenter')

};

window.gobackurl = () =>{
  router.push( clientId !== 'kspt_driver'?'/driverSide/personal/personalShipper':'/driverSide/personal/personalCenter')
};

const { alert } = Modal;
class WalletPage extends PureComponent {

  constructor(props) {
    super(props);
    const date = new Date();
    this.state = {
      showEye: false,
      balance: {},
      editMonth: 0,
      nowMonth: date.getMonth() + 1,
      billDate: `${date.getFullYear()}-${date.getMonth() + 1 <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}`,
      income: '0',
      spending: '0',
      cardDetail: {},
      detail1:''
    };
  }

  componentDidMount() {
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    CardInformation({cpdId:clientId==='kspt_shf'&&custTypeFlag===1?userId:''}).then(resp => {
      if (resp.success) {
        this.setState({
          detail1: resp.data,
        });
      }
    });
    // 余额查询
    queryBalance({custNo:clientId==='kspt_shf'&&custTypeFlag===1?userId:''}).then(resp => {
      if (resp.success) {
        this.setState({
          balance: resp.data,
        });
      }
    });

    // 充值开行信息
    CardInformation({cpdId:clientId==='kspt_shf'&&custTypeFlag===1?userId:''}).then(resp => {
      if (resp.success) {
        this.setState({
          cardDetail: resp.data,
        });
      }
    });
    // 支出收入金额
    let income = 0;
    let spending = 0;
    const {billDate}=this.state
    if(clientId==='kspt_shf'&&custTypeFlag===1){
      personBillincome({billDate,userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:''}).then(resp => {
        if (resp.success) {
          for (let i = 0; i < resp.data.records.length; i += 1) {
            if (resp.code === 200) {
              spending += (+resp.data.records[i].expenditure);
              income += (+resp.data.records[i].income);
            }
          }
          this.setState({
            spending,
            income,
          });
        }
      });
    }else{
      billincome({billDate}).then(resp => {
        if (resp.success) {
          for (let i = 0; i < resp.data.records.length; i += 1) {
            if (resp.code === 200) {
              spending += (+resp.data.records[i].expenditure);
              income += (+resp.data.records[i].income);
            }
          }
          this.setState({
            spending,
            income,
          });
        }
      });
    }


  }

  /* 客户端点击充值 */
  showModal = () => {
    const {cardDetail:{subAcctNo,bankName}} = this.state
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    ifSettlement({"userId":clientId==='kspt_shf'&&custTypeFlag===1?userId:''}).then(resp=>{
      if (resp.success){
        if (resp.data === 0) {
          Toast.fail('正在首笔打款认证，请等待！');
        } else if (resp.data === 2 || resp.data === -1) {
          alert('提示', '请先绑定结算账户', [
            { text: '暂不绑定' },
            { text: '去绑定', onPress: () => this.handleSubmit(), },
          ]);
        } else if (resp.data === 1) {
          Modal.alert(null,
            <div>
              充值需先绑定结算账户并使用结算账户通过企业网银向如下账号充值：{<br />}开户行号：{subAcctNo}{<br />}开户银行：{bankName}
            </div>,
            [
              {text:'我知道了'}
            ])
        }
      }
    })
  };

  // 司机端充值
  handlerecharge=()=>{
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    // 判断是否绑定结算账户
    ifSettlement({"userId":clientId==='kspt_shf'&&custTypeFlag===1?userId:''}).then(resp=>{
      if (resp.success){
        if (resp.data === 0) {
          Toast.fail('正在首笔打款认证，请等待！');
        } else if (resp.data === 2 || resp.data === -1) {
          alert('提示', '请先绑定结算账户', [
            { text: '暂不绑定' },
            { text: '去绑定', onPress: () => this.handleSubmit(), },
          ]);
        } else if (resp.data === 1) {
          recharge({rebackUrl:'/kswallet/wallhomepage'}).then(resps=>{
            window.open(resps.data, '_self');
          })
        }
      }
    })
  }

  // 个人账户充值
  handlePerson=()=>{
    const {detail1} = this.state
    const params={
      "rebackUrl":'/kswallet/wallhomepage',
      "subAccNo":detail1.subAcctNo,
    }
    rechargePerson(params).then(resps=>{
      if(resps.success){
         window.open(resps.data, '_self');
      }else{
        Toast.info(resps.msg)
      }

    })
  }

  /* 绑定结算账户 */
  handleSubmit = () => {
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    Unbindpage({ chanCode: 16, rebackUrl: '/kswallet/wallhomepage/walletpage',userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:''  }).then(resp => {
      if (resp.success) {
        window.open(resp.data, '_self');
      }
    });
  };

  /* 点击提现 */
  bindCard = () => {
    // 判断是否绑定结算账户
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    ifSettlement({userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:''}).then(resp => {
      // 绑定状态-1=去绑定，0=待打款，1=绑定成功，2=绑定失败
      if (resp.success) {
        if (resp.data === 0) {
          Toast.fail('正在首笔打款认证，请等待！');
        } else if (resp.data === 2 || resp.data === -1) {
          alert('提示', '请先绑定结算账户', [
            { text: '暂不绑定' },
            { text: '去绑定', onPress: () => this.handleSubmit(), },
          ]);
        } else if (resp.data === 1) {
          router.push('/kswallet/wallhomepage/kswithdrawal');
        }
      }
    });
  };

  render() {
    const { showEye,  balance, editMonth, nowMonth, spending, income,  } = this.state;
    console.log(balance)
    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID} style={{ padding: '0 15px' }}>
          <BilllistStyle rowData={rowData} />
        </div>
      );
    };
    const {freezeBalance,useBalance,cashBalance,} = balance
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    const interfaceUrl =clientId==='kspt_shf'&&custTypeFlag===1?personPage:page
    const {userId} = getCurrentUser()
    const balancelist = [
      { text: '可用余额(元)', num: (freezeBalance === undefined ? '--' : Number(useBalance).toFixed(2)) },
      { text: '冻结余额(元)', num: (freezeBalance === undefined ? '--' : Number(freezeBalance).toFixed(2)) },
      { text: '可提现余额(元)',num: (cashBalance === undefined ? '--' : Number(cashBalance).toFixed(2)) },
    ];
    const actions = [
      clientId === 'kspt_driver'||(custTypeFlag!==undefined&&custTypeFlag=== 1)?(
          { text: '充值', img: IconTopUpLine, click:(custTypeFlag!==undefined&&custTypeFlag=== 1?this.handlePerson:this.handlerecharge)}
        ):({ text: '充值', img: IconTopUpLine, click:this.showModal }),
      { text: '提现', img: IconWithdrawalLine, click: this.bindCard },
    ];
    const month = editMonth !== 0 ? editMonth : nowMonth;
    return (
      <div>
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          style={{ background: '#089bff', color: 'white', borderBottom: 'none' }}
          onLeftClick={() => {
            routerUrl()
          }}
          rightContent={<Icon type="setting" theme="filled" onClick={() => router.push('/kswallet/setupthe')} />}
        >我的钱包
        </NavBar>
        <div className='am-list'>
          <Card
            className='walletCard'
            bordered={false}
            bodyStyle={{
              backgroundImage: `url(${ImageBg})`,
              backgroundSize: 'cover',
              padding: '40px 15px 8px',
              color: 'white',
            }}
            actions={[
              <Flex justify="space-between" className='walletCardActions'>
                {
                  actions.map(item => (
                    <Col span={12} key={item.text} className='wallet-col' onClick={item.click}>
                      <img src={item.img} alt='' style={{ height: 20, marginRight: 8,marginLeft:50 }} />
                      {item.text}
                    </Col>
                  ))
                }
              </Flex>,
            ]}
          >
            <Flex justify="space-between" direction='column' className='walletCardFLex'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text>账户余额(元)</Text> &nbsp;&nbsp;
                <Icon
                  type={showEye ? 'eye' : 'eye-invisible'}
                  style={{ fontSize: 18 }}
                  onClick={() => this.setState({ showEye: !showEye })}
                />
              </div>
              <Title style={{ marginBottom: 0 }}>
                {showEye ? (balance.balance === undefined ? '--' : Number(balance.balance).toFixed(2)) : '****'}
              </Title>
            </Flex>
            <div style={{ margin: '0 -10px' }}>
              {
                balancelist.map(item => (
                  <Col span={8} key={item.text} className='wallet-balance'>
                    <Text>{item.text}</Text>
                    <h4>
                      { showEye?(item.num):'****'}
                    </h4>
                  </Col>
                ))
              }
            </div>
          </Card>
          <div className='wallet-page-round'>
            <Flex justify='between' className='detailTitle' style={{ marginBottom: 15 }}>
              <Text strong>账单明细</Text>
              <Text type="secondary" onClick={() => router.push('/kswallet/billing/billingList')}>查看全部账单<Icon type="right" /></Text>
            </Flex>
            <NetWorkListItem month={month} spending={spending} income={income} />
            <MatrixListView interfaceUrl={interfaceUrl} param={{userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:undefined}} row={row} defaultText='账单' heights={450} />
          </div>
        </div>
      </div>
    );
  }
}

export default WalletPage;
