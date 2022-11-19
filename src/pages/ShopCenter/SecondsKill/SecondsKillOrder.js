import React, { Component } from 'react';
import { NavBar, NoticeBar, Modal, Toast } from 'antd-mobile';
import { Card, Icon, Tag } from 'antd';
import { router } from 'umi';
import MatrixListView from '@/components/MatrixMobile/MatrixListView';
import { cancelOrder, orderSelectPage, removeOrder } from '@/services/shoppingMall';
import Text from 'antd/lib/typography/Text';
import Func from '@/utils/Func';
import style from '@/pages/ShopCenter/ShopCenter.less';
import { CommodityStyle } from '@/pages/ShopCenter/component/ComponentStyle';

const {alert} = Modal
class SecondsKillOrder extends Component {
  componentDidMount() {
    this.timer = setInterval(()=>{
      this.setState({
        aa:Math.floor(Math.random() * 200)
      })
    },1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  onClick = (res, name) => {
    if (name === 'PlaceTheOrder') {
      router.push(`/shopcenter/secondskill/submitorder/${res.id}`);
    }
    if (name === 'DeleteTheOrder')this.orderOperation('确定删除该秒杀订单？',removeOrder,res)
    if (name === 'CancelTheOrder')this.orderOperation('确定取消该秒杀订单？',cancelOrder,res)
  };

  // 取消订单、删除订单
  orderOperation = (title,path,res) => {
    alert(title,'',[
      {text:'取消'},
      {
        text: '确定', onPress: () =>
          new Promise(resolve => {
            path({ id: res.id }).then(item => {
              if (item.success) {
                Toast.success(item.msg)
                resolve('')
                if (this.child) this.child.onRefresh();
              }
            });
          })
      },
    ])
  }

  describe = () => {
    const mes = <div style={{textIndent:'2rem',textAlign: 'left'}}>为规范活动秩序，保证活动有效性，防止浪费秒杀名额的现象发生，需活动参与者在秒杀下单之后30分钟内完成合同签约，若超时未签约，系统将自动取消秒杀订单，同时活动参与者会被加入黑名单，加入秒杀黑名单后，无法再参与秒杀活动。</div>
    alert('温馨提示',mes,[{text:'我知道了'}])
  }

  onRef = ref =>{
    this.child = ref
  }

  render() {
    // activityType 秒杀传1，竞价传2
    const params={activityType:1,userActivityStatus:0}
    const row = (rowData, sectionID, rowID) => {
      const {spikeActivityDTO:{factoryName,materialName,materialImg,materialPrice,materialModel,endTime},spikeStatus,spikeMaterial} = rowData
      const title = <Text strong>{factoryName}</Text>
      const comlist = {
        title:materialName,
        image:materialImg,
        content:[
          { label:'型号',value:materialModel, },
          { label:'商品数量',value:`${spikeMaterial}吨`, },
          { value:<Text type="danger" strong>{materialPrice}元/吨</Text> },
        ]
      }
      const color = '#1890ff'
      // spikeStatus:签约状态 0:已取消；1：未签约；2：已签约
      const extraStatus = ['已取消',<Tag color="orange" className={style.extraStyle}><Tag color="#fa8c16">待签约</Tag> {Func.countdown(endTime)}</Tag>,<a color={color}>已签约</a>]
      let actions = [
        <a style={{color}} onClick={()=>this.onClick(rowData,'CancelTheOrder')}>取消订单</a>,
        <a style={{color}} onClick={()=>this.onClick(rowData,'PlaceTheOrder')}>合同签约</a>,
      ]
      if (spikeStatus === 0 || spikeStatus === 2){
        actions = [<a style={{color}} onClick={()=>this.onClick(rowData,'DeleteTheOrder')}>删除订单</a>]
      }
      return (
        <Card key={rowID} size="small" bordered={false} title={title} actions={actions} extra={extraStatus[spikeStatus]}>
          <CommodityStyle comlist={comlist} />
        </Card>
      );
    };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={()=>router.push(`/shopcenter/secondskill`)}
          // rightContent={[<Icon type="question-circle" onClick={this.describe} />]}
        >秒杀订单
        </NavBar>
        <div className='am-list'>
          <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} mode="closable">
            温馨提示：秒杀成功的活动请在3天之内完成秒杀合同签约，超时将扣收保证金。
          </NoticeBar>
          <MatrixListView interfaceUrl={orderSelectPage} param={params} onRef={this.onRef} row={row} pageSize={10} round />
        </div>
      </div>
    );
  }
}

export default SecondsKillOrder;
