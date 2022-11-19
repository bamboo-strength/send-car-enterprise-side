import React,{PureComponent} from 'react';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { NavBar} from 'antd-mobile';
import { Icon,Card } from 'antd';
import router from 'umi/router';

class WaybillAgreement extends PureComponent{
  state = {
    rowData:{},
  };
  componentWillMount()
  {
    const { location } = this.props
    this.setState({
      rowData:location.state.data
    })
  }
  render() {
    const {rowData} = this.state;
    console.log('rowData',rowData);
    return (
      <div id={NetWorkLess.netWork}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/network/waybill')}
        >网络货运承运协议
        </NavBar>
        <div className='am-list'>
          <Card>
          <h2 style={{color: '#666',fontWeight: 500,textAlign:'center'}}>托运协议</h2>
          {/*<h4>运单号:{rowData.row}</h4>*/}
          <h4 style={{color: '#666',fontWeight: 500,textAlign:'center'}}>货物信息</h4>
          <h4>装货地:{rowData.receiveAddressName}</h4>
          <h4>卸货地:{rowData.shipAddressName}</h4>
          {/*<h4>装货时间:</h4>*/}
          <h4>品名: {rowData.materialName},单价: {rowData.price}元/吨,重量：吨,总价:{rowData.totalFreight}元</h4>
          <h4>运输联系人/电话:{rowData.driverPhone}</h4>
          <h4>备注:此运价中包含起运地到目的地运输过程中产生的所有费用。</h4>
          <h4 style={{color: '#666',fontWeight: 500,textAlign:'center'}}>承运方信息</h4>
          <h4>车牌号码:{rowData.vehicleno}</h4>
          <h4>司机姓名:{rowData.driverName}</h4>
          {/*<h4>车长/车型:</h4>*/}
          <h4>随车手机:{rowData.driverPhone}</h4>
          <h4>备注:1、身份证，2、驾驶证，3、行驶证，4、从业资格证，5、车辆运营证，6、车辆照片。（复印件完成拍照存档）。</h4>
          <h4>  甲方:山西物迹福达科技有限公司</h4>
          <h4>  乙方:{rowData.driverName}</h4>
          <h4>甲方现有以上物资委托乙方运输，乙方所驾驶车辆证件上的所有人无论是单位还是个人，运输过程中引起的法律纠纷与经济损失由乙方全权承担。双方经友好协商达成如下协议:</h4>
          <h4>一、乙方应按上述指定日期和期限及时到甲方指定装卸地联系办理装卸货事宜，凭如下凭证提取并装运货物:</h4>
          <h4>(1) 承运车辆行驶证; (2)承运驾驶员的身份证; (3)甲方出具的提货凭证。</h4>
          <h4>实际货物的出库数量及质量以乙方或乙方指派人员向仓库方签收的单据为准。乙方应保证所签收的单据信息准确、完整，因乙方签收错误或遗漏等导致的所有责任由乙方自行承担。</h4>
          <h4>二、如乙方在提货时发现无法受理的特殊情况，如单货不符、散捆严重、破损等，乙方应及时向甲方货主提出更换或要求甲方货主出示证明，并通知甲方会同解决,否则视为货物完好。运输途中造成货物损坏，未按规定时间送达客户，灭失，雨淋，交通事故等(不可抗拒因素除外)引起的一切损失由乙方负责赔偿， 如有偷盗行为，视情节轻重乙方自愿接受甲方的罚款，以上金额甲方可以直接从应支付给乙方的运费中扣除，运费不足以支付赔偿金的部分由乙方用个人财产予以补足。赔偿金额为受损产品销售价格、运输费用和偷盗罚款的总和。乙方应自行购买物资运输保险，在履行该协议中出现的任何意外、冲突、事故所造成的一切损失均与甲方无关。</h4>
          <h4>三、乙方承运车辆上的电话不得关机、停机，自愿接受甲方系统对乙方手机进行跟踪管理。如因不可抗力导致手机关机、停机时，必须实时通知甲方，保持联系畅通到运输完成。</h4>
          <h4>四、如乙方、乙方车辆或车辆驾驶员及其他随行人员在履行本协议过程中与任何第三方发生任何冲突，所造成的损失均与甲方无关。</h4>
          <h4>五、到达目的地后，乙方应监督收货方验收人如实的验收货物并在货物运单(回单联) 上签收货物;并保管好有效回单返给甲方指定人员，并在甲方系统指定位置上传回单，因回单丢失引起的所有责任由乙方全权负责。货物出库数量以提货库区出库时乙方签收单据上标明的数量为准，验收数量以到达目的地后收货方验收人在出库单或送货单的回单上的签收数量为准。最终数量、金额以业务系统审核为准。</h4>
          <h4>六、甲方委托乙方运输的费用在乙方将承运货物运到目的地并完好卸货后，由甲方与收货方确认无货损货缺后将乙方运费款汇至乙方指定账号(甲方原则上以现金支付运费，如乙方认可，甲方可以现金+油料的方式进行支付，且油料支付金额不超过本次运输消耗)，汇款手续费由乙方承担。甲方收取乙方回单押金人民币元，该押金在乙方将收货方签收的回单原件交由甲方后退还给乙方。</h4>
          <h4>七、本协议自甲、乙双方签署之日起生效，乙方在甲方平台承运合同有效期为一年，甲方可以根据相关政策要求使用乙方相关资料信息申请发票，乙方同意知晓。</h4>
          <h4>八、因本协议发生争议，各方应尽量协商解决，如协商不成，可将争议提交至甲方所在地有管辖权的人民法院诉讼解决。</h4>
          <h4>九、本协议一式贰份，甲、乙双方各执一份，具有同等的法律效力。</h4>
          <h4>甲方特别申明:</h4>
          <h4>本协议为甲方预先已电子签章的标准合同文本，未经甲方重新盖章确认，不得在本协议内以及本协议外另行文字约定变更甲方责任与义务的内容，否则，修改或约定的内容无效。本协议为电子合同，按照《中华人民共和国电子签名法》所述，与纸质合同具有同等法律效益。</h4>
          </Card>
          </div>
      </div>
    );
  }
}
export default WaybillAgreement
