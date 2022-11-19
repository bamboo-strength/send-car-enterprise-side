import { Card, List, NavBar, WhiteSpace, Button, Toast } from 'antd-mobile';
import { Form, Upload, Icon, Col, Row } from 'antd';
import React from 'react';
import router from 'umi/router';
import MatrixInput from '@/components/Matrix/MatrixInput';
import MatrixSelect from '@/components/Matrix/MatrixSelect';
import { connect } from 'dva';
import func from '../../../utils/Func';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import { requestApi } from '@/services/api';
import {detailByVehicleId} from '@/services/merDriver'
import ImageShow from '@/components/ImageShow/ImageShow';
import { gpsopenflag, trucksRegister } from '@/services/locus';

const { Item } = List;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function dealImageCompression(path, obj,callback){
  const img = new Image();
  img.src = path;
  img.onload = function () {
    // const that = this;
    // 默认按比例压缩
    let w = img.width;
    let h = img.height;
    const scale = w / h;
    // 默认图片质量为0.5
    let quality = 0.7;
    if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
      quality = obj.quality;
    }
    w *= quality;
    h *= quality ;
    // 生成canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    // 回调函数返回base64的值
    const base64 = canvas.toDataURL('image/jpeg', quality);
    callback(base64);
  }
}

function  dataURItoBlob(dataurl){   // dataurl是base64格式
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime,name:mime});
};

@connect(({ merVehicle,merDriver, tableExtend,loading }) => ({
  merVehicle,
  merDriver,
  tableExtend,
  loading: loading.models.merVehicle,
}))
@Form.create()
class CarCertificationNew extends React.Component {
  state = {
    loading: false,
    imgloading: false,
    imgShow: false,
    imgPath: '',
    showColumsText:[],
    showColumsImg:[],
    imageUrls:{},
    realFiles:{},
    detail:{},
    backpath:'',
  };

  componentWillMount() {
    const {dispatch} = this.props
    const {imageUrls} = this.state
    dispatch(TABLEEXTEND_COLUMNLIST({'tableName': 'merCar','modulename':'certification',queryType:1})).then(() => {
      const {tableExtend:{ data }} = this.props
      if (data !== undefined && func.notEmpty(data.columList)) {
        const aa=data.columList;
        const showColumsText = aa.table_main.filter(item=>item.category !== 7)
        const showColumsImg = aa.table_main.filter(item=>item.category === 7)
        //  console.log(truckId,truckId===undefined,truckId!=='undefined','=====truckId')
        this.setState({
          showColumsText,
          showColumsImg,
        },()=>{
          const {match: {
            params: { truckId },
          },} = this.props
          if(truckId !== 'undefined'){ // 车辆详情
            detailByVehicleId({id:truckId}).then(resp=>{
              const detail = resp.data
              if(func.notEmpty(detail)){
                showColumsImg.map((column,index)=>{
                  const columnname =column.columnName
                  imageUrls[columnname] =  func.notEmpty(detail[columnname])?detail[columnname]:''
                  return true
                })
                this.setState({
                  imageUrls,
                  detail
                })
              }else {
                this.setState({
                  detail
                })
              }
            })
          }
        })
      }
    })
  }

  componentDidMount() {
    const {showColumsImg,imageUrls} = this.state
    const { merDriver: { detail } } = this.props;
    console.log('detail555',detail);
    if(detail.truckno ==''){
      this.setState({
        backpath:'/driverSide/personal/personalCenter'
      })
    }else{
      this.setState({
        backpath:'/driverSide/personal/myCars'
      })
    }
  }

  handleChange = (info, item) => {
    const { imageUrls ,realFiles} = this.state;
    if (info.file.status === 'uploading') {
      this.setState({ imgloading: true });
      return;
    }
    if (info.file.status === 'done') {
      // realFiles[item.columnName] = info.file.originFileObj
      getBase64(info.file.originFileObj, imageUrl => {
          imageUrls[item.columnName] = imageUrl
          this.setState({
            imgloading: false,
            imageUrls,
          },()=>{
            dealImageCompression(imageUrl, 0.5,base64=>{
              realFiles[item.columnName] = dataURItoBlob(base64)
              requestApi('/api/mer-driver-vehicle/certificates/uploadCertificates', {...realFiles}).then(resp => {
                if (resp.success) {
                  const {data}= resp
                  realFiles[item.columnName] = data[item.columnName]
                  this.setState({
                    realFiles
                  });
                }
              });
            })

          })
        },
      );
    }
  };

  toAudit = () => {
    const {  form,
      match: {
        params: { truckId },
      } } = this.props;

    const { realFiles,loading,showColumsImg,imageUrls } = this.state;
    if (loading) {
      return;
    }

    // 验证图片
    let flag = true
    for(const index in showColumsImg){
      const item = showColumsImg[index]
      if(item.isrequired === 1 && func.isEmpty(imageUrls[item.columnName])){
        Toast.info(`${item.columnAlias}为必传项`)
        flag = false
        break
      }
    }

    if(!flag){
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        const param = {
          ...values,
          id:truckId==='undefined'?'':truckId
        };

        // trucksRegister({ deviceType: 1, truckno: param.truckno, deviceno: param.truckno, }).then(res => {
        //   if (res.success) {
        //     gpsopenflag({ openStatus: 1, phoneno: param.truckno, truckno: param.truckno, }).then(res1=>{
        //       if(res1.success) {
        //         Toast.success('设备注册并设置开启状态成功');
        //       }
        //     })
        //   }
        // });

        requestApi('/api/mer-driver-vehicle/vehicleCertification/submit', {...param,...realFiles}).then(data => {
          if (data.success) {
            Toast.success(data.msg);
            router.push('/driverSide/personal/personalCenter');
          }
          //   Toast.info(JSON.stringify(data))
          this.setState({
            loading: false,
          });

        });
      }
    });
  };

  // 放大图片
  expandImg = (e, imgRul) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      imgPath: imgRul,
      imgShow: true,
    });
  };

  onClose = () => {
    this.setState({
      imgShow: false,
    });
  };

  // checkImageWH  返回一个promise  检测通过返回resolve  失败返回reject阻止图片上传
  checkImageWH=(file, width, height) =>{
    // const self = this;
    return new Promise(function (resolve, reject) {
      const filereader = new FileReader();
      filereader.onload = e => {
        const src = e.target.result;
        const image = new Image();
        image.onload = function () {
          if (width && this.width !== width) {
            Toast.info(`请上传宽为${  width  }的图片`);
            reject();
          } else if (height && this.height !== height) {
            Toast.info(`请上传宽为${  height  }的图片`);
            reject();
          } else {
            resolve();
          }
        };
        image.onerror = reject;
        image.src = src;
      };
      filereader.readAsDataURL(file);
    });
  }

  //  限制图片大小
  checkFileSize = file => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Toast.info("超过2M限制 不允许上传!");
    }
    return  isLt2M && this.checkImageWH(file, 1268, 950);
  }

  beforeUpload=(file) => {
    // 检查图片类型
    // 只能上传三种图片格式
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isBMP = file.type === 'image/bmp';
    const isGIF = file.type === 'image/gif';
    const isWEBP = file.type === 'image/webp';
    const isPic = isJPG || isPNG || isBMP || isGIF || isWEBP;
    if (!isPic) {
      Toast.info('只能上传图片');
      return false;
    }
    return isPic;
  };



  render() {
    const { form } = this.props;
    const { showColumsText,showColumsImg,imageUrls, loading, imgShow, imgPath,imgloading,detail,backpath} = this.state;
    const iteams=getEditConf(showColumsText,form,detail,{},false,10);
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(backpath)}
        >车辆认证
        </NavBar>
        <div className='am-list'>
          <Card>
            <Card.Header
              title="证件上传"
              /* extra={<span style={{ fontSize: '12px' }}>单位（吨）</span>} */
            />
            {
              showColumsImg.length>0?
                <Card.Body>
                  <Row gutter={24} className='imageUploadRow'>
                    {
                      showColumsImg.map(item => (
                        <Upload
                          name='avatar'
                          listType="picture-card"
                          className="avatar-uploader imageUpload"
                          showUploadList={false}
                          beforeUpload={this.beforeUpload}
                          onChange={(info) => this.handleChange(info, item)}
                          accept="image/*"
                          capture="camera"
                        >
                          {imageUrls[item.columnName] ?
                            <div>
                              <img src={imageUrls[item.columnName]} alt="avatar" style={{ width: '100%', height: '90px' }} />
                              <span
                                onClick={(e) => this.expandImg(e, imageUrls[item.columnName])}
                                style={{ color: 'dodgerblue', fontSize: '12px' }}
                              >查看{item.columnAlias}
                              </span>
                            </div>
                            :
                            <div>
                              <Icon type={imgloading ? 'imgloading' : 'plus'} />
                              <div className="ant-upload-text">{item.isrequired === 1?<span style={{color:'red'}}>* </span>:''}{item.columnAlias}</div>
                            </div>}
                        </Upload>
                      ))
                    }
                  </Row>
                  {/* <Card.Footer style={{ fontSize: '10px', color: 'red' }} content="上传证件(单文件最大2MB)" /> */}
                </Card.Body>:undefined
            }
            <List className='static-list'>
              <WhiteSpace size="xl" />
              {
                showColumsText?
                  showColumsText.length < 1 ?
                    <div>
                      <Item><MatrixInput label="车牌号码" placeholder="请输入车牌号码" required id="truckno" numberType='isPlateNo' form={form} initialValue={detail.truckno} /></Item>
                      <Item><MatrixSelect label="车辆类型" placeholder='请选择车辆类型' id="trucktype" required dictCode="vehicleType" style={{ width: '100%' }} initialValue={detail.trucktype} form={form} />
                      </Item>
                      <Item><MatrixInput label="净重" placeholder="请输入净重" required id="netWeight" initialValue={detail.netWeight} form={form} numberType='isFloatGtZero' /></Item>
                      {/*  <Item><MatrixInput label="车辆总质量" placeholder="请输入车辆总质量" required id="totalWeight" form={form}  /></Item>
                    <Item><MatrixInput label="整备质量" placeholder="请输入整备质量" required id="kerbWeight" form={form}  /></Item>
                    <Item><MatrixInput label="核定载质量" placeholder="请输入核定载质量" required id="approvedLoadWeight" form={form}  /></Item>
                    <Item><MatrixInput label="车辆识别代码" placeholder="请输入车辆识别代码" required id="vehicleNumber" form={form}  /></Item> */}
                      <Item style={{display:'none'}}><MatrixInput label="道路运输证" placeholder="请输入道路运输证号" initialValue='123123' id="dlyszh" form={form} maxLength='17' /></Item>
                      <Item><MatrixSelect label="车轴数" placeholder='请选择车轴数' id="axles" required dictCode="axlesName" style={{ width: '100%' }} form={form} initialValue={detail.axles} />
                      </Item>
                    </div>
                    :
                    <div className='iteams'>{iteams}</div>
                  :undefined
              }
            </List>
          </Card>
          {
            <Button type="primary" style={{ width: '50%', margin: '20px auto'}} onClick={this.toAudit} loading={loading}>
              提交
            </Button>
          }
        </div>
        <ImageShow imgPath={imgPath} visible={imgShow} onClose={this.onClose} />
      </div>
    );
  }
}

export default CarCertificationNew;
