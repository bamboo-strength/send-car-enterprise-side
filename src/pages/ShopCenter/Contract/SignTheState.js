import React, { PureComponent } from 'react';
import { Button, Icon, Tag } from 'antd';
import { router } from 'umi';
import { NavBar, Toast } from 'antd-mobile';
import {
  contractManageDetail,
  contractManageForceend,
  contractManageInvalid,
  documentAddByFile,
  pageurl,
} from '@/services/contract';
import '../ShopCenter.less';
import { InTheLoad, PageFault } from '@/components/Stateless/Stateless';
import Text from 'antd/lib/typography/Text';

// import PageFault from '@/pages/ShopCenter/component/PageFault';

class SignTheState extends PureComponent {

  state = {
    data: [],
    detail: {},
    loading:false,
    isloading:false,
  };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    contractManageDetail({ contractId: id }).then(item => {
      this.setState({
        data: item.data.signatories,
        detail:item.data
      });
    });
  }

  /* 撤销|删除 */
  delete = (type) =>{
    const { match: { params: { id } } } = this.props;
    const {detail} = this.state
    this.setState({
      isloading: true,
    })
    if (type === 'delete'){
      contractManageInvalid({contractId: detail.bizId}).then((item)=>{
        if (item.success){
          Toast.success(item.msg)
          router.push('/shopcenter/contract')
        }else {
          Toast.fail(item.msg)
        }
        this.setState({
          isloading:false
        })
      })
    }else {
      contractManageForceend({contractId: id}).then((item)=>{
        if (item.success){
          Toast.success(item.data)
          router.push('/shopcenter/contract')
        }else {
          Toast.success(item.msg)
        }
        this.setState({
          isloading:false
        })
      })
    }
  }

  /* 去签署 */
  signed = ()=>{
    const { match: { params: { id } } } = this.props;
    this.setState({
      loading: true,
    })
    /* 签署页面 */
    pageurl({ contractId: id, pageType: 'DIRECT_SIGN' }).then(d => {
      if (d.success) {
        router.push({
          pathname: '/shopcenter/contract/signing',
          state: {
            contractUrl: d.data.pageUrl, contractId: id,
          },
        });
      } else {
        Toast.fail(d.msg)
      }
      this.setState({
        loading: false,
      });
    });
  }

  /* 发起合同 */
  contract = ()=>{
    const { match: { params: { id } } } = this.props;
    const {detail} = this.state
    documentAddByFile({ bizId: detail.bizId }).then(i => {
      if (i.success) {
        /* 签署页面 */
        pageurl({ contractId: i.data.contractId, pageType: 'DIRECT_SIGN' }).then(d => {
          if (d.success) {
            router.push({
              pathname: '/shopcenter/contract/signing',
              state: {
                contractUrl: d.data.pageUrl, contractId: i.data.contractId,
              },
            });
            this.setState({
              loading: false,
            });
          }
        });
      }else {
        Toast.fail(i.msg)
        this.setState({
          loading: false,
        });
      }
    });
  }

  render() {
    const { data,detail,loading,isloading } = this.state;
    const lineHeight = {lineHeight: 2}
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push(`/shopcenter/contract`);
          }}
        >签署状态
        </NavBar>
        {
          data? data.length !== 0 ? (
            <div className="am-list sign-the-stete">
              <Text strong style={{fontSize: '16px',...lineHeight}}>签署方</Text><br />
              <Text>本文件<Text underline strong>{detail.tenantName}</Text>于<Text underline strong>{detail.publishTime}</Text>发起</Text>
              {
                data.map((item, index) => {
                  let status;
                  let color = '#2db7f5';
                  switch (item.status) {
                    case 'DRAFT':
                      status = '草稿';
                      break;
                    case 'RECALLED':
                      status = '已撤回';
                      color = '#87d068'
                      break;
                    case 'SIGNING':
                      status = '签署中';
                      break;
                    case 'REJECTED':
                      status = '已退回';
                      color = '#87d068'
                      break;
                    case 'SIGNED':
                      status = '已完成';
                      color = '#87d068'
                      break;
                    case 'EXPIRED':
                      status = '已过期';
                      color = '#87d068'
                      break;
                    case 'FILLING':
                      status = '拟定中';
                      break;
                    case 'WAITING':
                      status = '待签署';
                      break;
                    case 'INVALIDING':
                      status = '作废中';
                      break;
                    case 'INVALIDED':
                      status = '已作废';
                      color = '#87d068'
                      break;
                    default:
                      status = '强制结束';
                      color = '#87d068'
                  }
                  return (
                    <div className='state-round' style={{paddingBottom:'38px'}}>
                      <Tag style={{marginLeft:'8px'}} color={index === 0?(detail.status === 'RECALLED'?'':color): color}>{index === 0?(detail.status === 'RECALLED'?'已失效':status): status}</Tag>
                      <Tag>{item.serialNo === 0 ? '接收方' :item.serialNo === 1 ? '执行人' : '发起方'}</Tag>
                      <div className='mess-round'>
                        <Text strong className='mess-title'>{item.tenantName}</Text><br />
                        <Text style={lineHeight}>{item.complateTime?`于 ${item.complateTime}`:`等待${JSON.stringify(item.receiver) === '{}'?'执行人':item.receiver.name}`} 签署</Text><br />
                        <Text strong style={lineHeight}>经办人：{item.serialNo === 1?item.tenantName:item.receiver.name}（{item.receiver.contact}）</Text><br />
                        {
                          item.actions.map(i=>{
                            return <Text>签署要求：{i.name}</Text>
                          })
                        }
                      </div>
                    </div>
                  );
                })
              }
              {data.length !== 0 ?data[0].status === 'SIGNING' || data[0].status === 'DRAFT'?(
                <div style={{ marginTop: '15px',display:'flex'}}>
                  {
                    detail.status !== 'RECALLED'?(
                      data[0].status === 'SIGNING'?(
                        <Button onClick={this.signed} block loading={loading} size="large" type="primary" style={{marginRight: 15}}>去签署</Button>
                      ):(
                        <Button onClick={this.contract} block loading={loading} size="large" type="primary" style={{marginRight: 15}}>发起合同</Button>
                      )
                    ):''
                  }
                  <Button onClick={()=>this.delete(detail.status !== 'RECALLED'?(data[0].status === 'SIGNING'?'end':'delete'):"delete")} block loading={isloading} size="large">
                    {/* {data[0].status === 'SIGNING'?'结束合同':'删除'} */}
                    {
                      detail.status !== 'RECALLED'?data[0].status === 'SIGNING'?'结束合同':'删除':'删除'
                    }
                  </Button>
                </div>
              ):'':''}
            </div>
          ) : <InTheLoad />:<PageFault title='暂无数据' />
        }
      </div>
    );
  }
}

export default SignTheState;
