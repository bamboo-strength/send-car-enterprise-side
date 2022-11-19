import React, { PureComponent } from 'react';
import { Accordion, Button, List, Modal, NavBar, Toast, WhiteSpace } from 'antd-mobile';
import { Col, Divider, Form, Icon } from 'antd';
import { router } from 'umi';
import './Epidemic.less'
import ImageShow from '@/components/ImageShow/ImageShow';
import { antiepidemicregisterDetail, reservationqueueSave } from '@/services/epidemic';
import MatrixMobileSelect from '@/components/MatrixMobile/MatrixMobileSelect';
import { requestListApi } from '@/services/api';
import { Map, } from 'react-amap';
// import MatrixMobileAutoComplete from '@/components/MatrixMobile/MatrixMobileAutoComplete'

@Form.create()
class EpidemicLineUp extends PureComponent {

  state = {
    imgShow:false,
    imgPath:'',
    detail:{},
    imgUrl1:'',
    imgUrl2:'',
    imgUrl3:'',
    options:[],
    loading:false,
    // reservtionQueuePosition:''
  }

  componentDidMount() {
    antiepidemicregisterDetail().then(item=>{
      if (item.success){
        const {pictureList} = item.data
        if(pictureList){ // 有申报信息
          this.setState({
            detail:item.data,
            imgUrl1:pictureList[0].picturePath,
            imgUrl2:pictureList[1].picturePath,
            imgUrl3:pictureList[2].picturePath,
            imgUrl4:pictureList[3].picturePath,
          })
        }
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

  submit = ()=>{
    const {form} = this.props
    const {detail} = this.state
    form.validateFieldsAndScroll((errors) => {
      if (!errors){
        const params = form.getFieldsValue(['plantAreaId','varietyOfCoalId','vehicleno'])
        this.setState({
          loading:true
        })
        let antiepidemicQueueVO = {}
        if(detail.driverIdcard){ // 有防疫信息
          antiepidemicQueueVO = {
            antiepidemicPictureList:[
              {busType: 1, pictureName: 1, picturePath: detail.pictureList[0].picturePath},
              {busType: 1, pictureName: 2, picturePath: detail.pictureList[1].picturePath},
              {busType: 1, pictureName: 3, picturePath: detail.pictureList[2].picturePath},
              {busType: 1, pictureName: 4, picturePath: detail.pictureList[3].picturePath}
            ],
            ...detail,
            id:''
          }
          delete antiepidemicQueueVO.tenantId
        }

        reservationqueueSave({ ...params,antiepidemicQueueVO }).then(item=>{
          this.setState({
            loading:false
          })
          if (item.success){
            const {data} = item
            if(data){
              Toast.success('排队申请提交成功')
              router.push('/epidemic/queue/formalQueue')
            }else {
              Modal.alert('您还没有进行防疫申报','请先进行防疫申报',[
                {text:'取消',onPress:()=>router.push('/dashboard/function')},
                {text:'去申报',onPress:()=>router.push('/epidemic/epidemicAdd')},
              ])
            }
          }
        })
      }
    })
  }

  onChanges = (e)=>{
    const {form} = this.props
    form.setFieldsValue({
      varietyOfCoal:'',
      varietyOfCoalId:''
    })
    requestListApi('/api/mer-queue/coal/listNoPage', { deptId:e }).then(resp => {
      if (resp.success){
        this.setState({
          options:resp.data
        })
      }
    });
  }

  backFunc=()=>{
    const {location} = this.props
    if(location && location.state && location.state.ifNeedEpidemicAdd === 'N'){ // 不需要进行防疫申报
      router.push(`/dashboard/function`)
    }else {
      Modal.alert('返回','确定放弃排队申请？若放弃，需要再次进行排队申请',[
        {text:'放弃',onPress:()=>router.push(`/dashboard/function`)},
        {text:'继续申请',onPress:()=>
            console.log('000')
        },
      ])
    }

  }

  render() {
    const { form } = this.props
    const { imgShow , imgPath,detail,imgUrl1,imgUrl2,imgUrl3,imgUrl4,options,loading } = this.state
    const dividerStyle = { margin: 0, background: 'none' };
    const labelNumber = 5
    const span = 8
    const span2 = 16
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.backFunc()}
        >排队申请
        </NavBar>
        <div className='am-list'>
          <div className='epidemic-title'>排队信息</div>
          <MatrixMobileSelect id='plantAreaId' labelId='plantArea' required label='厂区' onChange={this.onChanges} deptCategory={2} dictCode='/api/shipper-system/dept/treesimple' labelNumber={labelNumber} placeholder='请选择厂区' className='list-class' form={form} />
          {/* <MatrixMobileAutoComplete label='厂区' placeholder='请使用拼音码选择厂区' dataType='vehicle' id='plantAreaId' labelId='plantArea' value='' labelValue='' className='list-class' required labelNumber={labelNumber} style={{width: '100%'}} onSelect={this.onChanges} form={form}  /> */}

          <Divider style={dividerStyle} />
          <MatrixMobileSelect id='varietyOfCoalId' labelId='varietyOfCoal' required label='物资' options={options} name='coalName' labelNumber={labelNumber} placeholder='请选择物资' className='list-class' form={form} />
          <MatrixMobileSelect id='vehiclenoName' labelId='vehicleno' required label='车牌号' custom={{ current: 1, size: -1,auditStatus:1 }} name="truckno" dictCode='/api/mer-driver-vehicle/vehicleInformationMaintenance/page' labelNumber={labelNumber} placeholder='请选择车牌号' className='list-class' form={form} />
          {
            detail.driverIdcard &&
            <Accordion className="my-accordion edip-acc">
              <Accordion.Panel header={<div className='epidemic-title2'>防疫信息</div>}>
                <List style={{position: 'static'}}>
                  <List.Item className='list-item'><Col span={span}>姓名</Col><Col span={span2}>{detail.driverName}</Col></List.Item>
                  <List.Item className='list-item'><Col span={span}>手机号</Col><Col span={span2}>{detail.driverPhone}</Col></List.Item>
                  <List.Item className='list-item'><Col span={span}>身份证</Col><Col span={span2}>{detail.driverIdcard}</Col></List.Item>
                  {/* <List.Item className='list-item'><Col span={span}>车牌号</Col><Col span={span2}>{detail.vehicleno}</Col></List.Item> */}
                  <List.Item className='list-item'><Col span={span}>当前体温(℃)</Col><Col span={span2}>{detail.driverTemp}</Col></List.Item>
                  <List.Item className='list-item'><Col span={span}>返回地</Col><Col span={span2}>{detail.placeOfReturn}</Col></List.Item>
                  <List.Item className='list-item'><Col span={span}>是否核酸检测</Col><Col span={span2}>{detail.nucleicAcidTest=== 1?'强制检测':'不强制检测'}</Col></List.Item>
                  <List.Item className='list-item'><Col span={span}>核酸检测报告</Col><Col span={span2}><img alt='' className='epidemic-img' src={imgUrl1} onClick={()=>this.imgshow(imgUrl1)} /></Col></List.Item>
                  <List.Item className='list-item'><Col span={span}>行程卡</Col><Col span={span2}><img alt='' className='epidemic-img' src={imgUrl2} onClick={()=>this.imgshow(imgUrl2)} /></Col></List.Item>
                  <List.Item className='list-item'><Col span={span}>健康码</Col><Col span={span2}><img alt='' className='epidemic-img' src={imgUrl3} onClick={()=>this.imgshow(imgUrl3)} /></Col></List.Item>
                  <List.Item className='list-item'><Col span={span}>同行密接</Col><Col span={span2}><img alt='' className='epidemic-img' src={imgUrl4} onClick={()=>this.imgshow(imgUrl4)} /></Col></List.Item>
                </List>
              </Accordion.Panel>
            </Accordion>
          }

          <WhiteSpace />
          <div className='btn-bg'>
            <Button type='primary' onClick={this.submit} loading={loading}>申请</Button>
          </div>
          <ImageShow imgPath={imgPath} visible={imgShow} onClose={this.onClose} />
        </div>
      </div>
    );
  }
}


export default EpidemicLineUp;
