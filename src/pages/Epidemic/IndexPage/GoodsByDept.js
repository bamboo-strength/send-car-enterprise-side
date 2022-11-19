import React, { PureComponent } from 'react';
import { List, NavBar } from 'antd-mobile';
import { Button, Card, Col, Icon, Row } from 'antd';
import { router } from 'umi';
import {deptVarietyQueuingQuery} from '../../../services/epidemic'


class GoodsByDept extends PureComponent {

  constructor() {
    super();
    this.state = {
      linelist: []
    }
  }

  componentDidMount() {
    const {location} = this.props
    console.log(location,'====')
    if(location && location.state){
      const {detail} = location.state
      deptVarietyQueuingQuery({plantAreaId:detail.plantAreaId}).then(resp=>{
        this.setState({
          linelist:resp.data
        })
      })
    }
  }

  showMap=(item)=>{
    console.log(item,'===')
    const {location} = this.props
    router.push({
      pathname:'/epidemic/indexpage/showQueueMap',
      state:{
        deptId:location.state.detail.plantAreaId,
        GoodsId:location.state.varietyOfCoalId,
        queueInfos:item
      }
    })
  }

  render() {
    const bg = {background: 'linear-gradient(45deg, #4bc1ff, #538cff)',border: 'none',color: 'white',height:48,borderRadius:50}
    const aSTy = { fontSize:18, fontWeight:'bold'}
    const {linelist} = this.state
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {router.push(`/dashboard/menu`);}}
        >厂区排队情况
        </NavBar>
        <div className='am-list' style={{background:'white'}}>
        {/*  <Row style={{padding:15,margin:0}} gutter={16}>
            <Col span={12}><Button block style={{...bg}} onClick={()=>router.push('/epidemic/arefund')}>申请退款</Button></Col>
            <Col span={12}><Button block style={{...bg}} onClick={()=>router.push('/epidemic/epidemicAdd')}>防疫申报</Button></Col>
          </Row> */}
          <div style={{padding:15}}>
            {
              linelist.length > 0?
              linelist.map(item=>(
                <Card
                  title={item.title}
                  bordered={false}
                  style={{ marginBottom: 15,boxShadow: '#ddd 0px 0px 5px 0px',borderRadius: 5 }}
                  // onClick={()=>this.showMap(item)}
                >
                  <List.Item className='list-item'>{item.coalName}</List.Item>
                  <List.Item extra={<div>预计等待<a style={aSTy}>{item.waitingTimeAll}</a>分钟</div>} className='list-item'>排队<a style={aSTy}>{item.inQueueCount||0}</a>辆</List.Item>
                </Card>
              )):'暂无数据'
            }
          </div>
        </div>
      </div>
    );
  }
}


export default GoodsByDept;
