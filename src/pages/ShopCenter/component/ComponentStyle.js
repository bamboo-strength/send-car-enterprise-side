import Image from '@/pages/ShopCenter/component/Image';
import styles from '../ShopCenter.less';
import { Button, Card, Form, Icon } from 'antd';
import { Modal, NoticeBar, Steps, Toast } from 'antd-mobile';
import React, { Component } from 'react';
import BuyNumModel from '@/pages/ShopCenter/component/BuyNumModel';
import { SHOPPING_SHOPCART_ADDCART } from '@/actions/shoppingMall';
import { router } from 'umi';
import { connect } from 'dva';
import { isearnestMoney, partBidding, payEarnestSubmit, purchase } from '@/services/shoppingMall';
import Text from 'antd/es/typography/Text';
import BiddingNumModel from '@/pages/ShopCenter/component/BiddingNumModel';
import { getCurrentUser, getUserType } from '@/utils/authority';
import MPullToRefresh from '@/components/m-pull-to-refresh/m-pull-to-refresh';


const { Step } = Steps;

export function CommodityStyle(props) {
  const { comlist, style } = props;
  const { title, image, content, tag,infor, custom } = comlist;
  const theStyle ={width:'100%',height:'30px',lineHeight:'30px',textAlign:'center',opacity:'0.7', color:'white',fontSize:'14px',background:'#5B5959',position: 'absolute', bottom: 0 }
  /**
   * @author 马静
   * @date 2022/3/31
   * @Description:
   * title：标题
   * image：图片路径
   * content：内容展示
   * tag：是否在图片上显示 标签
   * custom：图片是否自定义
   */
  return (
    <div className={styles.commodityWrap} style={style}>
      <div style={{ position: 'relative' }}>
        {custom ? image : <Image className='commodityImage' imageUrl={image} onClick />}
        {tag && <div style={{ position: 'absolute', top: 0 }}>{tag}</div>}
        {infor && <div style={theStyle}>{infor}</div>}

      </div>
      <div className='commoditySidebar' style={{ width: 'calc(100% - 115px)' }}>
        <div className='commodityTie'>{title}</div>

        {
          content.map(item => {
            const { label, value, className, img, onClick } = item;
            return (
              <div className={className || 'commodityCon'} onClick={onClick} style={item.style}>
                {img && <img src={img} alt='' className='iconImg' />}
                <Text className='commodityTe'>{label && `${label}：`}{value}</Text>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

const { alert } = Modal;
@connect(({ shoppingmall }) => ({
  shoppingmall,
}))
@Form.create()
export default class EventDetailStyle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      bidModal:false,
      name: '',
      payModal:false,
      isPay:'',
      auditModal:false
    };
  }

  componentDidMount() {
    const {onRef} = this.props
    if (onRef) onRef(this)
    // this.setState({
    //   isPay:isPay
    // })
  }

  payearnestSubmit=()=>{
    const {detail} = this.props
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    payEarnestSubmit({  // 保证金支付
      custType:custTypeFlag,
      biddingMaterialType:detail.biddingMaterialType,  // 竞价类型
      earnestType:1,
      refundSuccess:0,
      activityType:detail.activityType,
      userId: getCurrentUser().userId,
      rebackUrl: `/shopcenter/forthezone/view/${detail.id}`,
      activityId:detail.id,
      activityNumber:detail.activityNo,
      chanCode: 16,
      deptId:detail.factoryId,
      productCode:detail.materialId,
      paymentAmount:detail.earnestMoney,
      materialname:detail.materialName
    }).then(resp=>{
      if(resp.success){
        window.open(resp.data,'_self')
      }else {
        Toast.info(resp.msg)
      }

    })
  }

  handleAgree=()=>{
    const {isPay} = this.props
    if(isPay.auditType === 1 ){
      this.setState({
        payModal:true
      })
    }else {
      this.setState({
        auditModal:true
      })
    }

  }

  /* 打开购物车弹窗 */
  onShopCart = (name) => {
    const { form,onBtnSubmit,detail,state,isPay} = this.props;
    form.resetFields();
    const aa =(<div style={{fontSize:'14px',textAlign:'left'}}>
      <p>&nbsp;&nbsp;   为规范活动秩序，保证活动有效性，防止浪费中拍名额的现象发生，需活动参与者在参与竞价之前支付一定金额的保证金</p>
      <p>
        <span>保证金处理方式：</span><br/>
        <span >1.对于未中拍的参与者，平台退还其保证金；</span><br/>
        <span> 2.对于中拍的参与者，未在规定时间（3天）内完成合同签约的，合同作废，平台扣收其保证金；</span><br/>
        <span>3.对于已中拍并完成合同签约的参与者，未在规定时间（3天）内首付货款的，平台扣收其保证金；</span><br/>
        <span> 4.对于已中拍并完成合同签约和首付货款的参与者，未在合同期限内完成发运的，平台扣收其保证金；</span><br/>
        <span> 5.对于已中拍并按流程在合同期限内完成发运的参与者，平台退还其保证金。</span><br/>
      </p>
      若您同意，请点击下方【同意】按钮支付保证金，若您不同意，可点击【取消】。
      如有疑问，请拨打0538-2720008进行咨询。
    </div>)

    if (name === 'makeRemind'|| name === 'cancelRemind') {  //预约提醒、取消提醒
      if (onBtnSubmit) onBtnSubmit(name)
    } else if(name === 'ImmediatelyBid'){  // 参与竞价
      isearnestMoney({activityId:detail.id}).then(res=>{
        //检测是否交过保证金
        if(res.data.auditType===2){  // 类型    1.线上支付  2.线下支付 （去上传支付凭证）
          if(res.data.auditStatus ===2){   // auditStatus 审核状态
            this.setState({
              bidModal: true,
              name
            })
          } else{
            alert('说明', aa, [
            { text: '取消', style: 'default' },
            { text: '同意', onPress: this.handleAgree },
          ])
          }
        } else {
          if(res.data.status===2){
            alert('说明', aa, [
              { text: '取消', style: 'default' },
              { text: '同意', onPress: this.handleAgree },
            ]);
          }else {
            this.setState({
              bidModal: true,
              name
            })
          }
        }
      })
      // const {isMoney} = this.state
    }else if(name === 'payDeposit'){
      isearnestMoney({activityId:detail.id}).then(res=>{
        //检测是否交过保证金
        if(res.data.auditType===2){  // 类型
          if(res.data.status===2){   // 1交过  2没交
            alert('说明', aa, [
              { text: '取消', style: 'default' },
              { text: '同意', onPress: this.handleAgree },
            ]);
          }else{
            Toast.success('您已审核通过，不需重复提交')
          }
        } else {
          if(res.data.status===2){
            alert('说明', aa, [
              { text: '取消', style: 'default' },
              { text: '同意', onPress: this.handleAgree },
            ]);
          }else{
            Toast.success('您已支付保证金，不需重复支付')
          }
        }
      })
    }
    else if(name === 'contractSigning'){  //确认订单-已中拍
      router.push(`/shopcenter/forthezone/submitorder/${state}`)
    }else if(name === 'viewContract'){  //查看合同-中拍已签约
      router.push('/shopcenter/contract')
    }else if(name === 'queryCondition'){  //查看其他活动-未中拍
      router.push('/shopcenter/forthezone')
    }else {
      this.setState({
        modal: true,
        name,
      });
    }
  };

  // 弹窗确定事件
  onPress = () => {
    const { form, detail, dispatch } = this.props;
    const { name } = this.state;
    form.validateFields((err, value) => {
      if (!err) {
       if(detail.isLimit!==1){
         if (detail.type !== 1 && value.number > detail.totalNum) {
           Toast.fail('您购买的数量大于剩余量，请修改购买数量！');
           return;
         }
       }
        if (name === 'addShopCart') { // 添加购物车
          const params = {
            number: value.number,
            factoryId: detail.factoryId,
            goodsId: detail.id,
            goodsType: detail.type,
          };
          dispatch(SHOPPING_SHOPCART_ADDCART(params)).then(() => {
            const { shoppingmall: { submit: { addCart } } } = this.props;
            if (addCart && addCart.success) {
              Toast.success('加入购物车成功，可点击购物车查看');
            }
          });
        }else if (name === 'Immediatelykill'){ // 立即秒杀
          const shopSpikeOrderVO = {
            activityNo:detail.activityNo, // 活动编号(必须)
            spikeActivityId:detail.id,
            spikeMaterial:value.number, // 竞价金额
            unit:detail.unit, // 计量单位
          }
          purchase(shopSpikeOrderVO).then(item=>{
            if (item.success){
              Toast.loading(`${item.msg},请等待...`, 50, );
              setTimeout(() => {
                Toast.hide();
                router.push('/shopcenter/secondskill/order')
              }, 5000);
            }
          })
        } else {
          const namePath = {
            buyNow: `/shopcenter/makesuretheorder`,
            secondsKill: `/shopcenter/secondskill/submitorder`,
          };
          router.push({
            pathname: namePath[name],
            state: {
              data: detail,
              number: value.number,
              type: 'goodsDetails',
            },
          });
        }
        this.setState({
          modal: false,
        });
      }
    });
  };

  // 竞价弹框
  bidPress = () => {
    const { form, detail,} = this.props;
    const { name } = this.state;
    form.validateFields((err, value) => {
      if (!err) {
        if(value.number<detail.biddingStartPrice){
          Toast.fail('报价小于起拍价，请重新输入报价')
        }else if (name === 'ImmediatelyBid'){ // 竞价
          const shopSpikeOrderVO = {
            refundSuccess:0,
            materialName:detail.materialName,
            factoryId:detail.factoryId,
            activityTitle:detail.activityTitle,
            activityNo:detail.activityNo, // 活动编号(必须)
            spikeActivityId:detail.id,
            spikeMaterial:detail.materialTotal,
            materialPriceTotal:value.number,
            unit:detail.unit, // 计量单位
            activityType:'2',
            biddingWay:detail.biddingWay,
          }
          partBidding(shopSpikeOrderVO).then(item=>{
            if (item.success){
              Toast.success(item.msg);
            }
          })
        }
        this.setState({
          bidModal: false,
        });
      //  调用父组件的方法,重新请求一次详情接口
        this.props.getParent()
      }
    });
  };

  /* 跳转购物车页面 */
  shopCart = () => {
    router.push({
      pathname:'/shopcenter/shoppingcart',
      state:{
        type:'goodsDetails'
      }
    });
  };

  // 关闭弹窗
  onClose = () => {
    this.setState({
      modal: false,
      bidModal:false,
      payModal:false,
      auditModal:false
    });
  };

  goAudit=()=>{
    const {detail} = this.props
    router.push({pathname:`/shopcenter/forthezone/uploadcashDeposit`,state:detail})
  }

  refresh1 = () => {
    const { pullRefresh } = this.props;
    return new Promise((resolve) => {
      console.log('22222222');
      pullRefresh && pullRefresh()
      resolve()
    })
  };

  render() {
    const { list, detail, form, isPurchased,hidden,pageType,theBidding,buttonNum,isSucceed,isPay,maxPrices, useRefresh} = this.props;
    const isPayStatus = isPay!==undefined&&isPay.status
    const isPayType = isPay!==undefined&&isPay.auditType
    // console.log(isPurchased,buttonNum)
    const { modal ,bidModal,payModal,auditModal} = this.state;
    const { image, title, subtitle, content, introduce,description, steps,steps1, additional } = list;
    const { totalNum } = detail;
    const round = {block:'true',shape:'round'}
    const payTitle=<div style={{borderBottom:'1px solid #F2F2F2',textAlign:'left',fontSize:'14px',paddingBottom:'3px'}}>确认保证金</div>
    const auditTitle=<div style={{borderBottom:'1px solid #F2F2F2',textAlign:'left',fontSize:'14px',paddingBottom:'3px'}}>提示</div>
    // const buttonName= isPay.status === 1 ?'已支付':isPay.auditType===1?'支付保证金':isPay.auditStatus ===3?'已驳回，重新上传':'上传支付凭证'
    const purchased = [
      {
        btn: (
          <>
            <div className='shopCart' onClick={this.shopCart}>
              <Icon type="shopping-cart" />
              <Text type="secondary">购物车</Text>
            </div>
            <div className='shopCart-box'>
              <Button onClick={() => this.onShopCart('addShopCart')}>加入购物车</Button>
              <Button onClick={() => this.onShopCart('buyNow')} type="danger">立即购买</Button>
            </div>
          </>
        ),
      },
      { btn: <Button {...round} style={theBidding ? { background: '#6436F4'} : { background: '#f4365a'} } onClick={() => this.onShopCart(theBidding&&
        buttonNum===1 ? 'ImmediatelyBid' :buttonNum===2?'contractSigning':buttonNum===3?'viewContract':buttonNum===4?'queryCondition':'Immediatelykill')}>
          {theBidding && buttonNum===1? '参与竞价' :buttonNum===2?'合同签约':buttonNum===3?'查看合同':buttonNum===4?'查看其他活动' :'立即秒杀'}</Button>, },
      { btn: <Button {...round} style={theBidding ? { background: '#AB36F4'} : { background: '#f4365a'}} onClick={() => this.onShopCart('makeRemind')}>预约提醒</Button>, },
      { btn:<div className='shopCart-box'>
          <Button {...round} style={{ color: '#ff9314',border: '1px solid #ff9314' }} onClick={() => this.onShopCart('cancelRemind')} ghost>取消提醒</Button>
          <Button {...round} style={{ color: '#ff9314',border: '1px solid #ff9314' }} disabled={isPay!==null&&isPayStatus === 1 &&true} onClick={() => this.onShopCart('payDeposit')}>{isPay!==null&&isPayStatus === 1 ?'已支付':isPayType===1?'支付保证金':isPayStatus ===3?'已驳回，重新上传':'上传支付凭证'}</Button>:
      </div> },
      { btn: <Button {...round} style={{ color: '#ff9314',border: '1px solid #ff9314' }} disabled={isPay!==null&&isPayStatus=== 1 &&true} onClick={() => this.onShopCart('payDeposit')}>{isPay!==null&&isPayStatus=== 1 ?'已支付':isPayType===1?'支付保证金':isPayStatus===3?'已驳回，重新上传':'上传支付凭证'}</Button>},
      {btn:undefined}
    ];
    /**
     * @author 马静
     * @date 2022/4/2
     * @Description:
     * image：图片地址
     * title：标题名称
     * subtitle：副标题
     * content：内容
     * introduce：card显示内容，例：商品介绍、优惠政策
     * steps：
     * isPurchased:底部导航
     * hidden:控制底部导航是否显示
     */
    const contentPage = () => {
      return (
        <div className={`${styles.shopCenter} am-list ${styles.goodsDetails}`} style={{ paddingBottom: isPurchased !== false && 70 }}>
            {
              theBidding &&detail.biddingWay!==1 && isPurchased === 1&&detail.activityStatus===6?
                <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} mode="closable">
                  {maxPrices !==0?<span>当前最高报价：<Text strong style={{color:'#F99643'}}>{maxPrices}元/吨</Text></span>:'当前未有人报价'}
                    </NoticeBar> : ''
            }
            {
              theBidding && buttonNum===2?
                <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} mode="closable">
                  恭喜您中拍！已为您生成竞价合同，请在3天内完成签约~
                </NoticeBar> : ''
            }
            {
              theBidding && buttonNum===4?
                <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} mode="closable">
                  超时未签约，交易关闭！
                </NoticeBar> : ''
            }
            {
              theBidding && isSucceed===2&&buttonNum===4?
                <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} mode="closable">
                  很遗憾，您未中拍！
                </NoticeBar> : ''
            }

            {additional && additional}
            <Image className='shop-img' imageUrl={image} onClick />
            <Card bordered={false}>
              {title && <div>{title}</div>}
              {subtitle && <Text strong>{subtitle}</Text>}
              {
                content && content.map(item => {
                  const { label, value, className } = item;
                  return (
                    <div className={className || 'eventdetailCon'}>
                      <Text className='commodityTe'>{label && `${label}：`}{value}</Text>
                    </div>
                  );
                })
              }
            </Card>
            {
              introduce && introduce.map(item => {
                return (
                  <Card title={item.title} style={{ marginTop: 6 }} bordered={false} headStyle={{ minHeight: 40 }}>
                    <p style={{ wordWrap: 'break-word' }}>{item.context}</p>
                  </Card>
                );
              })
            }
            {
              description && description.map(item => {
                return (
                  <Card title={item.title} style={{ marginTop: 6 }} bordered={false} headStyle={{ minHeight: 40 }}>
                    <p style={{ wordWrap: 'break-word' }}>{item.context}</p>
                  </Card>
                );
              })
            }
            {
              steps && (
                <Card style={{ marginTop: 6 }} bordered={false}>
                  <Steps
                    current={4}
                    direction="horizontal"
                    size="small"
                    className='goodSteps'
                    style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
                  >
                    {steps.map((s, i) => <Step
                      key={s.description}
                      status="finish"
                      icon={i + 1}
                      description={s.description}
                    />)}
                  </Steps>
                  { steps1 ?
                    <Steps
                      current={4}
                      direction='horizontal'
                      size='small'
                      className='goodSteps'
                      style={{ gridTemplateColumns: `repeat(${steps1.length}, 1fr)` }}
                    >
                      {steps1.map((s, i) => <Step
                        key={s.description}
                        status='finish'
                        icon={i + 5}
                        description={s.description}
                      />)}
                    </Steps> : ''}

                  <Modal   // 支付保证金弹窗
                  visible={payModal}
                  transparent
                  closable
                  title={payTitle}
                  footer={[{ text: '下一步', onPress:this.payearnestSubmit }]}
                  onClose={this.onClose}
                  >
                    <p>待支付保证金</p>
                    <p>￥<strong style={{fontSize:'20px'}}>{Number(detail.earnestMoney).toFixed(2)}</strong>元</p>
                    <div style={{marginTop:'25px',paddingTop:'10px',borderTop:'1px solid #F2F2F2'}}>
                      <div style={{textAlign:'left',float:'left',paddingLeft:'40px'}}>支付方式</div>
                      <strong style={{float:'right',paddingRight:'40px',}}>钱包余额</strong>
                    </div>
                  </Modal>
                  <Modal   // 上传支付凭证弹窗
                    visible={auditModal}
                    transparent
                    closable
                    title={auditTitle}
                    footer={[{ text: '去上传凭证', onPress:this.goAudit }]}
                    onClose={this.onClose}
                  >
                    <div style={{color:'red'}}>请确保您已支付过保证金，请上传保证金支付凭证，待审核通过即可参与活动</div>
                    <p>已支付保证金</p>
                    <p>￥<strong style={{fontSize:'20px'}}>{Number(detail.earnestMoney).toFixed(2)}</strong>元</p>
                  </Modal>
                </Card>
              )
            }

          </div>
      )
    };
    return (
      <div>
        {useRefresh ? (
          <MPullToRefresh refresh={this.refresh1} loadMore={() => { }}>
          {contentPage()}
        </MPullToRefresh>
        ) : contentPage()}
        { !hidden && isPurchased !== false && isPurchased!==5&&<div className='goodCart'>{purchased[isPurchased].btn}</div>}
        {
          theBidding ?
            <BiddingNumModel
              detail={detail}
              maxPrices={maxPrices}
              id='number'
              title="提交报价"
              visible={bidModal}
              form={form}
              onPress={this.bidPress}
              onClose={this.onClose}
              number={detail.type === 3 || detail.type === 4 ? totalNum && totalNum.toFixed(2) : ''}
              disabled={detail.type === 3 ||detail.type ===4}
              pageType={pageType}
            /> :
            <BuyNumModel
              detail={detail}
              id='number'
              title="输入购买数量"
              visible={modal}
              form={form}
              onPress={this.onPress}
              onClose={this.onClose}
              number={detail.type === 3 || detail.type === 4 ? totalNum && totalNum.toFixed(2) : ''}
              disabled={detail.type === 3 ||detail.type ===4}
              pageType={pageType}
            />
        }
      </div>
    );
  }
}

export function SubmitOrdersBtn(props) {
  const {loading,onClick,amount,btnText} = props
  return (
    <div className='goodCart'>
      <div>总计：<Text type="danger" strong style={{ fontSize: 24 }}>￥{amount.toFixed(2)}</Text></div>
      <Button
        onClick={onClick}
        type="primary"
        shape="round"
        style={{ padding: '0 30px', height: '40px' }}
        loading={loading}
      > {btnText || '提交订单'}
      </Button>
    </div>
  )
}
