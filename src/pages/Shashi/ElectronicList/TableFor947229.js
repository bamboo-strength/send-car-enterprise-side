import React, {Component} from 'react'

class TableFor847975 extends Component {

  componentWillMount() {

  }



  render() {
    const {
      detailData
    } = this.props;
    return (
      <div>
        <p align="center" style={{fontSize: '15px',fontWeight: 'bold',fontFamily:'宋体',width: '100%'}}>销售磅单</p>
        <p align="right" style={{fontSize: '8px',width: '100%',fontFamily:'宋体'}}>过磅单号：{detailData.weightno}</p>
        <table border="1" style={{fontSize: '5px',textAlign:'center',fontFamily:'宋体',width: '100%'}}>
          <tr>
            <td>车号</td>
            <td>{detailData.vehicleno}</td>
            <td>物资</td>
            <td>{detailData.materialName}</td>
            <td>单价(元)</td>
            <td>{detailData.price}</td>
          </tr>
          <tr>
            <td>皮重(吨)</td>
            <td>{detailData.tareweight}</td>
            <td>毛重(吨)</td>
            <td>{detailData.grossweight}</td>
            <td>净重(吨)</td>
            <td>{detailData.netweight}</td>
          </tr>
          <tr>
            <td style={{width: '65px'}}>合同号</td>
            <td>{detailData.contractno}</td>
            <td>司机姓名</td>
            <td>{detailData.driverName}</td>
            <td>车辆状态</td>
            <td>{detailData.weightFlagName}</td>
          </tr>
          <tr>
            <td>客户</td>
            <td colSpan="2">{detailData.custName}</td>
            <td>所属机构</td>
            <td colSpan="2">{detailData.deptName}</td>
          </tr>
          <tr>
            <td>空车磅</td>
            <td colSpan="2" style={{textAlign:'center',padding:0}}>{detailData.tarePoundnoName}</td>
            <td>重车磅</td>
            <td colSpan="2">{detailData.grossPoundnoName}</td>
          </tr>
          <tr>
            <td>空车时间</td>
            <td colSpan="2" style={{whiteSpace: 'nowrap'}}>{detailData.taretime}</td>
            <td>重车时间</td>
            <td colSpan="2">{detailData.grosstime}</td>
          </tr>
        </table>
        {/* <p align="left" style={{fontSize: '8px',fontFamily:'宋体'}}>打印人：嬴洲矿业管理员</p> */}
      </div>

    )
  }
}


export default TableFor847975;
