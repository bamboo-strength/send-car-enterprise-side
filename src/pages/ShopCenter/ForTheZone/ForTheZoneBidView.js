import React, { Component } from 'react';
import { Button, Form, Icon, Tag } from 'antd';
import { router } from 'umi';
import { Modal, NavBar } from 'antd-mobile';
import Text from 'antd/lib/typography/Text';
import Func from '@/utils/Func';
import EventDetailStyle from '@/pages/ShopCenter/component/ComponentStyle';
import { endSpike, noticeAdd, noticeCancel, seckillDetail } from '@/services/shoppingMall';
import { connect } from 'dva';
import { InTheLoad } from '@/components/Stateless/Stateless';
import { checkReserve } from '@/pages/ShopCenter/component/Interface';

const { alert } = Modal;
@Form.create()

@connect(({shoppingmall,loading})=>({
  shoppingmall,
  loading:loading.models.shoppingmall
}))
class ForTheZoneBidView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isPurchased:'',
      loading: true,
      detail:{},
    }
  }

  componentDidMount() {
    this.requestInterface()
    this.timer = setInterval(()=>{
      const {detail,detail:{activityStatus}} = this.state
      if (activityStatus === 5 && Func.countdown(detail.startTime) === '0 天 0 时 0 分 0 秒'){
        this.requestInterface()
        clearInterval(this.timer)
        return
      }
      if (activityStatus === 6 && Func.countdown(detail.endTime) === '0 天 0 时 0 分 0 秒'){
        this.requestInterface()
        setTimeout(()=>{
          endSpike({id:detail.id}).then(item=>{console.log(item)})
        },3000)
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
  }

  requestInterface = () => {
    const { match: { params: { id } },} = this.props;
    // 检验是否已经预约活动
    checkReserve(id).then(items=>{
      // 请求详情
      seckillDetail({id}).then(item=>{
        if (item.success){
          // 0-草稿、1-审核中、2-已驳回、3-审核通过、4-已取消、5-待开始、6-进行中 7-已结束
          let activityStatus = ''
          if (item.data.activityStatus === 6) {
            activityStatus = 1;
          } else if (item.data.activityStatus === 5 && items === true) {
            activityStatus = 3;
          } else if(item.data.activityStatus === 5 && items === false){
            activityStatus = 2;
          }
          this.setState({
            detail: item.data,
            loading:false,
            isPurchased:activityStatus
          });
        }
      })
    })
  }

  onBtnSubmit = (e) => {
    const { match: { params: { id } },} = this.props;
    const spikeActivityId = id
    const proMessage = { text: '我知道了', onPress: () => this.changeIsPurchased(id) }
    if (e === 'makeRemind'){
      noticeAdd({spikeActivityId,activityType:2}).then(item=>{
        if (item.success){
          alert('预约提醒成功！', '系统将在活动开始前5分钟给您发送系统通知和短信通知提醒，请留意相关信息', [proMessage]);
        }
      })
    }
    if (e === 'cancelRemind'){
      noticeCancel({spikeActivityId}).then(item=>{
        if (item.success){
          alert('取消提醒成功！', '秒杀提醒已取消，您可能会抢不到哦~', [proMessage]);
        }
      })
    }
  }

  changeIsPurchased = (id) => {
    checkReserve(id).then(items=>{
      if (items === true){
        this.setState({
          isPurchased: 3,
        });
      }else {
        this.setState({
          isPurchased: 2,
        });
      }
    })
  }

  render() {
    const {form} = this.props
    const {detail,loading,isPurchased} = this.state
    console.log(detail,33)
    // eslint-disable-next-line no-undef
    // const isPurchased = 2
    const {activityStatus,activityTitle,materialImg,factoryName,materialModel,materialTotal,materialDesc,materialName,activityStatusName} = detail
    const styles = {margin:'5px 0 10px'}
    const startTime = <div style={styles}>距离活动开始剩余：<Text type="danger" strong>{Func.countdown(detail.startTime)}</Text></div>;
    const endTime = <div style={styles}>距离活动结束剩余：<Text type="danger" strong>{Func.countdown(detail.endTime)}</Text></div>;
    const eventlist = {
      additional:<div style={{padding:15,background:'white'}}>关于{activityTitle}的竞价活动&nbsp;&nbsp;&nbsp;<Tag color={activityStatus === 6 ?'green':activityStatus === 5 ?'orange':'red'}>{activityStatusName}</Tag></div>,
      image:materialImg,
      title:(
        <>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <Text type="danger">起拍价</Text>&nbsp;
              <Text type="danger" strong style={{fontSize:20}}>{detail.biddingStartPrice}元/吨</Text>
              {<Button icon='history' size='small' className='secondsBtn'>{detail.biddingWay === 0 ? '公开竞价' : detail.biddingWay === 1 ? '封闭竞价' :''}</Button>}
            </div>
            <span style={{float:'right',fontWeight:'300',}}>{detail.activityStatus === 5 ?<text>共有<span style={{fontWeight:'500'}}>{detail.deptCount}</span>家预约 </text>: <text>已有<span style={{fontWeight:'500'}}>{detail.deptBiddingCount}</span>家报价 </text>}</span>,
          </div>

          {activityStatus === 5?startTime:endTime}
        </>
      ),
      subtitle:materialName,
      content:[
        {label:'所属机构',value:factoryName},
        {label:'型号',value:materialModel},
        {label:'商品数量',value:`${materialTotal}吨`},
        {label:'活动时间',value: `${detail.startTime}至${detail.endTime}`},
      ],
      introduce:[{ title: '商品介绍', context:materialDesc }],
      description:[{title:'竞价说明', context:
  <span>
    <span>支付保证金：所有竞价方参与活动之前须支付本次活动的保证金，以作为平台担保保证活动顺利进行</span>
    <span>封闭竞价：指竞价过程不公开，竞价方可以查看起拍价和自己的报价，其它报价信息所有竞价方均无法浏览</span><br />
    <span>出价原则：第一个报价必须大于等于起拍价，此后竞价方可以多次报价，最新报价可以低于前一次报价，但竞价方的有效报价为其最后一个报价</span><br />
    <span>成交方式：系统自动按照价格优先、时间优先原则确定中拍方</span><br />
    <span>确定中拍后，中拍方需在中拍之时起3天内完成竞价合同签约，超时未签约系统将自动关闭交易，同时将中拍方加入竞价黑名单，无法再参与竞价活动</span>
    <span>若竞价方未中拍，平台将退还保证金</span>
  </span>
      }],
      steps:[{ description: '交保证金' }, { description: '参与竞价' }, { description: '竞价成功' }, { description: '在线签约' },],
      steps1:[ { description: '支付货款' }, { description: '完成发运' },{ description: '合同结算' },{ description: '退保证金' },]
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={()=>router.push(`/shopcenter/forthezone`)}
          rightContent={<span onClick={()=>router.push(`/shopcenter/forthezone/biddingrecord/${detail.biddingWay}/${detail.id}`)}>竞价记录</span>}
        >活动详情
        </NavBar>
        {
          loading?<InTheLoad />:<EventDetailStyle list={eventlist} detail={detail} pageType="secondskill" hidden={activityStatus === 8} isPurchased={isPurchased} form={form} onBtnSubmit={this.onBtnSubmit} />
        }
      </div>
    );
  }
}

export default ForTheZoneBidView;
