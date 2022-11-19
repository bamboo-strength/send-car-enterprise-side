import React, { PureComponent } from 'react';
import { Card, Progress, Tag } from 'antd';
import iconPhone from '../../../public/Network/icon_phone.png';
import iconSingle from '../../../public/Network/icon_single.png';
import iconSingleRed from '../../../public/Network/icon_single_red.png';
import network from './NetWork.less';
import CountDown from '@/components/CountDown';

export default class NetWorkListCard extends PureComponent {
  render() {
    const { item, type,actions, onClick, state,onCallPhone } = this.props;
    /* type:0 抢单  1 竞价  2 抢单记录 */
    const st = { width: type === 1 ? '50%' : '25%', display: type === 1 ? 'flex' : 'block' };
    let timestamp = 3900000;
    let timestamp1 = 3900000;
    if(type===1) {
      timestamp = new Date((item.endtime).substring(0,19).replace(/-/g,'/')).getTime()
      timestamp1 = new Date((item.allowCancelTime).substring(0,19).replace(/-/g,'/')).getTime()
    }else {
      timestamp = 3900000;
      timestamp1 = 3900000;
    }
    const stateName = state === 2?'已报价':state === 3?'已中标':state === 4?'未中标':'已取消'
    const circle = <div className='dot' style={{background:state === 2?'#F59A23':state === 3?'#0DDD47':state === 4?'#7F7F7F':'#D9001B'}} />
    const textColor = {color:state === 2?'#F59A23':state === 3?'#0DDD47':state === 4?'#7F7F7F':'#D9001B'}
    const callPhone = <div onClick={onCallPhone}>{item.receiver}</div>
    const extra = type === 0?callPhone:type === 1?state === 1?callPhone:<div style={textColor}>{circle}&nbsp; {stateName}</div>:undefined
    let countdown = <div />
    switch (state) {
      case 1:
        countdown = (
          <div className='divProgress'>
            <div>已有<font color='red' style={{ fontSize: 18, fontWeight: 'bold' }}>{item.biddingTimes}</font>人报价</div>
            {
              item.sourceGoodsStatus===1?
                <div className='count'>竞价已结束</div>
                :
                <div className='count'><CountDown target={timestamp} /> 后停止竞价</div>
            }
          </div>)
        break;
      case 2:
        countdown = <div className='count'><CountDown target={timestamp1} /> 内可取消报价</div>
        break;
      case 3:
        // countdown = <div className='count'><CountDown target={targetTime}></CountDown> 内可取消竞价</div>
        break;
      default:console.log('没找到值！')
    }
    const title = <span>货源编号:{item.id}
      {/* {type === 1 ? undefined:item.splitBill === 0 ? undefined : <Tag color="red">拆单</Tag>} */}
      {type===1?undefined:item.distanceFlag==1?<Tag color="red">超出范围</Tag>:''}
      {item.gpsFlag == '' ? undefined:item.gpsFlag == 0 ? undefined :<Tag color="blue">GPS</Tag>}
    </span>
    return (
      <Card title={title} className={network.netWorkListCard} size='small' extra={extra} actions={actions} onClick={onClick} style={{marginBottom:type === 1?0:'8px'}}>
        <div className='cardDiv'>
          <div className='leftDiv'>
            <div style={{display:'flex'}}>
              <div style={{flex:1}}>
                <div className='leftDivflex'>
                  <div style={{ background: '#0DDD47' }} />{item.shipAddressRegionName}
                </div>
                <div style={{ marginTop: 10 }} className='leftDivflex'>
                  <div style={{ background: '#F59A23' }} />{item.receiveAddressRegionName}
                </div>
              </div>
              {
              type === 1? state === 1?undefined:<div className='phoneBox' onClick={onCallPhone}><img src={iconPhone} alt='' /></div>:undefined
            }
            </div>
            <p className='leftP'>物资名称:{item.materialName}</p>
            {
            type !== 2 ?(
              <div className='leftPrice'>
                <div style={st}>
                  <p>单价:</p>
                  <p><font color='red'>{item.price}</font>元/吨</p>
                </div>
                <div style={{ width:'50%'}}>
                  <p>预计装车时间:</p>
                  <p><font color='red'>{item.predictLoadingTime}</font></p>
                </div>
                <div style={st}>
                  <p>货主评分:</p>
                  <p><font color='red'>{item.custScore}</font></p>
                </div>
              </div>):(
                <div className='leftPrice'>
                  <div style={st}>
                    <p>单价：</p>
                    <p><font color='red'>{item.price}</font>元/吨</p>
                  </div>
                  <div style={st}>
                    <p>抢单数量：</p>
                    <p><font color='red'>{item.remainamount}</font>吨</p>
                  </div>
                  <div style={st}>
                    <p>运费：</p>
                    <p><font color='red'>{item.grabFreight}</font>元</p>
                  </div>
                </div>)
          }
            {
            type === 0 ? item.splitBill === 0 ? undefined : (
              <div className='divProgress'>
                <Progress
                  percent={[(item.grabShipmentamount)/(item.grabShipmentamount+item.grabRemainamount)]*100}
                  format={() => `已抢${item.grabShipmentamount} 车，还剩${item.grabRemainamount}车`}
                />
              </div>) : countdown
          }
          </div>
          <div style={{ display: type === 1?state === 1 ? 'block' : 'none':'block' }} className='divRight'>
            {
              // type===1&&item.sourceGoodsStatus===1?
              //   <div className='rightDivHyaline'>
              //     <img src={type === 2?iconPhone: iconSingle} style={{width:type === 2?'30px':undefined}} alt='' />
              //     <span>{type === 0 ? '抢单' : type === 1 ? '竞价': `${item.shipper }`}</span>
              //   </div>
              //   :
              <div className='rightDiv'>
                <img src={item.distanceFlag==1?iconSingleRed: iconSingle} style={{width:type === 2?'30px':undefined}} alt='' />
                <span style={{ color:item.distanceFlag==1?'red':'#1890FF' ,marginTop:'10px'}}>{type === 0 ? '抢单' : type === 1 ? '竞价': `${item.shipper }`}</span>
              </div>
            }
            {/* <div className='rightDiv'> */}
            {/*  <img  src={type === 2?iconPhone: iconSingle} style={{width:type === 2?'30px':undefined}} alt='' /> */}
            {/*  <span>{type === 0 ? '抢单' : type === 1 ? '竞价': `${item.shipper }`}</span> */}
            {/* </div> */}
          </div>
        </div>
      </Card>);
  }
}
