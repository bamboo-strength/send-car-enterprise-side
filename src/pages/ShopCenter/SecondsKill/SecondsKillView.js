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
class SecondsKillView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isPurchased:null,
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
          } else {
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
    if (e === 'makeRemind'){   // activityType:1 秒杀
      noticeAdd({spikeActivityId,activityType:1}).then(item=>{
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
    const {detail,isPurchased,loading} = this.state
    const {activityStatus,activityTitle,materialImg,factoryName,materialModel,materialTotal,minNum,maxNum,materialDesc,materialPrice,materialName,activityStatusName} = detail
    const styles = {margin:'5px 0 10px'}
    const startTime = <div style={styles}>距离活动开始剩余：<Text type="danger" strong>{Func.countdown(detail.startTime)}</Text></div>;
    const endTime = <div style={styles}>距离活动结束剩余：<Text type="danger" strong>{Func.countdown(detail.endTime)}</Text></div>;
    const eventlist = {
      additional:<div style={{padding:15,background:'white'}}>关于{activityTitle}的秒杀活动&nbsp;&nbsp;&nbsp;<Tag color={activityStatus === 6 ?'green':activityStatus === 5 ?'orange':'red'}>{activityStatusName}</Tag></div>,
      image:materialImg,
      title:(
        <>
          <Text type="danger">秒杀价</Text>&nbsp;&nbsp;
          <Text type="danger" strong style={{fontSize:20}}>{materialPrice}元/吨</Text>
          <Button icon="history" size="small" className="secondsBtn">限时秒杀</Button>
          {activityStatus === 5?startTime:endTime}
        </>
      ),
      subtitle:materialName,
      content:[
        {label:'所属机构',value:factoryName},
        {label:'型号',value:materialModel},
        {label:'商品数量',value:`${materialTotal}吨`},
        {label:'秒杀数量下限',value:`${minNum}吨`},
        {label:'秒杀数量上限',value:`${maxNum}吨`},
        {label:'活动时间',value: `${detail.startTime}至${detail.endTime}`},
      ],
      introduce:[{ title: '商品介绍', context:materialDesc }],
      steps:[{ description: '购买下单' }, { description: '交保证金' }, { description: '在线签约' }, { description: '支付货款' }, { description: '发运完成' }, { description: '退保证金' },],
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={()=>router.push(`/shopcenter/secondskill`)}
        >活动详情
        </NavBar>
        {
          loading?<InTheLoad />:<EventDetailStyle list={eventlist} detail={detail} pageType="secondskill" hidden={activityStatus === 7} isPurchased={isPurchased} form={form} onBtnSubmit={this.onBtnSubmit} />
        }
      </div>
    );
  }
}

export default SecondsKillView;
