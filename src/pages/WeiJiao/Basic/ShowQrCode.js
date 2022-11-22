import React, { PureComponent } from 'react';
import QRCode from 'qrcode.react';
import { Icon, NavBar, Toast } from 'antd-mobile';
import router from 'umi/router';
import { requestPostHeader } from '../../../services/api';
import { detail } from '../../../services/merDriver';
import { getCurrentUser } from '@/utils/authority';


 class ShowQrcode extends PureComponent {

  constructor(props){
    super(props);
    this.state={
      qrModalContent:{}
    }
  }

  componentDidMount() {
    detail({userId:getCurrentUser().userId}).then(resp=>{
      if(resp && resp.success){
        const {data} = resp
        // const queryParam = {'vehicleno':'冀FR1097','driverno':'15212619741230121X'}
        const queryParam = {'driverno':data.jszh}
        this.getDataByInterval(queryParam)
        this.interval = setInterval(() => {
          this.getDataByInterval(queryParam)
        }, 1000 * 30); // 30秒获取一次
      }else {
        Toast.info('请先进行司机认证')
      }
    })

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getDataByInterval = (queryParam)=>{
    requestPostHeader('/api/mer-tableextend/commonBusiness/queryData',
      { 'tableName': 'bhnf_qrCode','modulename':'queryqrCode',btnCode: 'query',queryParam
      }).then(resp=>{
        // console.log(resp,'===')
      if (resp.success && resp.data.data) {
        this.setState({
          qrModalContent:resp.data.data
        })
      }
      /* else {
        Toast.info('暂无有效派车单')
      } */
    })
  }

  render() {
    const {qrModalContent} = this.state
    // console.log(qrModalContent,'---')
  const style2 ={
    backgroundSize: '100% 100%',
    width: '310px',
    height: '310px',
    margin: '20px auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
    return(
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/function')}
        ><span style={{ color: '#108ee9' }}>二维码展示</span>
        </NavBar>
        <div className='am-list'>
          <div style={style2} className='QrCodeModal'>
            {
              qrModalContent.id?
                <QRCode
                  value={qrModalContent.id}// 生成二维码的内容
                  size={250} // 二维码的大小
                  fgColor="#000000"
                />:<span style={{fontWeight: 'bold',fontSize:'18px'}}>暂无有效派车单</span>
            }

          </div>
        {/*  <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
            <Text style={{marginBottom:5}}>id：{qrModalContent.id}</Text>
            <Text style={{marginBottom:5}}>所属机构：{qrModalContent.deptName}</Text>
            <Text style={{marginBottom:5}}>客户：{qrModalContent.custName}</Text>
            <Text style={{marginBottom:5}}>车号：{qrModalContent.vehicleno}</Text>
            <Text>物资：{qrModalContent.materialsName}</Text>
          </div> */}
        </div>

      </div>

    )
  }

}
export default ShowQrcode;
