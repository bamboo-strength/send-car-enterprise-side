import React, {Component} from 'react'
import func from '@/utils/Func';
import  baoxing  from './baoxing.png';

class TableFor187382 extends Component {

  render() {
    const {
      detailData
    } = this.props;
    const date = new Date();
    const time = `${date.getFullYear()}年${date .getMonth()+1}月${date .getDate()}日`
    const pstyle = {
      fontSize: '12px',width: '100%',fontFamily:'宋体'
    }

    return (
      <div>
         <img src={baoxing} width='80px' height='80px' style={{position: 'relative',top: '35px',left: '180px'}} />
        <p align="center" style={{fontSize: '15px',fontWeight: 'bold',fontFamily:'宋体',width: '100%'}}>宝兴县矿产资源准运证</p>
        <div>
          <span align="left" className={pstyle}>打印时间：{time}</span>
          <span style={{float: 'right'}} className={pstyle}>编号：{detailData.weightno}</span>
        </div>

        <table border="1" style={{fontSize: '14px',textAlign:'center',fontFamily:'宋体',width: '100%'}}>
          <tr>
            <td>车牌号</td>
            <td>{detailData.vehicleno}</td>
            <td>发货地点</td>
            <td>{detailData.deptName}</td>
          </tr>
          <tr>
            <td>皮重时间</td>
            <td>{detailData.taretime}</td>
            <td>皮重(吨)</td>
            <td>{detailData.tareweight}</td>
          </tr>
          <tr>
            <td>毛重时间</td>
            <td>{detailData.grosstime}</td>
            <td>毛重(吨)</td>
            <td>{detailData.grossweight}</td>
          </tr>
          <tr>
            <td>货名/型号</td>
            <td>{detailData.materialName}</td>
            <td>净重(吨)</td>
            <td>{detailData.netweight}</td>
          </tr>
          <tr>
            <td>单价(元)</td>
            <td>{detailData.price}</td>
            <td>金额(小写)</td>
            <td>{detailData.balanceMoney}</td>
          </tr>
          <tr>
            <td >金额大写</td>
            <td colSpan="4">{func.NumberToString(detailData.balanceMoney)} &nbsp;&nbsp;&nbsp;&nbsp;{detailData.custName}</td>
          </tr>
        </table>
        <p align="left" className={pstyle}>公司电话：0835-6826598</p>

      </div>

    )
  }
}


export default TableFor187382;
