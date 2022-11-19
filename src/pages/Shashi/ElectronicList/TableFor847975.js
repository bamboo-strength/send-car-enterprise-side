import React, {Component} from 'react'
import func from '@/utils/Func';
import  shashi  from './shashi.png';

class TableFor847975 extends Component {

  /* componentDidMount() {
     const date = new Date();
     date .getFullYear(); // 获取完整的年份(4位)
     date .getMonth(); // 获取当前月份(0-11,0代表1月)
     date .getHours(); // 获取当前小时数(0-23)
     date .getMinutes(); // 获取当前分钟数(0-59)
     date .getSeconds(); // 获取当前秒数(0-59)
    const aa = `${date.getFullYear()}年${date .getMonth()+1}月${date .getDate()}日`
  }
*/

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
        <img src={shashi} width='60px' height='60px' style={{position: 'relative',top: '35px',left: '180px'}} />
        <p align="center" style={{fontSize: '15px',fontWeight: 'bold',fontFamily:'宋体',width: '100%'}}>东平金石矿业科技有限公司销售单</p>
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
        <p align="left" className={pstyle}>公司电话：0538-2832066</p>

      </div>

    )
  }
}


export default TableFor847975;
