import React, { Component } from 'react';
import MatrixTabsListView from '@/components/MatrixMobile/MatrixTabsListView';
import { Button, Card, Col, Form, Icon, Tag } from 'antd';
import { router } from 'umi';
import { Modal, NavBar } from 'antd-mobile';
import { querySeckillPage } from '@/services/shoppingMall';
import Text from 'antd/lib/typography/Text';
import Func from '@/utils/Func';
import style from '@/pages/ShopCenter/ShopCenter.less';
import { CommodityStyle } from '@/pages/ShopCenter/component/ComponentStyle';
import MatrixInput from '@/components/Matrix/MatrixInput';
import MatrixSelect from '@/components/Matrix/MatrixSelect';
import MatrixDate from '@/components/Matrix/MatrixDate';
import { getCurrentUser } from '../../../utils/authority';

@Form.create()
class ForTheZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      tabKey:'0',
      param:{activityType:2,activityStatus:0,}
    };
  }


  componentDidMount() {
    console.log(getCurrentUser(),989797)
    this.timer = setInterval(()=>{
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        aa:Math.floor(Math.random() * 200)
      })
    },1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  changeTab = (tab) => {
    this.setState({
      tabKey: tab,
    });
  };

  onRef = ref =>{
    this.child = ref
  }

  getData=(type)=>{
    const {form} = this.props
    const {tabKey} = this.state
    const formValues = form.getFieldsValue()
    const p = type === 'reset' ? {} : formValues
    const param = {
      activityType:2,
      activityStatus:tabKey,
      ...p,
      startTime:Func.formatFromStr(formValues.startTime,'YYYY-MM-DD HH:mm:ss'),
      endTime:Func.formatFromStr(formValues.endTime,'YYYY-MM-DD HH:mm:ss'),
    }
    this.setState({
      param
    })
    if (this.child) { this.child.onChoose(param,'refresh') }
    this.setState({
      visible:false
    })
  }


  render() {
    const {visible,param}=this.state;
    // activityStatus 0，全部，1，待开始，2进行中
    // const params ={activityType:2,activityStatus:tabKey}
    const { form } = this.props;
    const tabs = [{ title: '全部', key: '0' }, { title: '待开始', key: '1' }, { title: '进行中', key: '2' }];
    const row = (rowData, sectionID, rowID) => {
      const {activityStatus} = rowData
      const startTime = <div>距离活动开始剩余：<Text type="danger">{Func.countdown(rowData.startTime)}</Text></div>;
      const endTime = <div>距离活动结束剩余：<Text type="danger">{Func.countdown(rowData.endTime)}</Text></div>;
      const title = <Text strong>{rowData.activityTitle}</Text>

      // 活动状态：0-草稿、1-审核中、2-已驳回、3-审核通过、4-已取消、5-待开始、6-进行中 7-已结束
      const comlist = {
        title:<>{rowData.materialName}<span style={{float:'right',fontWeight:'300',}}>{activityStatus === 5 ? <text>已有<span style={{fontWeight:'500'}}>{rowData.deptCount}</span>家预约 </text>:<text>已有<span style={{fontWeight:'500'}}>{rowData.deptBiddingCount}</span>家报价 </text>}</span></>,
        image:rowData.materialImg,
        tag: <Tag color={activityStatus === 6 ?'green':activityStatus === 5 ?'orange':activityStatus === 7||activityStatus === 8?'red':'blue'}>{activityStatus === 6 ?'进行中':activityStatus === 5 ?'待开始':activityStatus === 7||activityStatus === 8?'已结束':''}</Tag> ,
        content:[
          { label:'所属机构',value:rowData.factoryName, },
          { label:'型号',value:rowData.materialModel, },
          { label:'商品数量',value:rowData.materialTotal, },
          { value:`${rowData.biddingStartPrice}元/吨起`,className:style.amount },
        ]
      }
      let extralist = [
        {code:'0',color:'gold',text:'公开竞价'},
        {code:'2',color:'blue',text:`报价${rowData.myBiddingCount}次`},
        {code:'1',color:'purple',text:'封闭竞价'},
      ]
      // 预约状态
      let appointment=[
        {code:'0',color:'orange',text:"未预约"},
        {code:'1',color:'green',text:"已预约"}
      ]
      const aa = rowData.biddingWay   // 竞价状态
      const bb = rowData.isSubscribe  // 预约状态
      if (aa === 0) extralist = extralist.filter(item=>item.code === '0')
      if (aa === 1) extralist = extralist.filter(item=>item.code === '1')
      if (aa === -1) extralist = extralist.filter(item=>item.code === '')
      // if (aa === 2) extralist = extralist.filter(item=>item.code === '1' || item.code === '2')
      if (bb === 0) appointment = appointment.filter(item=>item.code === '0')
      if (bb === 1) appointment = appointment.filter(item=>item.code === '1')
      if (bb === -1) appointment = appointment.filter(item=>item.code === '')
      const extra =
        <>
          {extralist.map(item =>
            <>
              <Tag color={item.color}>{item.text}</Tag>
            </>,
          )}
          {
            activityStatus === 5 ?
            appointment.map(item =>
              <>
                <Tag color={item.color}>{item.text}</Tag>
              </>,
            ) : ''
          }
        </>
      return (
        <Card key={rowID} size="small" bordered={false} title={title} extra={extra} actions={[activityStatus === 5?startTime:endTime]} onClick={()=>router.push(`/shopcenter/forthezone/view/${rowData.id}`)}>
          <CommodityStyle comlist={comlist} />
        </Card>
      );
    };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={()=>router.push(`/shopcenter/mallhomepage/list`)}
          rightContent={[
            <>
              <Icon type="search" onClick={()=>this.setState({visible:true})} />&nbsp;&nbsp;&nbsp;&nbsp;
              <span onClick={()=>router.push('/shopcenter/forthezone/forthezoneBidding')}>我参与的</span>
            </>
          ]}
        >竞价专区
        </NavBar>
        <div className='am-list'>
          <MatrixTabsListView
            tabs={tabs}
            onRef={this.onRef}
            interfaceUrl={querySeckillPage}
            param={{activityType:2,activityStatus:0,}}
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

export default ForTheZone;
