import React, { PureComponent } from 'react';
import { List, NavBar } from 'antd-mobile';
import { Col, Icon } from 'antd';
import { router } from 'umi';
import '../Epidemic.less'
import ImageShow from '@/components/ImageShow/ImageShow';
import { reservationqueueDetail } from '@/services/epidemic';

class VaccineRecordsView extends PureComponent {
  state = {
    imgShow:false,
    imgPath:'',
    detail:{},
    imgUrl1:'',
    imgUrl2:'',
    imgUrl3:'',
    imgUrl4:'',
  }

  componentDidMount() {
    const {match:{params:{id}}} = this.props
    reservationqueueDetail({ id }).then(item=>{
      // console.log(item.data.antiepidemicQueueVO.antiepidemicPictureList)
      if (item.success){
        this.setState({
          detail:item.data,
          imgUrl1:item.data.antiepidemicQueueVO.antiepidemicPictureList[0].picturePath,
          imgUrl2:item.data.antiepidemicQueueVO.antiepidemicPictureList[1].picturePath,
          imgUrl3:item.data.antiepidemicQueueVO.antiepidemicPictureList[2].picturePath,
          imgUrl4:item.data.antiepidemicQueueVO.antiepidemicPictureList.includes(item.data.antiepidemicQueueVO.antiepidemicPictureList[3])?item.data.antiepidemicQueueVO.antiepidemicPictureList[3].picturePath:'',
        })
      }
    })
  }

  /* 图片放大 */
  imgshow = (img)=>{
    this.setState({
      imgShow:true,
      imgPath:img
    })
  }

  onClose = () =>{
    this.setState({
      imgShow:false,
    })
  }

  render() {
    const { imgShow , imgPath,detail,imgUrl1,imgUrl2,imgUrl3,imgUrl4 } = this.state
    const span = 8
    const span2 = 16
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {router.push(`/epidemic/vaccinerecords`);}}
        >防疫申报详情
        </NavBar>
        <div className='am-list'>
          <List style={{position: 'static'}}>
            <List.Item className='list-item'><Col span={span}>姓名</Col><Col span={span2}>{detail.antiepidemicQueueVO?detail.antiepidemicQueueVO.driverName:''}</Col></List.Item>
            <List.Item className='list-item'><Col span={span}>手机号</Col><Col span={span2}>{detail.antiepidemicQueueVO?detail.antiepidemicQueueVO.driverPhone:''}</Col></List.Item>
            <List.Item className='list-item'><Col span={span}>身份证号</Col><Col span={span2}>{detail.antiepidemicQueueVO?detail.antiepidemicQueueVO.driverIdcard:''}</Col></List.Item>
            {/* <List.Item className='list-item'><Col span={span}>车牌号</Col><Col span={span2}>{detail.antiepidemicQueueVO?detail.antiepidemicQueueVO.vehicleno:''}</Col></List.Item> */}
            <List.Item className='list-item'><Col span={span}>当前体温</Col><Col span={span2}>{detail.antiepidemicQueueVO?detail.antiepidemicQueueVO.driverTemp:''}℃</Col></List.Item>
            <List.Item className='list-item'><Col span={span}>返回地</Col><Col span={span2}>{detail.antiepidemicQueueVO?detail.antiepidemicQueueVO.placeOfReturn:''}</Col></List.Item>
            <List.Item className='list-item'><Col span={span}>是否核酸检测</Col><Col span={span2}>强制核酸检测</Col></List.Item>
            <List.Item className='list-item'><Col span={span}>核酸检测报告</Col><Col span={span2}><img alt='' className='epidemic-img' src={imgUrl1} onClick={()=>this.imgshow(imgUrl1)} /></Col></List.Item>
            <List.Item className='list-item'><Col span={span}>行程卡</Col><Col span={span2}><img alt='' className='epidemic-img' src={imgUrl2} onClick={()=>this.imgshow(imgUrl2)} /></Col></List.Item>
            <List.Item className='list-item'><Col span={span}>健康码</Col><Col><img alt='' className='epidemic-img' src={imgUrl3} onClick={()=>this.imgshow(imgUrl3)} /></Col></List.Item>
            <List.Item className='list-item'><Col span={span}>同行密接及其他</Col><Col><img alt='' className='epidemic-img' src={imgUrl4} onClick={()=>this.imgshow(imgUrl4)} /></Col></List.Item>
            {
              detail.applyStatus === 5?(
                <List.Item className='list-item'><Col span={span}>驳回原因</Col><Col span={span2}>{detail.finalOpinion}</Col></List.Item>
              ):''
            }
          </List>
          <ImageShow imgPath={imgPath} visible={imgShow} onClose={this.onClose} />
        </div>
      </div>
    );
  }
}


export default VaccineRecordsView;
