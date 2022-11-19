import React from 'react';
import { connect } from 'dva';
import { Flex, List, Modal, Toast } from 'antd-mobile';
import { Card } from 'antd';
import router from 'umi/router';
import Text from 'antd/lib/typography/Text';
import IconQrcode from '../../../public/image/qrcode.png';
import style from './IndexDataList.less';

const { Item } = List;
const {alert} = Modal;
@connect(({ merDriver }) => ({
  merDriver,
}))
class DispatchForShashi extends React.Component {

  state = {

  };

  // 跳转到详情
  toDetail = (singleUrl, id) => {
    router.push({
      pathname: `${singleUrl}${id}`,
      state: {
        backUrl: '/dashboard/menu',
      },
    });
  }

  seeMore = (url) => {
    router.push(
      {
        pathname: url,
        state: {
          backUrl: '/dashboard/menu',
        },
      },
    );
  }

  qupaizhao = (item) => {
    router.push({
      pathname: '/dashboard/Photograph',
      query: {
        car: item.vehicleno,
        id: item.id,
        materialsName:item.materialsName,
        custName:item.custName
      }
    })
  }

  ypaizhao = (item) => {
    const alertInstance = alert('异常拍照使用条件', (
      <div>
        <p>(1)提示不在围栏内或没有找到合同围栏信息可使用异常拍照;</p>
        <p>(2)手机离车辆过远可使用异常拍照,前提需要手机GPS定位功能打开;</p>
        <p>(3)GPS定位失败可使用异常拍照,随后联系工作人员进行设备检查;</p>
      </div>
    ),
      [
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确定', onPress: () => router.push({ pathname: '/dashboard/yphotography', query: { car: item.vehicleno, id: item.id } }) },
      ]);
    setTimeout(() => {
      console.log('auto close');
      alertInstance.close();
    }, 500000);
  }

  showQcodeFromPra = (item) => {
    const { showQcode } = this.props
    if(item.carflag=== 6 ){
      Toast.info('业务已完成，不允许扫码')
    }else if(typeof showQcode === 'function'){
        showQcode(item)
    }
  }

  shebeizijian = (item) => {
    router.push({
      pathname:'/dashboard/shebeizijian',
      query:{
        truckno:item.vehicleno,
      }
    })
  }

  chakantupian = (item) => {
    const list = {
      truckno: item.vehicleno,
      fhdh: item.id,
      pictype: '0',
    }
    router.push({
      pathname: '/dashboard/chakantupian',
      query: {
        list
      }
    })
  }

  render() {
    const { businessSetting, getBusinessList, } = this.props

    const onGoing = getBusinessList.filter(item => item.carflag >= 1 && item.carflag <6)
    const notStart = getBusinessList.filter(item => item.carflag === 0)
    // const finished = getBusinessList.filter(item => item.carflag === 6) // 出門崗
    const showData = [
      {title:'正在进行',listData:onGoing,ifLx:false},
      {title:'未开始',listData:notStart,ifLx:false},
      // {title:'已完成',listData:finished,ifLx:true}
    ]
    return (
      <div>
        <List
          renderHeader={
            <div style={{ display: 'flex', justifyContent: 'space-between', }}><span style={{ fontWeight: 'bold', fontSize: '16px' }}>{businessSetting.name}</span>
              <a onClick={() => this.seeMore(businessSetting.totalUrl)}>更多</a>
            </div>}
          className={`my-list ${style.myList}`}
          id='dispatchForShashi'
        >
          {
            showData.map(singlData=>{
              return (
                <div>
                  <div className='separation'>{singlData.title}（{singlData.listData.length}）</div>
                  {
                    singlData.listData.map(item => {
                      let subGoods=''
                      item.sublist.forEach((elem) => {
                        subGoods =elem.materialName
                      });
                        return (
                          <Item
                            multipleLine
                            className='IconQrcode'
                            platform="android"
                          >
                            {
                              <Card title={<p style={{ color: 'red' }}>{item.vehicleno}</p>} extra={<p>{item.deptName}</p>}>

                                <Flex>
                                  {businessSetting.isShowQrcode === 1 ?
                                    <div className='qrcodeBox' onClick={() => this.showQcodeFromPra(item,)}>
                                      <div className='IconQrcodeBox'><img src={IconQrcode} alt='' />
                                      </div><Text>查看二维码</Text>
                                    </div> : undefined}
                                  <div style={{ fontSize: '13px', fontWeight: '600' }} onClick={() => { this.toDetail(businessSetting.singleUrl, item.id) }}>
                                    {/* <p>派车单号：{item.id}</p> */}
                                    <p>客户：{item.custName}</p>
                                    <p>物资：{item.ztext2?item.ztext2:subGoods}</p>
                                    <p>录入时间：{item.createTime}</p>
                                    <p>车辆状态：{item.carFlagName}</p>
                                  </div>
                                </Flex>
                                {
                                  singlData.ifLx &&
                                  <div style={{ display: 'flex', marginTop: '10px' }}>
                                    <div style={{ marginLeft: '5px', color: '#869af1' }} onClick={() => this.qupaizhao(item)}>到货拍照确认</div>
                                    <div style={{ marginLeft: '10px', height: '20px', width: '0.5px', background: 'black' }} />
                                    <div style={{ marginLeft: '10px', color: '#869af1' }} onClick={() => this.ypaizhao(item)}>异常拍照</div>
                                    <div style={{ marginLeft: '10px', height: '20px', width: '0.5px', background: 'black' }} />
                                    <div style={{ marginLeft: '10px', color: '#869af1' }} onClick={() => this.chakantupian(item)}>查看图片</div>
                                    <div style={{ marginLeft: '10px', height: '20px', width: '0.5px', background: 'black' }} />
                                    <div style={{ marginLeft: '10px', color: '#869af1' }} onClick={() => this.shebeizijian(item)}>设备自检</div>
                                  </div>
                                }

                              </Card>
                            }
                          </Item>

                        );
                      }
                    )}
                </div>
              )
            })
          }
        </List>
      </div>
    );
  }
}

export default DispatchForShashi;


