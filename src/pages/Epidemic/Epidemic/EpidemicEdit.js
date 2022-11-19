import React, { PureComponent } from 'react';
import { Button, Modal, NavBar, Toast, WhiteSpace } from 'antd-mobile';
import { Divider, Form, Icon } from 'antd';
import { router } from 'umi';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import MatrixMobileSelect from '@/components/MatrixMobile/MatrixMobileSelect';
import MatrixAddressArea from '@/components/Matrix/MatrixAddressArea';
import NetWorkImage from '@/components/NetWorks/NetWorkImage';
import AgreeItem from 'antd-mobile/lib/checkbox/AgreeItem';
import { antiepidemicqueueUpdate, reservationqueueDetail } from '@/services/epidemic';

@Form.create()
class EpidemicEdit extends PureComponent {

  state = {
    detail:{},
    imgUrl1:'',
    imgUrl2:'',
    imgUrl3:'',
    imgUrl4:'',
    provinceCode:'',
    cityCode:'',
    districtCode:'',
  }

  componentDidMount() {
    const {match:{params:{id}}} = this.props
    reservationqueueDetail({ id }).then(item=>{
      if (item.success){
        this.setState({
          detail:item.data,
          imgUrl1:item.data.antiepidemicQueueVO.antiepidemicPictureList[0].picturePath,
          imgUrl2:item.data.antiepidemicQueueVO.antiepidemicPictureList[1].picturePath,
          imgUrl3:item.data.antiepidemicQueueVO.antiepidemicPictureList[2].picturePath,
          imgUrl4:item.data.antiepidemicQueueVO.antiepidemicPictureList[3].picturePath,
          provinceCode:item.data.antiepidemicQueueVO.placeOfReturnCode.split(',')[0],
          cityCode:item.data.antiepidemicQueueVO.placeOfReturnCode.split(',')[1],
          districtCode:item.data.antiepidemicQueueVO.placeOfReturnCode.split(',')[2],
        })
      }
    })
  }

  submit = ()=>{
    const { form } = this.props
    const { isRequired ,detail } = this.state
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors){
        const {checked} = this.state
        if (!checked){
          Toast.fail('请先同意《用户服务协议》及《隐私政策》')
          return
        }
        if (typeof values.imgUrl1.file === 'object' ){
          Toast.loading('图片上传中，请等待！')
          return
        }
        if (typeof values.imgUrl2.file === 'object' ){
          Toast.loading('图片上传中，请等待！')
          return
        }
        if (typeof values.imgUrl3.file === 'object' ){
          Toast.loading('图片上传中，请等待！')
          return
        }
        if (typeof values.imgUrl4.file === 'object' ){
          Toast.loading('图片上传中，请等待！')
          return
        }
        const params = {
          ...values,
          nucleicAcidTest:isRequired,
          antiepidemicPictureList:[
            {pictureName:1,picturePath:typeof values.imgUrl1 === 'string'?values.imgUrl1:values.imgUrl1.file},
            {pictureName:2,picturePath:typeof values.imgUrl2 === 'string'?values.imgUrl2:values.imgUrl2.file},
            {pictureName:3,picturePath:typeof values.imgUrl3 === 'string'?values.imgUrl3:values.imgUrl3.file},
            {pictureName:4,picturePath:typeof values.imgUrl4 === 'string'?values.imgUrl4:values.imgUrl4.file},
          ],
          id:detail.antiepidemicQueueVO.id,
          reservationQueueId:detail.antiepidemicQueueVO.reservationQueueId,
        }
        delete params.imgUrl1
        delete params.imgUrl2
        delete params.imgUrl3
        delete params.imgUrl4
        delete params.vehiclenoName
        this.setState({
          loading:true
        })
        antiepidemicqueueUpdate(params).then(item=>{
          if (item.success){
            Toast.success(item.msg)
            router.push('/epidemic/vaccinerecords')
          }else {
            this.setState({
              loading:false
            })
          }
        })
      }
    })
  }

  render() {
    const {form} = this.props
    const {isRequired,detail,loading,visible,imgUrl1,imgUrl2,imgUrl3,provinceCode,cityCode,districtCode,imgUrl4} = this.state
    const dividerStyle = { margin: 0, background: 'none' };
    const labelNumber = 7
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {router.push(`/epidemic/vaccinerecords`);}}
          rightContent={<Icon type="question-circle" onClick={()=>this.setState({visible:true})} />}
        >防疫申报
        </NavBar>
        <div className='am-list'>
          <MatrixMobileInput id='driverName' required label='姓名' disabled initialValue={detail.antiepidemicQueueVO?detail.antiepidemicQueueVO.driverName:''} labelNumber={labelNumber} placeholder='请输入姓名' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='driverPhone' required label='手机号' disabled initialValue={detail.antiepidemicQueueVO?detail.antiepidemicQueueVO.driverPhone:''} labelNumber={labelNumber} placeholder='请输入手机号' numberType='isMobile' type='number' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='driverIdcard' required label='身份证' disabled initialValue={detail.antiepidemicQueueVO?detail.antiepidemicQueueVO.driverIdcard:''} labelNumber={labelNumber} placeholder='请输入身份证' numberType='isIdCardNo' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileSelect id='vehiclenoName' labelId='vehicleno' required label='车牌号' initialValue={detail.antiepidemicQueueVO?detail.antiepidemicQueueVO.vehicleno:''} custom={{ current: 1, size: 5 }} name="truckno" dictCode='/api/mer-driver-vehicle/vehicleInformationMaintenance/page' labelNumber={labelNumber} placeholder='请选择车牌号' className='list-class' form={form} />
          <WhiteSpace />
          <MatrixMobileInput id='driverTemp' required label='当前体温' labelNumber={labelNumber} initialValue={detail.antiepidemicQueueVO?detail.antiepidemicQueueVO.driverTemp:''} placeholder='请输入当前体温' extra='℃' moneyKeyboardAlign='left' type='money' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixAddressArea id='placeOfReturn' idCode='placeOfReturnCode' labelNumber={labelNumber} initialValue={[provinceCode,cityCode,districtCode]} required label='返回地' placeholder='请选择返回地' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='nucleicAcidTest' required label='是否核酸检测' labelNumber={labelNumber} disabled initialValue='强制核酸检测' type='number' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <NetWorkImage label='核酸检测报告' upload id='imgUrl1' labelNumber={labelNumber} url={imgUrl1} required={Number(isRequired) === 1} form={form} />
          <Divider style={dividerStyle} />
          <NetWorkImage label='行程卡' upload id='imgUrl2' labelNumber={labelNumber} url={imgUrl2} required form={form} />
          <Divider style={dividerStyle} />
          <NetWorkImage label='健康码' upload id='imgUrl3' labelNumber={labelNumber} url={imgUrl3} required form={form} />
          <Divider style={dividerStyle} />
          <NetWorkImage label='同行密接' upload id='imgUrl4' labelNumber={labelNumber} url={imgUrl4} required form={form} />
          <WhiteSpace />
          <div className='btn-bg'>
            <AgreeItem data-seed="logId" onChange={e => e.target.checked === true?this.setState({checked:true}):this.setState({checked:false})} style={{marginRight:15}}>
              上述信息由本人申报并核实，如有瞒报，本人愿承担一切法律责任。本人同意并授权运营商查询疫情期间14天内到访地信息。<a>《用户服务协议》及《隐私政策》</a>
            </AgreeItem>
            <Button type='primary' onClick={this.submit} loading={loading}>保存</Button>
          </div>
          <Modal
            visible={visible}
            transparent
            maskClosable={false}
            onClose={()=>this.setState({visible:false})}
            title="防疫申报说明"
            footer={[{ text: '我知道了', onPress: () => this.setState({visible:false}) }]}
            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          >
            <div style={{ height: 300, overflow: 'scroll',textAlign:'left',}}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您在进行防疫申报信息填写时须了解以下注意事项：<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.您选择的车牌号须与您准备排队使用的车牌号一致；<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.您的当前体温须如实填写；<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.返回地是指您下一站目的地；<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.当前为疫情防控特殊时期，是否核酸检测暂时为强制性核酸检测，请您谅解；<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.核酸检测须上传48小时内的核酸检测报告图片，可直接拍照或者在相册中选择；<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.行程卡须登录支付宝，在支付宝中搜索“行程卡”，进入行程卡页面截图保存到相册，在此上传行程卡图片时选择相册中截图保存的行程卡图片即可；<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.健康码须登录支付宝，在支付宝中搜索“健康码”，进入健康码页面截图保存到相册，在此上传健康码图片时选择相册中截图保存的健康码图片即可。<br />
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default EpidemicEdit;
