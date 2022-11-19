import React, { PureComponent } from 'react';
import { Button, Card, Form, Icon, message } from 'antd';
import { NavBar, Toast } from 'antd-mobile';
import Text from 'antd/lib/typography/Text';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import { paymentSubmit, payprice } from '@/services/contract';
import router from 'umi/router';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';
import { getCurrentUser, getUserType } from '@/utils/authority';
import { clientId } from '@/defaultSettings';

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

@Form.create()
class PaymentInAdvance extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      price:''
    };
  }

  componentWillMount() {
    const {  location } = this.props;
    const { state: { item } } = location;
    payprice({ contractNo:item.contractNo}).then(resp =>{
      this.setState({
        price:resp.data
      })
    })
  }

  onSubmit = () => {
    const { form, location } = this.props;
    const { state: { item } } = location;
    const {price } =this.state
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors){
        if (values.paymentMoney>item.pendingPayment){
          Toast.fail('预付金额不能大于待付金额!')
          return
        }
        if (values.paymentMoney>=price){
          const params = {
            contractno: item.contractNo,
            paymentAmount: values.paymentMoney,
            rebackUrl: '/shopcenter/contract',
            chanCode:16,
            custType:clientId==='kspt_shf'&&custTypeFlag===1?1:0,
            userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:undefined
          }
          this.setState({
            loading:true
          })
          paymentSubmit(params).then(resp => {
            this.setState({
              loading:false
            })
            if (resp.success) {
              window.open(resp.data, '_self')
            }
          });
        }else {
          message.error(`预付金额不低于${ price}`)
        }
      }
    });
  };

  onRef = (ref) => {
    this.child = ref;
  };

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  };


  render() {
    const { form, location } = this.props;
    const { loading} = this.state;
    let items = {}
    if (!location.state){
      router.push('/shopcenter/contract')
    }else {
      const { item } = location.state;
      items = item
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            window.history.back();
          }}
        >预付货款
        </NavBar>
        <div className="am-list">
          <div style={{padding:'0 15px',background:'white'}}>
            <MatrixListItem label={<Text strong>合同编号</Text>} title={items.contractNo} />
            <MatrixListItem label={<Text strong>合同物资</Text>} title={items.goodsNameStr} />
            <MatrixListItem label={<Text strong>合同金额</Text>} title={`${items.totalPrice}元`} />
            <MatrixListItem label={<Text strong>已付金额</Text>} title={`${items.paid}元`} />
            <MatrixListItem label={<Text strong>待付金额</Text>} title={`${items.pendingPayment}元`} />
          </div>
          <Card title='预付金额' size="small" bordered={false} style={{marginTop: 10}}>
            <MatrixMobileInput form={form} id='paymentMoney' labelId='price' labelNumber={1} isColon label='￥' placeholder="请输入预付金额" required numberType="isFloatGtZero" realbit={2} />
          </Card>
          {/*  <Card title='付款方式' size="small" bordered={false}>
            <List.Item thumb={<Icon type="alipay-circle" style={{fontSize:20}} />}>账户余额</List.Item>
          </Card> */}
          <div style={{ background: 'white', padding: '15px' }}>
            <Text type="danger">注：晚上11点以后充值资金不能实时到账，影响发运，请知晓</Text>
            <Button type="primary" style={{marginTop:10}} block onClick={this.onSubmit} size="large" loading={loading}>确认预付</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default PaymentInAdvance;
