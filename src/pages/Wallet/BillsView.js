import React, { PureComponent } from 'react';
import { Form,  Card,  Button, Icon,Steps } from 'antd';
import { NavBar,WhiteSpace,WingBlank, } from 'antd-mobile';
import router from 'umi/router';
import { detail } from '@/services/allthebill';

const { Step } = Steps;

@Form.create()
class BillsView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data:{},
      detail:{walletbill:{},bankCard:{}}
    };
  }

  componentWillMount() {
    const{location}=this.props
    this.setState({
      data:location.state
    })
    detail({id:location.state.id}).then((res)=>{
      if(res.success) {
        this.setState({
          detail:res.data
        })
      }
    })
  }

  goReturn = ()=>{
      // router.push('/wallet/wallet/allthebills');
    router.goBack()
  }

  render() {
    const { location } = this.props;
    const{data,detail}=this.state
    const action = (
      <WingBlank>
        <Button type="primary" block style={{ marginTop: '10px' }} onClick={this.goReturn}>
          返回
        </Button>
      </WingBlank>
    );
    let accountNos = ''
    if (detail.bankCard){
      const aa = detail.bankCard.accountNo
      if (aa){
        accountNos =  aa.replace(/\s/g,'').replace(/(\d{4})\d+(\d{4})$/, "**** **** **** $2")
      }
    }

    return (
      <div>
        {
          location.state.bussType===4?
            <div>
              <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={this.goReturn}
              >账单详情
              </NavBar>
              <div className='am-list'>
                <Form style={{ marginTop: 8 }}>
                  <Card bordered={false}>
                    <WhiteSpace />
                    <h4 align="center">运费收取</h4>
                    <h1 align="center" color="green">+{data.outAmount}元</h1>
                    <h5 align="center">
                      {
                  data.transferStatus===0?<font align="center" color="#FF8000">进行中</font>:
                    data.transferStatus===1?<font align="center" color="#00BB00">交易成功</font>:
                      data.transferStatus===2?<font align="center" color="#FF0000">交易失败</font>:''
                }
                    </h5>
                    <WhiteSpace />
                    <h4 align="center">对方账户：{data.outMerchantName}</h4>
                    <h4 align="center">创建时间：{data.createTime}</h4>
                    <h4 align="center">交易编号：{data.id}</h4>

                    <WhiteSpace size="xl" />
                    {/* eslint-disable-next-line react/jsx-no-undef */}
                  </Card>
                </Form>
                {action}
              </div>
            </div>
            :
            location.state.bussType===2?
              <div>
                <NavBar
                  mode="light"
                  icon={<Icon type="left" />}
                  onLeftClick={this.goReturn}
                >账单详情
                </NavBar>
                <div className='am-list'>
                  <Form style={{ marginTop: 8 }}>
                    <Card bordered={false}>
                      <WhiteSpace />
                      <h4 align="center">提现</h4>
                      <h1 align="center" color="green">-{data.outAmount}元</h1>

                      <h5 align="center">
                        {
                        data.transferStatus===0?<font align="center" color="#FF8000">进行中</font>:
                          data.transferStatus===1?<font align="center" color="#00BB00">交易成功</font>:
                            data.transferStatus===2?<font align="center" color="#FF0000">交易失败</font>:''
                      }
                      </h5>
                      <WhiteSpace />
                      {/* <h4 align="left" /> */}
                      <h4 align="left">提现到：{detail.bankCard.bankName}</h4>
                      <h4 align="left">提现账户：{accountNos}</h4>
                      <span>处理进度:
                        <Steps direction="vertical" size="small" current={3}>
                          <Step title="提现申请成功" description={detail.walletbill.createTime} />
                          <Step title="银行处理中" description={detail.walletbill.createTime} />
                          <Step title="到账成功" description={detail.walletbill.arrivalTime} />
                        </Steps>
                      </span>
                      <h4 align="left">创建时间：{data.createTime}</h4>
                      <h4 align="left">交易订单号：{data.id}</h4>

                      <WhiteSpace size="xl" />
                      {/* eslint-disable-next-line react/jsx-no-undef */}
                    </Card>
                  </Form>
                  {action}
                </div>
              </div>
            :''
        }
        {/* <NavBar */}
        {/*  mode="light" */}
        {/*  icon={<Icon type="left" />} */}
        {/*  onLeftClick={this.goReturn} */}
        {/* >账单详情 */}
        {/* </NavBar> */}
        {/* <div className='am-list'> */}
        {/*  <Form style={{ marginTop: 8 }}> */}
        {/*    <Card bordered={false}> */}
        {/*      <WhiteSpace /> */}
        {/*      <h4 align="center">运费收取</h4> */}
        {/*      <h1 align="center" color={"green"}>+{location.query.receiveAmount}</h1> */}
        {/*      <h5 align="center"><font align="center" color="#32CD32">交易成功</font></h5> */}
        {/*      <WhiteSpace /> */}
        {/*      <h4 align="center">对方账户：{location.query.payeeAccountName}</h4> */}
        {/*      <h4 align="center">创建时间：{location.query.createTime}</h4> */}
        {/*      <h4 align="center">交易编号：{location.query.id}</h4> */}
        {/*      <WhiteSpace size="xl" /> */}
        {/*      /!* eslint-disable-next-line react/jsx-no-undef *!/ */}
        {/*    </Card> */}
        {/*  </Form> */}
        {/*  {action} */}
        {/* </div> */}
      </div>
    );
  }
}

export default BillsView;
