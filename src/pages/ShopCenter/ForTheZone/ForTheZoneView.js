import React, { Component } from 'react';
import { Form, Icon, Tag } from 'antd';
import { router } from 'umi';
import { Modal, NavBar } from 'antd-mobile';
import Text from 'antd/lib/typography/Text';
import Func from '@/utils/Func';
import EventDetailStyle from '@/pages/ShopCenter/component/ComponentStyle';
import { isearnestMoney, noticeAdd, noticeCancel, seckillDetail } from '@/services/shoppingMall';
import { connect } from 'dva';
import { InTheLoad } from '@/components/Stateless/Stateless';
import { checkReserve } from '@/pages/ShopCenter/component/Interface';
import moment from 'moment';

const { alert } = Modal;
@Form.create()

@connect(({shoppingmall,loading})=>({
  shoppingmall,
  loading:loading.models.shoppingmall
}))
class SecondsKillView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isPurchased:null,
      loading: true,
      detail:{},
      buttonNum:'',
      isPay:'',
      maxPrices:0 // 最高报价
    }
  }

  componentDidMount() {
    this.timers = setInterval(()=>{
      const { match: { params: { id } },} = this.props;
      seckillDetail({id}).then(item=>{
        this.setState({
          maxPrices:item.data.maxPrice
        })
      })
    },3000)
    this.requestInterface()
    this.timer = setInterval(()=>{
      const {detail,detail:{activityStatus}} = this.state
      if (activityStatus === 5 &&moment().format("YYYY-MM-DD HH:mm:ss")>=detail.startTime){
        this.requestInterface()
        // clearInterval(this.timer)
        return
      }
      if (activityStatus === 6 &&moment().format("YYYY-MM-DD HH:mm:ss")>=detail.endTime){
        this.requestInterface()

        // setTimeout(()=>{
        //   endSpike({id:detail.id}).then(item=>{console.log(item)})
        // },3000)
        clearInterval(this.timer)
        return
      }
      this.setState({
         aa:Math.floor(Math.random() * 200)
      })
    },1000)
  }


  componentWillUnmount() {
    clearInterval(this.timer)
    clearInterval(this.timers)  // 清除定时器
    this.timers = null
  }

  requestInterface = () => {
    const { match: { params: { id,isSucceed,spikeStatus } },} = this.props;
    isearnestMoney({activityId:id}).then(resp=>{
      this.setState({
        isPay:resp.data
      })
    // 检验是否已经预约活动
    checkReserve(id).then(items=>{
      // 请求详情
      seckillDetail({id}).then(item=>{
        if (item.success){
          // 0-草稿、1-审核中、2-已驳回、3-审核通过、4-已取消、5-待开始、6-进行中 7-已流拍 8-已中拍
          let activityStatus = ''
          let buttonNum = '' // 判断按钮
          if (item.data.activityStatus === 6&&resp.data.status === 1) {
            activityStatus = 1;
            buttonNum = 1
          } else if (item.data.activityStatus === 5 && items === true) {
            activityStatus = 3;
          }else if (item.data.activityStatus === 8 && isSucceed==='1'&& spikeStatus==='1') {
            activityStatus =item.data.biddingMaterialType ===0?1:5;
            buttonNum = 2
          }else if (item.data.activityStatus === 8 && isSucceed==='1'&& spikeStatus==='2') {
            activityStatus = 1;
            buttonNum = 3
          } else if (item.data.activityStatus === 8 && isSucceed==='2') {
            activityStatus = 1;
            buttonNum = 4
          }else if (item.data.activityStatus === 8 && isSucceed==='1' && spikeStatus=== '0') {
            activityStatus = 1;
            buttonNum = 4
          } else if (item.data.activityStatus === 5 && items === false){
            activityStatus=2
          }else if(item.data.activityStatus === 6&& resp.data.status === 2 ){
            activityStatus = 4;
          }
          else {
            activityStatus=5
          }
          this.setState({
            detail: item.data,
            loading:false,
            isPurchased:activityStatus,
            buttonNum
          });
        }
      })
    })
    })
  }

  onBtnSubmit = (e) => {
    const { match: { params: { id } },} = this.props;
    const spikeActivityId = id
    const proMessage = { text: '我知道了', onPress: () => this.changeIsPurchased(id) }
    if (e === 'makeRemind'){     // activityType:2 竞价
      noticeAdd({spikeActivityId,activityType:2}).then(item=>{
        if (item.success){
          alert('预约提醒成功！', '系统将在活动开始前5分钟给您发送系统通知和短信通知提醒，请留意相关信息', [proMessage]);
        }
      })
      this.requestInterface()
    }
    if (e === 'cancelRemind'){
      noticeCancel({spikeActivityId}).then(item=>{
        if (item.success){
          alert('取消提醒成功！', '秒杀提醒已取消，您可能会抢不到哦~', [proMessage]);
        }
      })
      this.requestInterface()
    }
  }

  changeIsPurchased = (id) => {
    checkReserve(id).then(items=>{
      this.setState({
        isPurchased: items?3:2,
      });
    })
  }


  render() {
    const {form, match: {url},location:{state},} = this.props
    const {detail,loading,isPurchased,buttonNum,isSucceed,isPay,maxPrices} = this.state
    const {activityStatus,activityTitle,materialImg,factoryName,materialModel,materialTotal,materialDesc,materialName} = detail
    const styles = {margin:'5px 0 10px'}
    const startTime = <div style={styles}>距离活动开始剩余：<Text type="danger" strong>{Func.countdown(detail.startTime)}</Text></div>;
    const endTime = <div style={styles}>距离活动结束剩余：<Text type="danger" strong>{Func.countdown(detail.endTime)}</Text></div>;
    const TypeName=detail.biddingMaterialType===0?<Tag color='orange'>石料厂</Tag>:detail.biddingMaterialType===1?<Tag color='#7FFFD4'>项目</Tag>:detail.biddingMaterialType===2?<Tag color='#FF69B4'>其他</Tag>:''
    const eventlist = {
      additional:
  <div style={{padding:15,paddingRight:'0',background:'white',fontSize:'14px',display:'flex',justifyCountent:'flex-end',flex:1}}>
    <div style={{width:'60%',}}>关于<strong>{activityTitle}</strong>的活动&nbsp;&nbsp;</div>
    <div>
      {activityStatus===6||activityStatus===8?<Tag color='blue' style={{float:'right'}}>报价{detail.myBiddingCount}次</Tag>:isPurchased===3?<Tag color='blue' style={{float:'right'}}>已预约</Tag>:''}
      {activityStatus === 6 ?<Tag color='green'>进行中</Tag>:activityStatus === 5 ?<Tag color='orange'>待开始</Tag>:activityStatus === 8?<Tag color='red'>已结束</Tag>:''}
    </div>


  </div>,
      image:materialImg,
      title:(
        <>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <Text type="danger">起拍价</Text>&nbsp;
              <Text type="danger" strong style={{fontSize:20}}>{detail.biddingStartPrice}元/吨</Text>
              <Tag icon="history" size="small" className="secondsBtn">{detail.biddingWay===0?'公开竞价':'封闭竞价'}</Tag>
            </div>
            <span style={{float:'right',fontWeight:'300',}}>{detail.activityStatus === 5 ?<text>共有<span style={{fontWeight:'500'}}>{detail.deptCount}</span>家预约</text>: <text>已有<span style={{fontWeight:'500'}}>{detail.deptBiddingCount}</span>家报价</text>}</span>
          </div>

          {activityStatus === 5?startTime:activityStatus === 6?endTime:''}
        </>
      ),
      subtitle:<span style={{fontSize:'18px'}}>{materialName}</span>,
      content:[
        {label:'竞价类型',value:TypeName},
        {label:'所属机构',value:factoryName},
        {label:'型号',value:materialModel},
        {label:'商品数量',value:`${materialTotal}吨`},
        {label:'活动时间',value: `${detail.startTime}至${detail.endTime}`},
      ],
      introduce:[{ title: '商品介绍', context:materialDesc }],
      description:[{title:'竞价说明', context:
  <div style={{fontSize:'12px',lineHeight:'15px'}}>
    <p>●&nbsp;支付保证金：所有竞价方参与活动之前须支付本次活动的保证金，以作为平台担保保证活动顺利进行</p>
    <p>●&nbsp;封闭竞价：指竞价过程不公开，竞价方可以查看起拍价和自己的报价，其它报价信息所有竞价方均无法浏览</p>
    <p>●&nbsp;出价原则：第一个报价必须大于等于起拍价，此后竞价方可以多次报价，最新报价不可以低于前一次报价，竞价方的有效报价为其最后一个报价</p>
    <p>●&nbsp;成交方式：系统自动按照价格优先、时间优先原则确定中拍方</p>
    <p>●&nbsp;确定中拍后，中拍方需在中拍之时起3天内完成竞价合同签约，超时未签约系统将自动关闭交易，同时将冻结保证金</p>
    <p>●&nbsp;若竞价方未中拍，平台将退还保证金</p>
  </div>
      }],
      steps:[{ description: '交保证金' }, { description: '参与竞价' }, { description: '竞价成功' }, { description: '在线签约' },
      ],
      steps1:[{ description: '支付货款' }, { description: '完成发运' },{ description: '合同结算' },{ description: '退保证金' },]
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={()=>url.includes('forthezonebid')?router.push('/shopcenter/forthezone/forthezoneBidding'):router.push(`/shopcenter/forthezone`)}
          rightContent={detail.activityStatus !== '5'?<span onClick={()=>router.push(`/shopcenter/forthezone/biddingrecord/${detail.biddingWay}/${detail.activityStatus}/${detail.id}`)}>竞价记录</span>:''}
        >活动详情
        </NavBar>
        {
          loading?<InTheLoad />:<EventDetailStyle useRefresh pullRefresh={this.requestInterface} list={eventlist} theBidding isSucceed={isSucceed} maxPrices={maxPrices} getParent={this.requestInterface} buttonNum={buttonNum} detail={detail} isPay={isPay} state={state} pageType="secondskill" hidden={activityStatus === 7} isPurchased={isPurchased} form={form} onBtnSubmit={this.onBtnSubmit} />
        }
      </div>
    );
  }
}

export default SecondsKillView;
