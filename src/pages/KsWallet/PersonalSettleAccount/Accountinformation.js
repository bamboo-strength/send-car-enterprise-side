import React, { PureComponent } from 'react';
import { CardInformation, ModifyPhone } from '@/services/KsWallet/AccountSerivce';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';
import { Avatar, Button, Card, Divider, Icon, List, Tag, Typography } from 'antd';
import { NavBar } from 'antd-mobile';
import Text from 'antd/lib/typography/Text';
import { IconAuthentication, IconCertification, IconFailure, IconIlala } from '@/components/Matrix/image';
import { router } from 'umi';
import { clientId } from '@/defaultSettings';
import { InTheLoad } from '@/components/Stateless/Stateless';
import { getCurrentUser, getUserType } from '@/utils/authority';

const {Paragraph} = Typography
class Accountinformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detail1: {},
      loading:true
    };
  }

  componentDidMount() {
    // 钱包信息账户
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    CardInformation({cpdId:clientId==='kspt_shf'&&custTypeFlag===1?userId:''}).then(resp => {
      this.setState({
        loading:false
      })
      if (resp.success) {
        this.setState({
          detail1: resp.data,
        });
      }
    });
  }

  modify = () => {
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    ModifyPhone({ chanCode: 16, rebackUrl: '/kswallet/wallhomepage',userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:undefined }).then(resp => {
      if (resp.success) {
        window.open(resp.data, '_self');
      }
    });
  };

  render() {
    const { detail1,loading } = this.state;
    const list = clientId === 'kspt_shf' ? [
      { label: '资金账号', text: <Paragraph copyable style={{marginBottom:0}}>{detail1.subAcctNo}</Paragraph>,},
      { label: '资金户名', text: detail1.subAcctName },
      { label: '账户类型', text: detail1.acctTypeName },
      { label: '账户状态', text: detail1.subAcctStatusName },
      { label: '绑定状态', text: detail1.bindStatusName },
      { label: '开户行号', text: detail1.bankNo },
      { label: '开户行名', text: detail1.bankName },
      { label: '开户日期', text: detail1.openDate },
      { label: '信用代码', text: detail1.certNo },
      { label: '法定代表', text: detail1.legalRealName },
      { label: '身份证号', text: detail1.legalCertNo },
    ] : clientId === 'kspt_driver' ? [{ label: '资金账号', text: detail1.subAcctNo },
      { label: '资金户名', text: detail1.subAcctName },
      { label: '账户类型', text: detail1.acctTypeName },
      { label: '账户状态', text: detail1.subAcctStatusName },
      { label: '绑定状态', text: detail1.bindStatusName },
      { label: '开户行号', text: detail1.bankNo },
      { label: '开户行名', text: detail1.bankName },
      { label: '开户日期', text: detail1.openDate },
      { label: '身份证号', text: detail1.certNo },
      { label: '手机号码', text: detail1.mobileNo },
    ] : '';
    let img = ''
    let bg = ''
    switch (detail1.applicationStatus) {
      case 0:
        img = IconAuthentication
        bg = 'orange'
        break
      case 1:
        img = IconCertification
        bg = 'green'
        break;
      case 2:
        img = IconFailure
        bg = 'red'
        break;
      default:
    }
    const title = (
      <List.Item.Meta
        avatar={<Avatar
          style={{ background: '#f3f5ff', color: '#4988fd' }}
          src={IconIlala}
          size={52}
        />}
        title={<Text strong>{detail1.custName}</Text>}
        description={
          <Tag
            color={bg}
            style={{ display: 'inline-flex', alignItems: 'center', border: 'none', }}
          >
            <img src={img} alt='' height={12} style={{ marginRight: 5 }} />
            {detail1.applicationStatusName}
          </Tag>
        }
      >
      </List.Item.Meta>
    );
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push('/kswallet/setupthe');
          }}
        > {
          clientId === 'kspt_shf' ? '钱包账户信息' : clientId === 'kspt_driver' ? '钱包账户管理' : ''
        }
        </NavBar>
        {
          loading ? <InTheLoad /> :(
            <div className='am-list'>
              <div className='cer-div' style={{marginBottom:70}}>
                <Card title={title} bordered={false}>
                  {

                    list.map(item => <MatrixListItem label={item.label} title={item.text} />)
                  }
                  {/* <CopyToClipboard text={detail1.subAcctNo}> */}
                  {/*  <Button icon="copy" style={{marginTop:10}}>复制资金账号</Button> */}
                  {/* </CopyToClipboard> */}
                  {clientId === 'kspt_shf' && <Divider style={{marginTop:12,marginBottom:14}} />}
                  {clientId === 'kspt_shf' && <div style={{borderLeft: '5px solid #1890FF',paddingLeft: 10,fontWeight: 'bold'}}>经办人信息</div>}
                  {clientId === 'kspt_shf' && <MatrixListItem label='经办人员' title={detail1.agentName} />}
                  {clientId === 'kspt_shf' && <MatrixListItem label='身份证号' title={detail1.agentCertNo} />}
                  {clientId === 'kspt_shf' && <MatrixListItem label='手机号码' title={detail1.mobileNo} />}
                </Card>
              </div>
              <Button type='primary' block onClick={this.modify} style={{ height: 60, position: 'fixed', bottom: 0,borderRadius:0 }}>修改手机号</Button>
            </div>
          )
        }
      </div>
    );
  }
}

export default Accountinformation;

