import React, { PureComponent } from 'react';
import { Card, Col, Form, Icon, Row } from 'antd';
import router from 'umi/router';
import { NavBar } from 'antd-mobile';
import { detail } from '@/services/VehicleCarMatching/WayBillServices';
import Text from 'antd/es/typography/Text';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import NetWorkList from '@/components/NetWorks/NetWorkList';
import NetWorkRate from '@/components/NetWorks/NetWorkRate';
import IconNoPictures from '../../../../public/Network/icon_NoPictures.png';
import func from '@/utils/Func';
import Image from '@/pages/ShopCenter/component/Image';

@Form.create()
export class WaybillView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detailData: {},
    };
  }

  componentWillMount() {
    const { match: { params: { id } } } = this.props;
    detail({ id }).then(resp => {
      this.setState({
        detailData: resp.data,
      });
    });
  }
  goReturn = ()=>{
    const {location} = this.props
    router.push(`/vehicleCarMatching/waybillmanagement`);
    localStorage.setItem('load',location.state.initialPage)
  }

  render() {
    const { detailData } = this.state;
    const freightPictureList = detailData.freightPictureList;
    const {form} = this.props;
    const shipperData = [
      <Row><Col span={5}>货主</Col><Col span={19}>{detailData.consignorName}</Col></Row>,
      <Row><Col span={5}>派单时间</Col><Col span={19}>{detailData.createTime}</Col></Row>,
    ];
    const contactData = [
      <Row><Col span={5}>联系人</Col><Col span={19}>{detailData.createUserName}</Col></Row>,
    ];
    const suppliesData = [
      <Row><Col span={5}>物资</Col><Col span={19}>{detailData.materialName}</Col></Row>,
      // <Row><Col span={5}>承运量</Col><Col span={19}>{detailData.carryAmountName}</Col></Row>,
      <Row><Col span={5}>装载量</Col><Col span={19}>{detailData.loadAmountName}</Col></Row>,
      <Row><Col span={5}>签收量</Col><Col span={19}>{detailData.signAmountName}</Col></Row>,
    ];
    const timeData = [
      // <Row><Col span={5}>接单时间</Col><Col span={19}>{detailData.takeorderTime}</Col></Row>,
      <Row><Col span={5}>装货时间</Col><Col span={19}>{detailData.loadingTime}</Col></Row>,
      <Row><Col span={5}>签收时间</Col><Col span={19}>{detailData.signTime}</Col></Row>,
    ];
    const driverData = [
      <Row><Col span={5}>司机姓名</Col><Col span={19}>{detailData.driverName}</Col></Row>,
      <Row><Col span={5}>车号</Col><Col span={19}>{detailData.vehicleno}</Col></Row>,
    ];
    const operationData = [
      <Row><Col span={5}>装运说明</Col><Col span={19}>{detailData.waybillNote}</Col></Row>,
    ];
    const imageDatas = func.notEmpty(freightPictureList) ? (
      freightPictureList.map((item, index) => {
          return <Row style={{flexDirection:'column',padding:10}}>
            <Col span={24}>
              {
                item.picturePath&&item.fileName=='file2'?
                  // <img src={item.picturePath} style={{ width: '100%', height: '100px', objectFit: 'cover', }}/>
                  <Image className='commodityImage' style={{ width: '100%', height: '100px'}} imageUrl={item.picturePath} onClick />
                  :
                  (
                    <div style={{ width: '100%', height: '100px',display:'flex',justifyContent: 'center',alignItems: 'center' }}>
                      <img src={IconNoPictures} style={{height:'80%'}} />
                    </div>
                  )
              }
            </Col>
            <Col span={24} style={{ textAlign: 'center' }}>{'签收单'}</Col>
          </Row>;
      })
    ) : undefined;

    const {scoreTypeName} = detailData
    const evaluation = [<Row style={{display:'flex',flexDirection:'column'}}>
      <Col span={24}>
        <NetWorkRate label='运单结算效率' id='settlementEfficiency' initialValue={scoreTypeName!=undefined?(scoreTypeName.运单结算效率)/2:''} disabled form={form} />
      </Col>
      <Col span={24}>
        <NetWorkRate label='配合度' id='matchDegreeScore' initialValue={scoreTypeName!=undefined?(scoreTypeName.配合度)/2:''} disabled form={form} />
      </Col>
    </Row>]
    return <div id={NetWorkLess.netWork}>
      <NavBar
        mode="light"
        icon={<Icon type="left"/>}
        // onLeftClick={() => router.push('/network/waybill')}
        onLeftClick={this.goReturn}
      >运单详情
      </NavBar>
      <div className='am-list networkDetail'>
        <div className='networkDetailDiv' style={{marginBottom:'7px'}}>
          <Card className='networkDetailCard'>
            <div className='DetailCardDiv'>
              发货地
            </div>
            <Row className='DetailCardRow'>
              <Text strong>{detailData.shipAddressName}</Text><br/>
              <Text>详细地址：{detailData.shipFullAddress}</Text><br/>
              <Text>发货人：{detailData.shipper}</Text><br/>
              <Text>发货人联系方式：{detailData.shipperPhone}</Text>
            </Row>
          </Card>
          <Card className='networkDetailCard'>
            <div className='DetailCardDiv'>
              收货地
            </div>
            <Row className='DetailCardRow'>
              <Text strong>{detailData.receiveAddressName}</Text><br/>
              <Text>详细地址：{detailData.receiveFullAddress}</Text><br/>
              <Text>收货人：{detailData.receiver}</Text><br/>
              <Text>收货人联系方式：{detailData.receiverPhone}</Text>
            </Row>
          </Card>
        </div>
        {/*<NetWorkList></NetWorkList>*/}
        <NetWorkList dataSource={shipperData}></NetWorkList>
        {/*<NetWorkList dataSource={contactData} header='联系人信息'></NetWorkList>*/}
        <NetWorkList dataSource={suppliesData} header='物资信息'></NetWorkList>
        {
          detailData.waybillStatus === 1 || detailData.waybillStatus === 2 || detailData.waybillStatus === 3 || detailData.waybillStatus === 4 || detailData.waybillStatus === 5
          || detailData.waybillStatus === 6 ? <NetWorkList dataSource={timeData}></NetWorkList> : undefined
        }
        <NetWorkList dataSource={driverData} header='司机信息'></NetWorkList>
        <NetWorkList dataSource={operationData}></NetWorkList>
        {
          detailData.waybillStatus === 1 || detailData.waybillStatus === 2 || detailData.waybillStatus === 3 || detailData.waybillStatus === 4 || detailData.waybillStatus === 5
          || detailData.waybillStatus === 6 ?
            <NetWorkList dataSource={imageDatas} header='附件信息' grid={{ xs: 2 }}></NetWorkList> : undefined
        }
        <NetWorkList dataSource={evaluation} header='附件信息'></NetWorkList>
        {/*{
          detailData.waybillStatus === 5?<NetWorkList dataSource={evaluation} header='附件信息' grid={{ xs: 2 }}></NetWorkList>:undefined
        }*/}
      </div>
    </div>;
  }
}

export default WaybillView;
