import React, { Component } from 'react';
import { Card, Icon, Tag } from 'antd';
import { router } from 'umi';
import { NavBar, Toast } from 'antd-mobile';
import MatrixListView from '@/components/MatrixMobile/MatrixListView';
import { querySeckillPage } from '@/services/shoppingMall';
import Text from 'antd/lib/typography/Text';
import Func from '@/utils/Func';
import { CommodityStyle } from '@/pages/ShopCenter/component/ComponentStyle';
import style from '@/pages/ShopCenter/ShopCenter.less';
import { connect } from 'dva';

@connect(({shoppingmall,loading})=>({
  shoppingmall,
  loading:loading.models.shoppingmall
}))
class SecondsKill extends Component {

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

  render() {
    const params={activityType:1,activityStatus:0}
    const row = (rowData, sectionID, rowID) => {
      const {activityStatus} = rowData
      const startTime = <div>距离活动开始剩余：<Text type="danger">{Func.countdown(rowData.startTime)}</Text></div>;
      const endTime = <div>距离活动结束剩余：<Text type="danger">{Func.countdown(rowData.endTime)}</Text></div>;
      const title = <Text strong>{rowData.activityTitle}</Text>
      // 活动状态：0-草稿、1-审核中、2-已驳回、3-审核通过、4-已取消、5-待开始、6-进行中 7-已结束
      const comlist = {
        title:rowData.materialName,
        image:rowData.materialImg,
        tag: <Tag color={activityStatus === 6 ?'green':activityStatus === 5 ?'orange':'red'}>{rowData.activityStatusName}</Tag> ,
        content:[
          { label:'所属机构',value:rowData.factoryName, },
          { label:'型号',value:rowData.materialModel, },
          { label:'商品数量',value:rowData.materialTotal, },
          { label:'物资秒杀单价',value:`${rowData.materialPrice}元`,className:style.amount },
        ]
      }
      return (
        <Card key={rowID} size="small" bordered={false} title={title} actions={[activityStatus === 5?startTime:endTime]} onClick={()=>router.push(`/shopcenter/secondskill/view/${rowData.id}`)}>
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
          rightContent={[<Icon type="profile" theme="twoTone" onClick={()=>router.push('/shopcenter/secondskill/order')} />]}
        >秒杀专区
        </NavBar>
        <div className='am-list'>
          <MatrixListView
            param={params}
            interfaceUrl={querySeckillPage}
            row={row}
            pageSize={10}
            renderHeader={(e)=><Text strong>秒杀活动（{e}）</Text>}
            round
          />
        </div>
      </div>
    );
  }
}

export default SecondsKill;
