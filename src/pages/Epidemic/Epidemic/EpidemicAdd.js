import React, { PureComponent } from 'react';
import { Checkbox, Divider, Form, Icon } from 'antd';
import { router } from 'umi';
import { Button, NavBar, Toast, WhiteSpace,Modal } from 'antd-mobile';
import AgreeItem from 'antd-mobile/lib/checkbox/AgreeItem';
import { connect } from 'dva';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import MatrixAddressArea from '@/components/Matrix/MatrixAddressArea';
import NetWorkImage from '@/components/NetWorks/NetWorkImage';
import { getTenantId } from '@/pages/Merchants/commontable';
import { getSystemParamByParamKey } from '@/services/param';
import {getEditConf} from '@/components/Matrix/MatrixEditMobileConfig';
import { getCurrentDriver } from '@/utils/authority';
import { antiepidemicregisterSave,antiepidemicregisterCurrent,againAntiepidemicSubmit } from '../../../services/epidemic';
import MyModal from '@/components/Util/MyModal';
import { project } from '@/defaultSettings';
import AgreementForkspt from '@/pages/JoinUs/AgreementForkspt';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import func from '@/utils/Func';

@connect(({ tableExtend }) => ({
  tableExtend
}))
@Form.create()
class EpidemicAdd extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      checked:false,
      isRequired:0,
      loading:false,
      visible:false,
      epidemicDetail:{},
      photovisible:false,
      showColums:[],
    };
  }

  componentDidMount() {
    const {dispatch,location,tableExtend:{ data }} = this.props
    // dispatch(TABLEEXTEND_COLUMNLIST({ 'tableName': 'epidemic','modulename':'add',queryType:0})).then(() => {
    //   if (data !== undefined && func.notEmpty(data.columList)) {
    //     const aa=data.columList;
    //     this.setState({
    //       showColums: aa.table_main,
    //     },()=>{
          // 查询最新申报信息
          const currentParam = {}
          if(location.state && location.state.ifSecond){
            currentParam.ifSecond = true
            currentParam.reservationQueueId = location.state.reservationQueueId
          }
          antiepidemicregisterCurrent(currentParam).then(resp=>{
            let pictureList = []
            if(location.state && location.state.ifSecond){ // 二次申报
              pictureList = resp.data.antiepidemicPictureList
            }else {
              pictureList = resp.data.pictureList
            }
            if (resp.success){
              this.setState({
                epidemicDetail:resp.data,
              })
              // if(aa.table_main.length === 0){
                 if (JSON.stringify(resp.data) !== '{}'){
                 if (pictureList.length !== 0){
                   this.setState({
                     imgUrl1:pictureList?pictureList[0].picturePath:'',
                     imgUrl2:pictureList?pictureList[1].picturePath:'',
                     imgUrl3:pictureList?pictureList[2].picturePath:'',
                     imgUrl4:pictureList?pictureList[3].picturePath:'',
                   })
                 }
               }
              // }
            }

          })
    //     })
    //   }
    // })
    const param = { 'paramKey': `epidemic.isRequired.testReport` };
    param.tenantId = getTenantId();
    getSystemParamByParamKey(param).then(resp => {
      if (resp.success) {
        this.setState({
          isRequired:resp.data.paramValue
        })
      }
    });

  }

  submit = ()=>{
    const { form ,location} = this.props
    const { isRequired ,showColums,} = this.state
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors){
        const {checked} = this.state
        if (!checked){
          Toast.fail('请先同意《用户服务协议》及《隐私政策》')
          return
        }
        if (values.imgUrl1 && typeof values.imgUrl1.file === 'object' ){
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
        const valArr = values.placeOfReturnCode.split(',');
        if (valArr.some(item => !item)){
          Toast.fail('返回地选择不完整，请重新选择！')
          return
        }
        let params = {}
        if(showColums.length>0){
          const pictureList = []
          showColums.forEach(item => {
            if(item.category == 7){
              pictureList.push({pictureName:item.dickKey,picturePath:typeof values[item.columnName] === 'string'?values[item.columnName]:values[item.columnName].file})
              delete values[item.columnName]
            }
          });
          params = {
            ...values,
            pictureList
          }
        }else {
          params = {
            ...values,
            nucleicAcidTest:isRequired,
            pictureList:[
              {pictureName:0,picturePath: values.imgUrl1?typeof values.imgUrl1 === 'string'?values.imgUrl1:values.imgUrl1.file:''},
              {pictureName:1,picturePath:typeof values.imgUrl2 === 'string'?values.imgUrl2:values.imgUrl2.file},
              {pictureName:2,picturePath:typeof values.imgUrl3 === 'string'?values.imgUrl3:values.imgUrl3.file},
              {pictureName:3,picturePath:typeof values.imgUrl4 === 'string'?values.imgUrl4:values.imgUrl4.file},
            ],
          }
          delete params.imgUrl1
          delete params.imgUrl2
          delete params.imgUrl3
          delete params.imgUrl4
          // delete params.vehiclenoName
        }
        this.setState({
          loading:true
        })

        if(location.state && location.state.ifSecond){ // 二次申报
          this.againAntiepidemic(params)
        }else {
          antiepidemicregisterSave(params).then(item=>{
            this.setState({
              loading:false
            })
            if (item.success){
              Toast.success(item.msg)
              router.push('/epidemic/epidemiclineup')
            }
          })
        }
      }
    })
  }

  getAgreement =(params, autoheight)=>{
    if(project === 'kspt'){
      return <AgreementForkspt params={params} autoheight={autoheight} />;
    }
  }

  againAntiepidemic=(param)=>{
    const params = param
    const {epidemicDetail} = this.state
    // console.log(epidemicDetail)
    Modal.alert('特别说明',
      <div>
        <p>1.二次提交防疫申报审核信息，若审核不通过，仍需要人工审核。</p>
        <p>2.入场时间到期后仍未二次防疫申报情况，自动取消本次排队，司机已预定增值服务以及相关专用收费的不在进行退款。</p>
        <p>3.二次防疫申报系统未审核通过情况，请及时联系厂区处理，避免过时系统自动取消排队。</p>
      </div>
      , [
        { text: '取消',onPress: () =>
            this.setState({
              loading:false
            })},
        { text: '我已知晓', onPress: () =>
            new Promise((resolve, reject) => {
              Toast.loading('提交中')
              params.antiepidemicPictureList = params.pictureList
              params.reservationQueueId = epidemicDetail.reservationQueueId
              params.id = epidemicDetail.id
              delete params.pictureList
              againAntiepidemicSubmit(params).then(item=>{
                Toast.hide()
                this.setState({
                  loading:false
                })
                if (item.success){
                  resolve()
                  Toast.success(item.msg)
                  router.push('/epidemic/queue/formalQueue')
                }
              })
            }),
        },
      ])
  }

  render() {
    const {form} = this.props
    const {isRequired,loading,visible,epidemicDetail,imgUrl1,imgUrl2,imgUrl3,imgUrl4,photovisible,showColums} = this.state
    // console.log(showColums,'===')
    const detail = getCurrentDriver()
    const dividerStyle = { margin: 0, background: 'none' };
    const labelNumber = 7
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {router.push(`/dashboard/function`);}}
          rightContent={<Icon type="question-circle" onClick={()=>this.setState({visible:true})} />}
        >防疫申报
        </NavBar>
        <div className='am-list'>
          <MatrixMobileInput id='driverName' label='姓名' disabled initialValue={detail && detail.name} labelNumber={labelNumber} placeholder='请输入姓名' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='driverPhone' label='手机号' disabled initialValue={detail && detail.phone} labelNumber={labelNumber} placeholder='请输入手机号' numberType='isMobile' type='number' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='driverIdcard' label='身份证' disabled initialValue={detail && detail.jszh} labelNumber={labelNumber} placeholder='请输入身份证' numberType='isIdCardNo' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          {/* <MatrixMobileSelect id='vehiclenoName' labelId='vehicleno' required label='车牌号' custom={{ current: 1, size: -1,auditStatus:1 }} name="truckno" dictCode='/api/mer-driver-vehicle/vehicleInformationMaintenance/page' labelNumber={labelNumber} placeholder='请选择车牌号' className='list-class' form={form} />
          */}
          <WhiteSpace />
          {
            showColums.length>0?
              getEditConf(showColums,form,epidemicDetail,{}):
              <div>
                <MatrixMobileInput id='driverTemp' required label='当前体温' labelNumber={labelNumber} placeholder='请输入当前体温' extra='℃' initialValue={epidemicDetail.driverTemp} moneyKeyboardAlign='left' numberType='temp' maxLength='4' type='money' className='list-class' form={form} />
                <Divider style={dividerStyle} />
                <MatrixAddressArea id='placeOfReturn' idCode='placeOfReturnCode' labelNumber={labelNumber} initialValue={JSON.stringify(epidemicDetail) !== '{}' && epidemicDetail.placeOfReturnCode} required label='返回地' placeholder='请选择返回地' className='list-class' form={form} />
                <Divider style={dividerStyle} />
                <MatrixMobileInput id='nucleicAcidTest' required label='是否核酸检测' labelNumber={labelNumber} disabled initialValue={Number(isRequired) === 1?'强制检测':'不强制检测'} type='number' className='list-class' form={form} />
                <Divider style={dividerStyle} />
                <NetWorkImage label='核酸检测报告' upload id='imgUrl1' labelNumber={labelNumber} url={imgUrl1} required={Number(isRequired) === 1} extra='请上传厂区规定时间内的核酸报告。如无特殊要求，上传48小时内核酸报告' form={form} />
                <Divider style={dividerStyle} />
                <NetWorkImage label='行程卡' upload id='imgUrl2' labelNumber={labelNumber} url={imgUrl2} required extra='请上传厂区规定时间内的行程卡图片。如无特殊要求，上传当日行程卡图片' form={form} />
                <Divider style={dividerStyle} />
                <NetWorkImage label='健康码' upload id='imgUrl3' labelNumber={labelNumber} url={imgUrl3} extra='请上传当日健康码图片' required form={form} />
                <Divider style={dividerStyle} />
                <NetWorkImage label='同行密接或其他' upload id='imgUrl4' breakSpaces labelNumber={labelNumber} url={imgUrl4} extra='请上传当日同行密接图片或该厂区规定的其他图片' required form={form} />
              </div>

          }
          <Divider style={dividerStyle} />
          <WhiteSpace />
          <div className='btn-bg'>
            <AgreeItem data-seed="logId" onChange={e => e.target.checked === true?this.setState({checked:true}):this.setState({checked:false})} style={{marginRight:15}}>
              上述信息由本人申报并核实，如有瞒报，本人愿承担一切法律责任。本人同意并授权运营商查询疫情期间7天内到访地信息。
              <a onClick={(e)=>{ e.preventDefault(); this.setState({photovisible:true})}}>《用户服务协议》及《隐私政策》</a>
            </AgreeItem>
            <Button type='primary' onClick={this.submit} loading={loading}>下一步</Button>
          </div>
          <MyModal
            top={0}
            modaltitel="服务条款"
            visible={photovisible}
            onCancel={()=>this.setState({photovisible:false})}
            popupContent={this.getAgreement}
            selectRow={[]}
            popupwidth={0.9}
            height={0.6}
            isfangdaDisplay={false}
          />
          <Modal
            visible={visible}
            transparent
            maskClosable={false}
            onClose={()=>this.setState({visible:false})}
            title="防疫申报说明"
            footer={[{ text: '我知道了', onPress: () => this.setState({visible:false}) }]}
            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          >
            <div style={{overflow: 'scroll',padding:'0 5px'}}>
              <div style={{ height: 300, textAlign:'left',margin:'0 5px'}}>
                <div style={{ textIndent: '33px'}}>您在进行防疫申报信息填写时须了解以下注意事项：</div>
                <div style={{ textIndent: '33px'}}>1.您选择的车牌号须与您准备排队使用的车牌号一致；</div>
                <div style={{ textIndent: '33px'}}>2.您的当前体温须如实填写；</div>
                <div style={{ textIndent: '33px'}}>3.返回地是指您下一站目的地；</div>
                <div style={{ textIndent: '33px'}}>4.当前为疫情防控特殊时期，是否核酸检测暂时为强制性核酸检测，请您谅解；</div>
                <div style={{ textIndent: '33px'}}>5.核酸检测须上传48小时内的核酸检测报告图片，可直接拍照或者在相册中选择；</div>
                <div style={{ textIndent: '33px'}}>6.行程卡须登录支付宝，在支付宝中搜索“行程卡”，进入行程卡页面截图保存到相册，在此上传行程卡图片时选择相册中截图保存的行程卡图片即可；</div>
                <div style={{ textIndent: '33px'}}>7.健康码须登录支付宝，在支付宝中搜索“健康码”，进入健康码页面截图保存到相册，在此上传健康码图片时选择相册中截图保存的健康码图片即可。</div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default EpidemicAdd;
