import React, { PureComponent } from 'react';
import { List, NavBar } from 'antd-mobile';
import { Button, Card, Col, Icon, Row } from 'antd';
import { router } from 'umi';

class FreightYard extends PureComponent {
  render() {
    const bg = {background: 'linear-gradient(45deg, #4bc1ff, #538cff)',border: 'none',color: 'white',height:48,borderRadius:50}
    const linelist = [
      {title:'煤矸石',lineUp1:'0',lineUp1Hours:'0',lineUp1Minutes:'0',lineUp2:'8',lineUp2Hours:'0',lineUp2Minutes:'0',},
      {title:'煤矸石',lineUp1:'0',lineUp1Hours:'0',lineUp1Minutes:'0',lineUp2:'8',lineUp2Hours:'0',lineUp2Minutes:'40',},
      {title:'煤矸石',lineUp1:'0',lineUp1Hours:'0',lineUp1Minutes:'0',lineUp2:'8',lineUp2Hours:'0',lineUp2Minutes:'0',},
    ]
    const aSTy = { fontSize:18, fontWeight:'bold'}
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {router.push(`/epidemic/queuemanagement`);}}
        >选择货场
        </NavBar>
        <div className='am-list' style={{background:'white'}}>
          <Row style={{padding:15,margin:0}} gutter={16}>
            <Col span={12}><Button block style={{...bg}} onClick={()=>router.push('/epidemic/arefund')}>申请退款</Button></Col>
            <Col span={12}><Button block style={{...bg}} onClick={()=>router.push('/epidemic/epidemicAdd')}>防疫申报</Button></Col>
          </Row>
          <div style={{padding:15}}>
            {
              linelist.map(item=>(
                <Card title={item.title} bordered={false} style={{ marginBottom: 15,boxShadow: '#ddd 0px 0px 5px 0px',borderRadius: 5 }}>
                  <List.Item extra={<div>预计<a style={aSTy}>{item.lineUp1Hours}</a>小时<a style={aSTy}>{item.lineUp1Minutes}</a>分</div>} className='list-item'>计划排队<a style={aSTy}>{item.lineUp1}</a>辆</List.Item>
                  <List.Item extra={<div>预计<a style={aSTy}>{item.lineUp2Hours}</a>小时<a style={aSTy}>{item.lineUp2Minutes}</a>分</div>} className='list-item'>普通排队<a style={aSTy}>{item.lineUp2}</a>辆</List.Item>
                </Card>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}


export default FreightYard;
