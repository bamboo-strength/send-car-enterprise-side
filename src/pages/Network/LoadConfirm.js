import { NavBar, Button, Toast, Flex } from 'antd-mobile';
import React from 'react';
import { Col, Form, Icon, Upload, List, Card } from 'antd';
import router from 'umi/router';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { connect } from 'dva';
import func from '@/utils/Func';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import Text from 'antd/es/typography/Text';
import { getNewData, gpsopenflag, submitLocation } from '@/services/locus';
import moment from 'moment';
import { detail, submitLoad, submitSign,getShippingNoteInfos,androidNotify,saveNotify} from '@/services/FreightServices';
import ImageShow from '@/components/ImageShow/ImageShow';
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
var params1={}
var Files={}
window.returntest = function() {
  return `${localStorage.getItem('deviceno')},${  localStorage.getItem('truckno')  },${  localStorage.getItem('rememberPwd')}`;
};
window.Loading = function(code,msg,success) {
  if(success==1){
    loading(params1,Files);
    TimerTask.startTimerTask();
  } else {
    // androidNotify({id:id,error_message:msg})
    router.push(`/network/waybill`);
    Toast.fail(msg)
  }
  // if(success==1){
  //   loading(params1,Files);
  //   TimerTask.startTimerTask();
  // }else {
  //   androidNotify({id:id,error_message:msg})
  //   router.push(`/network/waybill`);
  //   Toast.fail(msg)
  // }
  return 1;
};
window.saveNotify = function(param){
  const params={
    waybillId:param.split(",")[0],
    vehicleno:param.split(",")[1],
    longitude:param.split(",")[2],
    latitude:param.split(",")[3],
    sdkflag:param.split(",")[4],
    flag:param.split(",")[5],
    intervalTime:param.split(",")[6],
    errorMsg:param.split(",")[7],
    remark:param.split(",")[8]
  }
  saveNotify(params)
  return 3;
}

window.unLoading = function(code,msg,success) {
  if(success==1){
    unloading(params1,Files);
    TimerTask.stopTimerTask();
  }else {
    // androidNotify({id:id,error_message:msg})
    router.push(`/network/waybill`);
    Toast.fail(msg)
  }
  // if(success==1){
  //   unloading(params1,Files);
  //   TimerTask.stopTimerTask();
  // }else {
  //   androidNotify({id:id,error_message:msg})
  //   router.push(`/network/waybill`);
  //   Toast.fail(msg)
  // }
  return 2;
};

function loading(param,realFiles){
  const location = Location.getLocation();
  // const state = LocationStatus.getLocationStatus();
  const params = {
    longitude: JSON.stringify(JSON.parse(location).longitude),
    latitude: JSON.stringify(JSON.parse(location).latitude),
    address: JSON.stringify(JSON.parse(location).address).replace('"', '').replace('"', ''),
  };
  // alert(location)
  // if (JSON.stringify(JSON.parse(state)) === 'false') {
  //   Toast.offline('请检查定位开启状态！！');
  // } else
  //   if (params.longitude !== '0') {
  sendLocal(params);
  const shipAddressCoordinate = `${params.longitude},${params.latitude}`;
  submitLoading(param, realFiles, shipAddressCoordinate);
  // }
};

function unloading(param,realFiles){
  const location = Location.getLocation();
  // const state = LocationStatus.getLocationStatus();
  const params = {
    longitude: JSON.stringify(JSON.parse(location).longitude),
    latitude: JSON.stringify(JSON.parse(location).latitude),
    address: JSON.stringify(JSON.parse(location).address).replace('"', '').replace('"', ''),
  };
  // alert(location)
  // if (JSON.stringify(JSON.parse(state)) === 'false') {
  //   Toast.offline('请检查定位开启状态！！');
  // } else
  //   if (params.longitude !== '0') {
  sendLocal(params);
  const receiveAddressCoordinate = `${params.longitude},${params.latitude}`;
  submitSigning(param, realFiles, receiveAddressCoordinate);
  // }
};

function submitLoading(param, realFiles, value){
  submitLoad({ ...param, ...realFiles, shipAddressCoordinate: value }).then(resp => {
    // this.setState({
    //   loading: false,
    // });
    if (resp.success) {
      Toast.success('装货成功');
      router.push('/network/waybill');
      localStorage.setItem('load', 2);
    }
  });
};

function submitSigning(param, realFiles, value){
  submitSign({ ...param, ...realFiles, receiveAddressCoordinate: value }).then(resp => {
    // this.setState({
    //   loading: false,
    // });
    if (resp.success) {
      Toast.success('卸货成功');
      router.push('/network/waybill');
      localStorage.setItem('load', 2);
    }
  });
};

function sendLocal(result){
  const { longitude, latitude, address } = result;
  // const { rowData } = this.state;
  const rowData={
    driverPhone:localStorage.getItem('deviceno'),
    vehicleno:localStorage.getItem('truckno')
  }
  if (rowData.driverPhone !== undefined) {
    submitLocation({
      deviceno: rowData.vehicleno,
      truckno: rowData.vehicleno,
      loadAddr: address,
      longitude,
      latitude,
      gpstime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    }).then(() => {
      // console.log('上传');
      // alert('上传成功')
    });
  }
};


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
    w =  w * quality;
    h = h * quality ;
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

@connect(({ merDriver, tableExtend }) => ({
  merDriver,
  tableExtend,
}))
@Form.create()
class LoadConfirm extends React.Component {
  constructor(props) {
    super(props);
    const { location } = props;
    let aa = [];
    switch (location.state.type) {
      case 'submitLoad':
        aa = [{ columnAlias: '发货单', columnName: 'file1', isrequired: 1 }];
        break;
      case 'submitSign':
        aa = [{ columnAlias: '签收单', columnName: 'file2', isrequired: 1 }];
        break;
      case 'submitAgainLoad':
        aa = [{ columnAlias: '发货单', columnName: 'file1', isrequired: 1 }];
        break;
      case 'submitAgainSign':
        aa = [{ columnAlias: '签收单', columnName: 'file2', isrequired: 1 }];
        break;
      default:
        console.log('没找到值');
    }
    this.state = {
      //   files: [],
      loading: false,
      imgloading: false,
      imgShow: false,
      imgPath: '',
      imageUrls: {},
      realFiles: {},
      showColumsImg: aa,
      title: '',
      imageFile: {},
      detailData: {},
      rowData: location.state.rowData,
    };
    this.timer = null;
  }

  componentWillMount() {
    const { match: { params: { id } }, location } = this.props;
    detail({ id }).then(resp => {
      let title = '';
      let imageFile = {};
      switch (location.state.type) {
        case 'submitLoad':
          title = '确认';
          break;
        case 'submitSign':
          title = '卸货确认';
          break;
        case 'submitAgainLoad':
          title = '重新上传装货信息';
          imageFile = resp.data.freightPictureList[0];
          break;
        case 'submitAgainSign':
          title = '重新上传卸货信息';
          imageFile = resp.data.freightPictureList[1];
          break;
        default:
          console.log('没找到值！');
      }
      this.setState({
        detailData: resp.data,
        imageFile,
        title,
      });
    });
    localStorage.setItem('deviceno', location.state.rowData.driverPhone);
    localStorage.setItem('truckno', location.state.rowData.vehicleno);
  }



  handleChange = (info, item) => {
    const {imageUrls, realFiles } = this.state;
    if (info.file.status === 'uploading') {
      this.setState({ imgloading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
          dealImageCompression(imageUrl, 0.5,base64=>{
            imageUrls[item.columnName] = base64
            realFiles[item.columnName] = dataURItoBlob(base64)
            this.setState({
              imageUrls,
              imgloading: false,
              realFiles
            })
          })
        },
      );
    }
  };

  toAudit = () => {
    const { form, match: { params: { id } }, location, dispatch } = this.props;
    const { realFiles, loading, showColumsImg, imageUrls, rowData } = this.state;
    if (loading) {
      return;
    }
    // 验证图片
    let flag = true;
    if (location.state.type === 'submitLoad' || location.state.type === 'submitSign') {
      for (const index in showColumsImg) {
        const item = showColumsImg[index];
        if (item.isrequired === 1 && func.isEmpty(imageUrls[item.columnName])) {
          Toast.info(`${item.columnAlias}为必传项`);
          flag = false;
          break;
        }
      }
    }

    if (!flag) {
      return;
    }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const param = values;
        param.id = id;
        params1=param
        Files=realFiles
        if (location.state.type === 'submitLoad' || location.state.type === 'submitAgainLoad') {
          // 查询是否开启定位信息
          /* 装货确认 */
          // this.record3()
          // 调用定时器，每隔10秒钟获取一次，安卓外壳的坐标信息
          // const state = LocationStatus.getLocationStatus();
          // if (JSON.stringify(JSON.parse(state)) === 'false') {
          //   Toast.offline('请检查定位开启状态！！');
          // } else {
          this.setState({
            loading: true,
          });
          // this.Loading(param,realFiles);
          getShippingNoteInfos({id:id}).then((res)=>{
            if(res.success){
              const remark = res.data.remark
                delete res.data.remark
              TrajectoryMonitoring.startMonitoring(JSON.stringify(res.data),remark)
            }
          })
          // TrajectoryMonitoring.startMonitoring(localStorage.getItem('shippingnoteinfos'))
          // TimerTask.startTimerTask();
          // timer3 = setInterval(() => this.record3(), 10000);
          // getNewData({ deviceno: rowData.vehicleno, truckno: rowData.vehicleno }).then(resp => {
          //   if (resp.success) {
          //     const { longitude } = resp.data[0];
          //     const { latitude } = resp.data[0];
          //     shipAddressCoordinate = `${longitude},${latitude}`;
          //     // 将填入的信息、图片、获取出来的实时位置，传给后台
          //     this.submitLoad(param, realFiles, shipAddressCoordinate);
          //   }
          // });
          // }
        } else if (location.state.type === 'submitSign' || location.state.type === 'submitAgainSign') {
          /* 卸货确认 */
          // const state = LocationStatus.getLocationStatus();
          // if (JSON.stringify(JSON.parse(state)) === 'false') {
          //   alert('请检查定位开启状态！');
          // } else {
          this.setState({
            loading: true,
          });
          getShippingNoteInfos({id:id}).then((res)=>{
            if(res.success){
              const remark = res.data.remark
              delete res.data.remark
              TrajectoryMonitoring.endMonitoring(JSON.stringify(res.data),remark)
            }
          })
          // TrajectoryMonitoring.endMonitoring(localStorage.getItem('shippingnoteinfos'))

          // 开启gps定位信息
          // this.getLocation();
          // this.unLoading(param,realFiles);
          // timer3 = setInterval(() => this.record3(), 30000);
          // 获取物流部存储的安卓外壳实时传入的坐标信息
          // getNewData({ deviceno: rowData.vehicleno, truckno: rowData.vehicleno }).then(resp => {
          //   if (resp.success) {
          //     const { longitude } = resp.data[0];
          //     const { latitude } = resp.data[0];
          //     receiveAddressCoordinate = `${longitude},${latitude}`;
          //     // 将填入的信息、图片、获取出来的实时位置，传给后台
          //     this.submitSign(param, realFiles, receiveAddressCoordinate);
          //   }
          // });
          // clearInterval(timer3);
          // }
        }
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

  goReturn = () => {
    router.push(`/network/waybill`);
    localStorage.setItem('load', 2);
  };

  render() {
    const { form, location } = this.props;
    const { loading, imgShow, imgPath, imgloading, showColumsImg, imageUrls, title, detailData, imageFile } = this.state;
    return (
      <div id={NetWorkLess.netWork}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={this.goReturn}
        >
          {title}
        </NavBar>
        <div className='am-list networkDetail'>
          <List className='networkList'>
            <Flex justify='space-between' style={{ padding: '10px 0' }}>
              <div style={{ width: '95%' }}>
                {location.state.type === 'submitLoad' ?
                  <MatrixInput label="装载量" placeholder="请输入装载量" id="loadAmount" maxLength={15} numberType='isFloatGtZero' initialValue={detailData.carryAmount} form={form} xs='5' required realbit={2} />
                  : location.state.type === 'submitSign' ?
                    <MatrixInput label="签收量" placeholder="请输入签收量" id="signAmount" numberType='isFloatGtZero' maxLength={15} initialValue={detailData.carryAmount} form={form} xs='5' realbit={2} required />
                    : location.state.type === 'submitAgainSign' ?
                      <MatrixInput label="签收量" placeholder="请输入签收量" id="signAmount" maxLength={15} numberType='isFloatGtZero' initialValue={detailData.signAmount} form={form} xs='5' required realbit={2} />
                      : <MatrixInput label="装载量" placeholder="请输入装载量" id="loadAmount" maxLength={15} numberType='isFloatGtZero' initialValue={detailData.loadAmount} form={form} xs='5' required realbit={2} />
                }
              </div>
              吨
            </Flex>

          </List>
          <Card style={{ marginBottom: '2%' }} bordered={false}>
            {
              showColumsImg.map(item => {
                return (
                  <Col span={12}>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      onChange={(info) => this.handleChange(info, item)}
                    >
                      {imageUrls[item.columnName] ?
                        <div>
                          <img src={imageUrls[item.columnName]} alt="avatar" style={{ width: '100%', height: '90px' }} />
                          <span
                            onClick={(e) => this.expandImg(e, imageUrls[item.columnName])}
                            style={{ color: 'dodgerblue', fontSize: '12px' }}
                          >查看图片
                          </span>
                        </div>
                        :
                        <div>
                          {
                            imageFile.picturePath ?
                              <div>
                                <img
                                  src={imageFile.picturePath}
                                  alt="avatar"
                                  style={{ width: '100%', height: '90px' }}
                                />
                                <span
                                  onClick={(e) => this.expandImg(e, imageFile.picturePath)}
                                  style={{ color: 'dodgerblue', fontSize: '12px' }}
                                >查看图片
                                </span>
                              </div> :
                              <div>
                                <Icon type={imgloading ? 'imgloading' : 'plus'} />
                                <div className="ant-upload-text">{item.isrequired === 1 ?
                                  <span style={{ color: 'red' }}>* </span> : ''}{item.columnAlias}
                                </div>
                              </div>
                          }
                        </div>
                      }
                    </Upload>
                  </Col>
                );
              })
            }
          </Card>
          <Card className='networkDetailCard'>
            <Text type="danger">提示:装载/签收量请输入纯数字</Text>
            <Button
              type="primary"
              style={{ width: '100%', margin: '20px auto', lineHeight: '47px' }}
              onClick={this.toAudit}
              loading={loading}
            >
              提交
            </Button>
          </Card>
          <ImageShow imgPath={imgPath} visible={imgShow} onClose={this.onClose} />
        </div>
      </div>
    );
  }
}

export default LoadConfirm;
