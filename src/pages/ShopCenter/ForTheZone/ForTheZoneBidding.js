import React, { Component } from 'react';
import MatrixTabsListView from '@/components/MatrixMobile/MatrixTabsListView';
import { Button, Card, Col, Form, Icon, Tag } from 'antd';
import { router } from 'umi';
import { Modal, NavBar } from 'antd-mobile';
import { orderSelectPage } from '@/services/shoppingMall';
import Text from 'antd/lib/typography/Text';
import Func from '@/utils/Func';
import style from '@/pages/ShopCenter/ShopCenter.less';
import { CommodityStyle } from '@/pages/ShopCenter/component/ComponentStyle';
import MatrixInput from '@/components/Matrix/MatrixInput';
import MatrixDate from '@/components/Matrix/MatrixDate';
import MatrixSelect from '@/components/Matrix/MatrixSelect';

@Form.create()
class ForTheZoneBidding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      theTabKey: '0',
      param:{activityType:2,userActivityStatus:0,}
    };
  }

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

  changeTab = (tab) => {
    this.setState({
      theTabKey: tab,
      // params:{activityType:2,userActivityStatus:tab}
    });
  };

  onClick = (res, name) => {
    if (name === 'PlaceTheOrder') {
      router.push(`/shopcenter/forthezone/submitorder/${res.id}`);
    }
  };

  onRef = ref =>{
    this.child = ref
  }

  getData=(type)=>{
    const {form} = this.props
    const {theTabKey} = this.state
    const formValues = form.getFieldsValue()
    if(type === 'reset'){
      form.resetFields();
      delete formValues.activityTitle
      delete formValues.materialName
      delete formValues.factoryId
      delete formValues.startTime
      delete formValues.endTime
    }
    const param = {
      activityType:2,
      userActivityStatus:theTabKey,
      ...formValues,
      startTime:Func.formatFromStr(formValues.startTime,'YYYY-MM-DD HH:mm:ss'),
      endTime:Func.formatFromStr(formValues.endTime,'YYYY-MM-DD HH:mm:ss'),
    }
    this.setState({
      param
    })
    delete formValues.activityTitle
    delete formValues.materialName
    delete formValues.deptName
    delete formValues.startTime
    delete formValues.endTime
    if (this.child) { this.child.onChoose(param,'refresh') }
    this.setState({
      visible:false
    })
  }


  render() {
    const {visible,theTabKey,loading,param,}=this.state;
    const { form } = this.props;
    // activityType 秒杀传1，竞价传2
    // userActivityStatus 0，全部，1，待开始，2进行中 3，已结束
    const tabs = [{ title: '全部', key: '0' }, { title: '我预约的', key: '1' }, { title: '我参与的', key: '2' },{ title: '已结束', key: '3' }];
    const row = (rowData, sectionID, rowID) => {
      const theData = rowData.spikeActivityDTO
      // console.log(theData,999999)
      const startTime = <div style={{fontSize:'10px',paddingLeft:'10px'}}>距离活动开始剩余：<Text type="danger">{Func.countdown(theData.startTime)}</Text></div>;
      const endTime = <div style={{fontSize:'10px',paddingLeft:'10px'}}>距离活动结束仅剩:<Text type="danger">{Func.countdown(theData.endTime)}</Text></div>;
      const toSigned=<div style={{fontSize:'10px',paddingLeft:'10px'}}>待签约:<Text type="danger">{Func.countdown(rowData.spikeOrderEndTime)}</Text></div>;
      const title = <strong>{theData.activityTitle}</strong>
      // 活动状态：0-草稿、1-审核中、2-已驳回、3-审核通过、4-已取消、5-待开始、6-进行中 7-已结束
      const comlist = {
        title:<>{theData.materialName}<span style={{float:'right',fontWeight:'300',}}>{theData.activityStatus === 5 ?<text>共有<span style={{fontWeight:'500'}}>{theData.deptCount}</span>家预约 </text>: <text>已有<span style={{fontWeight:'500'}}>{theData.deptBiddingCount}</span>家报价 </text>}</span></>,
        image:theData.materialImg,
        tag: <Tag color={theData.activityStatus === 6 ?'green':theData.activityStatus === 5 ?'orange':theData.activityStatus === 7||theData.activityStatus === 8?'red':'blue'}>{theData.activityStatus === 6 ?'进行中':theData.activityStatus === 5 ?'待开始':theData.activityStatus === 8?'已结束':''}</Tag> ,
        infor:theData.activityStatus === 8 && rowData.isSucceed === 1 ? <div style={{backgroundColor:'#FF4500',}}>已中拍</div> :theData.activityStatus === 8 && rowData.isSucceed === 2 ? '未中拍' :
          theData.activityStatus === 8 && rowData.spikeStatus === 2 ? '已签约' :theData.activityStatus === 8 && rowData.spikeStatus === 0 ? '交易关闭':
            theData.activityStatus === 7?'已流拍':'',
        content:[
          { label:'所属机构',value:theData.factoryName, },
          { label:'型号',value:theData.materialModel, },
          { label:'商品数量',value:theData.materialTotal, },
          { value:`${theData.biddingStartPrice}元/吨起`,className:style.amount },
        ]
      }
      // 竞价状态
      let extralist = [
        {code:'0',color:'gold',text:'公开竞价'},
        theData.deptBiddingCount >=0 ?
        {code:'2',color:'blue',text:`报价${JSON.stringify(theData.myBiddingCount)}次`} : '',
        {code:'1',color:'purple',text:'封闭竞价'},
      ]
      // 竞价次数

      // 预约状态
      let appointment=[
        {code:'0',color:'orange',text:"未预约"},
        {code:'1',color:'green',text:"已预约"}

      ]

      const aa = theData.biddingWay
      const bb = theData.isSubscribe
      if (aa === 0 ) extralist = extralist.filter(item=>item.code === '0' || item.code === '2')
      if (aa === 1) extralist = extralist.filter(item=>item.code === '1' || item.code === '2')
      if (aa === -1) extralist = extralist.filter(item=>item.code === '')
      if (bb === 0) appointment = appointment.filter(item=>item.code === '0')
      if (bb === 1) appointment = appointment.filter(item=>item.code === '1')
      if (bb === -1) appointment = appointment.filter(item=>item.code === '')
      // if (aa === 2) extralist = extralist.filter(item=>item.code === '1' || item.code === '2')
      // if (aa === 3) extralist = extralist.filter(item=>item.code === '2' || item.code === '3')
      const extra =
        <>
          {extralist.map(item =>
            <>
              <Tag color={item.color}>{item.text}</Tag>
            </>,
          )}
          {
            theData.activityStatus === 5 ?
            appointment.map(item =>
              <>
                <Tag color={item.color}>{item.text}</Tag>
              </>,
              ) : ''
          }
        </>
      const actions =  ([
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          { // 待开始
          theData.activityStatus === 5 ? startTime : ''
        }
          { // 进行中
          theData.activityStatus === 6 ? endTime :''
        }
          {  // 已结束-已中拍
          theData.biddingMaterialType===0&&theData.activityStatus === 8 && rowData.isSucceed === 1 && rowData.spikeStatus === 1 ? <>{toSigned}<div style={{paddingRight:'10px'}}><Button onClick={()=>this.onClick(rowData,'PlaceTheOrder')} shape="round" size='small' type="primary">合同签约</Button></div></>
            : ''
        }
          {
          // 已结束-未中拍
          theData.activityStatus === 8 && rowData.isSucceed === 2 ? <text style={{fontSize:'10px',paddingLeft:'10px'}}>活动结束时间:{rowData.spikeActivityDTO.endTime}</text>
            : ''
        }
          {
          // 已结束-交易关闭
            theData.biddingMaterialType===0&&  theData.activityStatus === 8 && rowData.isSucceed === 1 && rowData.spikeStatus === 0 ?  <><text style={{color:'red',fontSize:'10px',paddingLeft:'10px'}}>超时未签约，交易关闭</text><text style={{fontSize:'10px',paddingRight:'10px'}}>交易关闭时间:{rowData.spikeOrderEndTime}</text></>
            : ''
        }
          {
          // 已结束-已签约
            theData.biddingMaterialType===0&&theData.activityStatus === 8 && rowData.spikeStatus === 2 ?  <div>&nbsp;&nbsp;签约时间：{theData.publishTime}<Button style={{width:'100px',marginLeft:'20px'}} onClick={()=>router.push('/shopcenter/contract')} shape="round" type="primary">查看合同</Button></div>
            : ''
        }
        </div>
      ]);

      return (
        <Card key={rowID} size="small" bordered={false} title={title} extra={extra} actions={actions}>
          <div onClick={()=>router.push({pathname:`/shopcenter/forthezone/forthezonebid/view/${rowData.spikeActivityId}/${rowData.spikeStatus}/${rowData.isSucceed}`,state:rowData.id},)}>
            <CommodityStyle comlist={comlist} />
          </div>
        </Card>
      );
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={()=>router.push(`/shopcenter/forthezone`)}
          rightContent={[<Icon type="search" onClick={()=>this.setState({visible:true})} />]}
        >我参与的
        </NavBar>
        <div className='am-list'>
          <MatrixTabsListView
            tabs={tabs}
            loading={loading}
            theTabKey={theTabKey}
            onRef={this.onRef}
            param={{activityType:2,userActivityStatus:0,}}
            interfaceUrl={orderSelectPage}
            row={row}
            tabKeyName="transactionType"
            noTabKey
            changeTab={this.changeTab}
            round
            form={form}
          />
        </div>
        <Modal
          visible={visible}
          transparent
          maskClosable
          onClose={()=>this.setState({visible:false})}
          popup
          animationType='slide-down'
          platform='android'
        >
          <Col span={24} className='add-config'>
            <MatrixInput id='activityTitle' maxLength='15' label='活动名称' placeholder='请输入活动名称' form={form} />
          </Col>
          <Col span={24} className='add-config'>
            <MatrixInput id='materialName' maxLength='15' label='商品名称' placeholder='请输入竞价商品名称' form={form} />
          </Col>
          <Col span={24} className='add-config'>
            <MatrixSelect label="所属机构" placeholder="请选择所属机构" id="factoryId" keyParam='id' valueParam='deptName' dictCode="/api/mer-shop/factory/list" form={form} style={{width: '100%',}} />
          </Col>
          <Col span={24} className='add-config'>
            <MatrixDate label='活动开始时间' format='YYYY-MM-DD HH:mm:ss' id='startTime' form={form} />
          </Col>
          <Col span={24} className='add-config'>
            <MatrixDate label='活动结束时间' format='YYYY-MM-DD HH:mm:ss' id='endTime' form={form} />
          </Col>
          <div style={{marginTop:'8px',float:'right'}}>
            <Button type="primary" inline onClick={() =>this.getData()} style={{marginLeft:'8px'}}>查询</Button>
            <Button type="primary" inline onClick={() =>this.getData('reset')} style={{marginLeft:'15px'}}>重置</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ForTheZoneBidding;
