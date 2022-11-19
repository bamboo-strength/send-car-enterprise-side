import React, { PureComponent } from 'react';
import { Button, Card, Form, Icon, Row } from 'antd';
import { InputItem, NavBar, Toast, WhiteSpace } from 'antd-mobile';
import Text from 'antd/es/typography/Text';
import {
  kswithdrawal,
  queryApplicationWithdrawal,
  queryBalance,
  revokeApplication,
  submitApplicationWithdrawal,
} from '@/services/KsWallet/AccountSerivce';
import router from 'umi/router';
import styles from '../../layouts/Sword.less';
import { InTheLoad } from '@/components/Stateless/Stateless';
import { getCurrentUser, getUserType } from '@/utils/authority';
import { clientId } from '@/defaultSettings';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

@Form.create()
class ksWithDrawal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      balance: {},
      // price: '',
      loading: false,
      sloading:false,
      rloading:false,
      subAcctNo: {},
      type: 'money',
      auditStatus:'',
      detail:{},
      auditOpinion:'',
      pageloading:true,
      realAmt:''
    };
  }

  componentDidMount() {
    // 可提现余额
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    queryBalance({custNo:clientId==='kspt_shf'&&custTypeFlag===1?userId:''}).then(resp => {
      if (resp.success) {
        this.setState({
          balance: resp.data,
          subAcctNo: resp.data.subAcctNo,
        });
        // 判断审核状态
        queryApplicationWithdrawal({subAcctNo:resp.data.subAcctNo}).then(item=>{
          this.setState({
            auditStatus:item.data.auditStatus,
            detail:item.data,
            auditOpinion:item.data.auditOpinion,
            pageloading:false,
            realAmt:item.data.realAmt
          })
        })
      }
    });

  }

  goReturn = () => {
    router.push('/kswallet/wallhomepage/walletpage');
  };

  onChangePrice = (price) => {
    this.setState({
      // price,
    });
    document.getElementById('amount').value = price;
  };


  // 提现
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        const {userId} = getCurrentUser()
        const {custTypeFlag} = getUserType()!==null&&getUserType()
        const { subAcctNo, realAmt } = this.state;
        const params = {
          userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:'',
          amount: realAmt,
          chanCode: '16',
          rebackUrl: '/kswallet/wallhomepage',
          operFlag: '0',
          subAcctNo,
        };
        const { balance:{cashBalance} } = this.state;
        if (params.amount > cashBalance) {
          Toast.fail('可提现余额不足！');
          this.setState({
            loading: false,
          });
          return;
        }
        kswithdrawal(params).then(item => {
          if (item.success) {
            window.open(item.data, '_self');
            // console.log(item.data)
          }
          this.setState({
            loading: false,
          });
        });
      }
    });
  };


  // 提交申请
  toSubmit=e=>{
    e.preventDefault();
    const { form } = this.props;
    const { balance,detail} = this.state
    form.validateFieldsAndScroll((err, values) => {
      if (!err){
        this.setState({
          sloading: true,
        });
        // let id = ''
        // if (detail.auditStatus === '2' ){
        //    id = detail.id
        // }else {
        //   id=''
        // }
        const param={
          id:detail.auditStatus === '5'?'':detail.id,
          subAcctName:balance.subAcctName,
          subAcctNo:balance.subAcctNo,
          amount: values.amount,
        }
        const { balance:{cashBalance} } = this.state;
        if (param.amount > cashBalance) {
          Toast.fail('申请提现金额不可大于可提现金额！');
          this.setState({
            sloading: false,
          });
          return;
        }
        submitApplicationWithdrawal(param).then(resp=>{
          if (resp.success){
            this.setState({
              sloading: false,
            });
            Toast.success(resp.msg)
            router.push('/kswallet/wallhomepage/walletpage')
          }
        })
      }
    })
  }

  // 撤销申请
  toRevoke=(e)=>{
    e.preventDefault();
    const {detail} = this.state
    this.setState({
      rloading: true,
    });
    revokeApplication({id:detail.id}).then(resp=>{
      if (resp.success){
        this.setState({
          rloading: false,
        });
        Toast.success(resp.msg)
        router.push('/kswallet/wallhomepage/walletpage')
      }
    })
  }

  render() {
    const { form } = this.props;
    const { getFieldProps } = form;
    const { balance:{cashBalance}, loading,auditStatus, detail,auditOpinion,pageloading,type,realAmt,sloading,rloading} = this.state;
    let isEditable = true
    // const auditStatus = '3'
    if (JSON.stringify(detail) !== '{}'){
      // auditStatus === 2 或者 === 3 可以编辑 === 0 或者 === 1 不可编辑
      if (auditStatus === '0' || auditStatus === '1'){
        isEditable = false
      }
    }
    let btn = ''
    if (auditStatus === '' || auditStatus === '2' || auditStatus === '3' || auditStatus === '5'){
      btn = (
        <Button type="primary" block style={{ marginTop: '10px',height:'40px' }} onClick={this.toSubmit} loading={sloading}>
          申请提现
        </Button>
      )
      if (auditStatus === '2'){
        btn =(
          <Button type="primary" block style={{ marginTop: '10px',height:'40px' }} onClick={this.toSubmit} loading={sloading}>
            重新申请
          </Button>
        )
      }
    }
    if (auditStatus === '4'){
      btn = (
        <Button type="primary" block style={{ marginTop: '10px',height:'40px' }} onClick={this.toSubmit} loading={sloading}>
          申请提现
        </Button>
      )
    }
    if (auditStatus === '0'){
      btn = (
        <Button type="primary" block style={{ marginTop: '10px',height:'40px' }} onClick={this.toRevoke} loading={rloading}>
          撤销申请
        </Button>
      )
    }
    if (auditStatus === '1'){
      btn = (
        <Button type="primary" block style={{ marginTop: '10px',height:'40px' }} onClick={this.handleSubmit} loading={loading}>
          提现
        </Button>
      )
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={this.goReturn}
        >提现申请
        </NavBar>
        <div className='am-list'>
          {
            pageloading ? <InTheLoad />:(
              <>
                <div>
                  {
                    auditStatus==="2"?
                      <div style={{
                        width: '100%',
                        height: '5%',
                        backgroundColor: '#fefcec',
                        color: '#f76a24',
                        fontSize: 16,
                        textAlign: 'center',
                      }}
                      >
                        申请已驳回,原因：{auditOpinion}
                      </div>:auditStatus==="0"?
                        <div style={{
                        width: '100%',
                        height: '5%',
                        backgroundColor: '#fefcec',
                        color: '#f76a24',
                        fontSize: 16,
                        textAlign: 'center',
                      }}
                        >
                        正在审核中
                        </div>:auditStatus==="1"?
                          <div style={{
                          width: '100%',
                          height: '5%',
                          backgroundColor: '#fefcec',
                          color: '#f76a24',
                          fontSize: 16,
                          textAlign: 'center',
                        }}
                          >
                          审核通过
                          </div>:auditStatus==="3"?
                            <div style={{
                            width: '100%',
                            height: '5%',
                            backgroundColor: '#fefcec',
                            color: '#f76a24',
                            fontSize: 16,
                            textAlign: 'center',
                          }}
                            >
                            提现完成
                            </div>:""
                  }
                </div>
                <Form style={{ marginTop: 8 }}>
                  <Card className={styles.card} bordered={false}>
                    <div style={{ padding: '10px 10px 10px 0px', fontSize: '16px' }}>
                      <Text align='left' style={{ marginRight: '10px', color: '#000' }}>可提现金额(元)</Text>
                      <Text
                        style={{ color: '#000' }}
                      >￥ {cashBalance === undefined ? '--' : Number(cashBalance).toFixed(2)}
                      </Text>
                    </div>
                  </Card>
                  <WhiteSpace />
                  <Card className={styles.card} bordered={false} style={{ padding: '10px 10px 10px 0px' }}>
                    <div align='left' style={{ color: '#000', fontSize: '16px' }}>
                      提现金额
                      <Row gutter={8} style={{height:'70px'}}>
                        <Form.Item style={{marginLeft:'-10px'}}>
                          <InputItem
                            form={form}
                            className='inputItemDra'
                            onChange={this.onChangePrice}
                            maxLength={10}
                            placeholder="请输入提现金额"
                            {...getFieldProps('amount',{
                              initialValue: realAmt,
                            })}
                            type={type}
                            editable={isEditable}
                            moneyKeyboardAlign="left"
                            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                          >
                            ¥
                          </InputItem>
                          {/* )} */}
                        </Form.Item>
                      </Row>
                    </div>
                    {/* auditStatus === 3 === 2 detail === '' */}
                    {
                      detail === '' ? (
                        <Button type="primary" block style={{ marginTop: '10px',height:'40px' }} onClick={this.toSubmit} loading={sloading}>
                          申请提现
                        </Button>
                      ):btn
                    }
                  </Card>
                </Form>
              </>
            )
          }

        </div>
      </div>
    );
  }
}

export default ksWithDrawal;
