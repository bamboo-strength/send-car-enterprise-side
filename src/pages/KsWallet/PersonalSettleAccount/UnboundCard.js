import React, { PureComponent } from 'react';
import { router } from 'umi';
import { Button, Modal, NavBar } from 'antd-mobile';
import { Avatar, Icon } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { cardList, Unbindcard, Unbindpage } from '@/services/KsWallet/AccountSerivce';
import { clientId } from '@/defaultSettings';
import func from '@/utils/Func';
import { IconCertification, IconFailure, IconIanan } from '@/components/Matrix/image';
import { InTheLoad } from '@/components/Stateless/Stateless';
import { getCurrentUser, getUserType } from '@/utils/authority';

const { alert } = Modal;

class UnboundCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showEye: false,
      detail: [],
      iconLoading: false,
      loading: false,
    };
  }


  componentDidMount() {
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    const { match: { params: { type } } } = this.props;
    if (Number(type) !== 1) {
      this.setState({ loading: true });
      // 银行卡列表
      cardList({userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:''}).then(resp => {
        if (resp.success) {
          this.setState({
            detail: resp.data,
            loading: false,
          });
        }
      });
    }
  }

  // 跳转绑定结算账户页面
  onClick = () => {
    this.setState({
      iconLoading: true,
    });
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    Unbindpage({ chanCode: 16, rebackUrl: '/kswallet/wallhomepage',userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:'' }).then(resp => {
      this.setState({
        iconLoading: false,
      });
      if (resp.success) {
        window.open(resp.data, '_self');
      }
    });
  };

  // 点击解绑的页面
  jie = () => {
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    Unbindcard({ chanCode: 16, rebackUrl: '/kswallet/wallhomepage',userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:'' }).then(resp => {
      if (resp.success) {
        window.open(resp.data, '_self');
      }
    });
  };

  render() {
    const { detail, iconLoading, loading,showEye } = this.state;
    const {custTypeFlag} = getUserType()!==null&&getUserType()

    // const { match: { params: { type } } } = this.props;
    const title = `绑定${clientId === 'kspt_driver' ||(clientId==='kspt_shf'&&custTypeFlag === 1)? '个人结算账户' : '企业结算账户'}`;
    const title1 = `重新绑定${clientId === 'kspt_driver' ||(clientId==='kspt_shf'&&custTypeFlag === 1) ? '个人结算账户' : '企业结算账户'}`;
    const textSty = {
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      paddingRight: 15,
      alignItems: 'center',
      margin: '0 0 10px 83px',
      width: 'calc( 100% - 83px)',
    };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push('/kswallet/setupthe');
          }}
        >
          {title}
        </NavBar>
        <div className='am-list'>
          {
            loading ? <InTheLoad /> : (
              <>
                {
                  detail.map(item => {
                    return (
                      <div className="home-page-div1">
                        <Meta
                          avatar={<Avatar style={{ padding: 10 }} src={IconIanan} />}
                          title={item.BindBankName}
                          description={item.BindBankNo}
                          className="home-page-meta1"
                          style={{ margin: 15 }}
                        />
                        <div style={{display: 'flex',}}>
                          {
                            showEye?<p style={{ marginLeft: 25, marginBottom:'0.5rem' }} className='home-page-p'>{item.BindAcctNo}</p>:
                            <p style={{textAlign:'center',marginBottom:'0.5rem' }} className='home-page-p'>{func.bankNo(item.BindAcctNo)}</p>
                          }
                          {
                            item.Stat !==1?'':
                            <Icon
                              type={showEye ? 'eye' : 'eye-invisible'}
                              style={{ fontSize: 18,marginTop:8,marginLeft:10 ,color:'white'}}
                              onClick={() => this.setState({ showEye: !showEye })}
                            />
                        }

                        </div>
                        <div style={textSty}>
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src={item.Stat !== 1 ? IconFailure : IconCertification}
                              alt=''
                              style={{ height: 20, marginRight: 5 }}
                            />
                            {
                              item.Stat !== 1 ? '未绑定' : '已绑定'
                            }
                          </span>
                          {/* 绑定状态 0=待打款，1=绑定成功，2=绑定失败 */}
                          {
                            item.Stat === 1 ? (
                              <span onClick={() =>
                                alert('解绑', '是否解绑?', [
                                  { text: '取消', onPress: () => console.log('cancel') },
                                  { text: '确认', onPress: () => this.jie() },
                                ])
                              }
                              >解绑
                              </span>
                            ) : (
                              <span onClick={this.onClick}>{title1}</span>
                            )
                          }
                        </div>
                      </div>
                    );
                  })
                }
                {
                  detail.length === 0 && <Button icon={<Icon type="plus" style={{ width: 16, height: 16, fontSize: 16 }} />} loading={iconLoading} style={{ fontSize: 14, marginTop: 10 }} onClick={this.onClick}>{title}</Button>
                }
              </>
            )
          }
        </div>
      </div>
    );
  }
}


export default UnboundCard;
