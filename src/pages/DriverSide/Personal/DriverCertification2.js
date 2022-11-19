import { List, NavBar, Button, Toast, Flex, Card as CardM, WhiteSpace, Modal } from 'antd-mobile';
import React from 'react';
import { Form, Icon, Upload, Card,message, Col, Row, Button as Button2 } from 'antd';
import router from 'umi/router';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { connect } from 'dva';
import func from '@/utils/Func';
import { getToken, getCurrentUser } from '@/utils/authority';
import { MERDRIVER_DETAIL } from '@/actions/merDriver';
import Text from 'antd/lib/typography/Text';
import { project } from '@/defaultSettings';
import ImageShow from '@/components/ImageShow/ImageShow';
import SignatureCanvas from 'react-signature-canvas';

const { Item } = List;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function  dataURItoBlob(dataurl){   // dataurl是base64格式
  const arr = dataurl.split(','); const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime,name:mime});
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
    w =w * quality ;
    h = h* quality;
    // 生成canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);

    // 回调函数返回base64的值
    const base64 = canvas.toDataURL('image/jpeg', quality);
    // debugger;
    callback(base64);
    // return base64
  }
}

@connect(({ merDriver }) => ({
  merDriver,
}))
@Form.create()
class DriverCertification2 extends React.Component {
  state = {
    files: [],
    loading: false,
    imgloading: false,
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    imageUrl4: '',
    imageUrl5: '', //从业资格证
    imgShow: false,
    imgPath: '',
    showSignatureModal:false,
    trimmedDataURL:''
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(MERDRIVER_DETAIL(getCurrentUser().userId)).then(() => {
      const { merDriver: { detail } } = this.props;
      let aa = [];
      if (func.notEmpty(detail) && func.notEmpty(detail.certificatesList)) {
        aa = detail.certificatesList;
        for(let i=0;i<aa.length;i+=1) {
          switch (aa[i].certificatesType)
          {
            case 1:
              switch (aa[i].cardSide){
                case 0:
                  this.setState({
                    imageUrl4: func.notEmpty(aa[i]) ? aa[i].imagePath : '',
                  });                  break;
                case 1:
                  this.setState({
                    imageUrl3: func.notEmpty(aa[i]) ? aa[i].imagePath : '',
                  });                  break;
              }
              break;
            case 3:
              switch (aa[i].cardSide){
                case 0:
                  this.setState({
                    imageUrl2: func.notEmpty(aa[i]) ? aa[i].imagePath : '',
                  });                  break;
                case 1:
                  this.setState({
                    imageUrl1: func.notEmpty(aa[i]) ? aa[i].imagePath : '',
                  });
                  break;
              }
              break;
            case 15:
              switch (aa[i].cardSide){
                case 2:
                  this.setState({
                    trimmedDataURL: func.notEmpty(aa[i]) ? aa[i].imagePath : '',
                  });
                  break;
              }
              break;
            case 16:
              switch (aa[i].cardSide){
                case 2:
                  this.setState({
                    imageUrl5: func.notEmpty(aa[i]) ? aa[i].imagePath : '',
                  });
                  break;
              }
              break;
          }
        }
        // this.setState({
        //   imageUrl1: func.notEmpty(aa[0]) ? aa[0].imagePath : '',
        //   imageUrl2: func.notEmpty(aa[1]) ? aa[1].imagePath : '',
        //   imageUrl3: func.notEmpty(aa[2]) ? aa[2].imagePath : '',
        //   imageUrl4: func.notEmpty(aa[3]) ? aa[3].imagePath : '',
        //   imageUrl5: func.notEmpty(aa[4]) ? aa[4].imagePath : '',
        //   trimmedDataURL:func.notEmpty(aa[5]) ? aa[5].imagePath : '',
        // });
        /*  detail.certificatesList.forEach(cer => {
            aa.push({url:cer.imagePath})
          });
          this.setState(
            {files:aa}
          ) */
      }
    });
  }

  handleChange = (info, index) => {
    // console.log(info,index,'----------info')
    const { files } = this.state;
    if (info.file.status === 'uploading') {
      this.setState({ imgloading: true });
      return;
    }
    if (info.file.status === 'done') {
      // if(index === 1){
      let paramName = '';
      getBase64(info.file.originFileObj, imageUrl => {
        dealImageCompression(imageUrl, 0.5,base64=>{
          const compressFile = dataURItoBlob(base64)
          if (index === 1) {
            paramName = 'imageUrl1';
            files[0] = compressFile;
          } else if (index === 2) {
            paramName = 'imageUrl2';
            files[1] = compressFile;
          } else if (index === 3) {
            paramName = 'imageUrl3';
            files[2] = compressFile;
          } else if (index === 4) {
            paramName = 'imageUrl4';
            files[3] = compressFile;
          } else if (index === 5) {
            paramName = 'imageUrl5';
            files[4] = compressFile;
          }
          this.setState({
            files,
            [paramName]: imageUrl,
            imgloading: false,
          });
        })
        },
      );
    }
  };

  toAudit = () => {
    const { form,merDriver: {detail} } = this.props;
    console.log('detail',detail);
    const { files, loading, imageUrl1, imageUrl2,trimmedDataURL } = this.state;
    if (loading) {
      return;
    }
    /* if(files.length !== 4){
       Toast.info('请按要求上传图片')
       return
     } */
    // console.log(files[0],files[1],files[2],files[3])
    if ((func.isEmpty(files[0]) || func.isEmpty(files[1])) && (func.isEmpty(imageUrl1) || func.isEmpty(imageUrl2))) {
      Toast.info('驾驶证件照为必传项');
      return;
    }

    if(!trimmedDataURL){
      Toast.info('请签名后，进行提交')
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        const param = {
          jszh: values.jszh,
          name: values.name,
          // regionId: values.regionId,
          id: JSON.stringify(detail) !== '{}' ? detail.id : '',
        };
        const formData = new FormData();
        // files.map(value => {
        //   formData.append('file', value);
        //   return value;
        // });
        if(files[0]!==undefined){
          formData.append('owner1_certificates3_cardSide1', files[0]);
        }if(files[1]!==undefined){
          formData.append('owner1_certificates3_cardSide0', files[1]);
        }if(files[2]!==undefined){
          formData.append('owner1_certificates1_cardSide1', files[2]);
        }if(files[3]!==undefined){
          formData.append('owner1_certificates1_cardSide0', files[3]);
        }if(files[4]!==undefined){
          formData.append('owner1_certificates16_cardSide2', files[4]);
        }

        if(!trimmedDataURL.includes('http')){
          formData.append('owner1_certificates15_cardSide2', dataURItoBlob(trimmedDataURL));
        }
        Object.keys(param).forEach(key => {
          formData.append(key, Array.isArray(param[key]) ? param[key].join(',') : param[key]);
        });
        const myToken = getToken();
        fetch('/api/mer-driver-vehicle/driver/submit', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic c3dvcmQ6c3dvcmRfc2VjcmV0',
            'Blade-Auth': myToken,
          },
          name: 'file',
          body: formData,
          mode: 'cors',
          cache: 'default',
        }).then(res => res.json())
          .then(data => {
            // Toast.info(data.msg);
            this.setState({
              loading: false,
            });
            if (data.success) {
              router.push('/driverSide/personal/personalCenter');
              message.success('操作成功')
            }
          });
      }
    });
  };

// 放大图片
  expandImg = (e, imgRul) => {
    // console.log(e)
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
      showSignatureModal:false,
      showSignatureImgModal:false
    });
  };

// *********  手写签名 ************//
  showSignatureModal=()=>{
    this.setState({
      showSignatureModal:true
    })
  }

  showSignatureImgModal=()=>{
    this.setState({
      showSignatureImgModal:true
    })

  }

  clear=()=>{
    this.sigCanvas.clear();
    this.setState({trimmedDataURL: ""});
  }

  save=()=>{
    this.setState({
      trimmedDataURL: this.sigCanvas.toDataURL("image/png",1),
      showSignatureModal:false,
    });
  }

  render() {
    const { form, merDriver: { detail } } = this.props;
    const { imageUrl1, imageUrl2, imageUrl3, imageUrl4,imageUrl5,loading, imgShow, imgPath, imgloading,
      showSignatureModal,showSignatureImgModal,trimmedDataURL} = this.state;
    const uploadButton1 = (
      <div>
        <Icon type={imgloading ? 'imgloading' : 'plus'} />
        <div className="ant-upload-text"><span style={{ color: 'red' }}>* </span> 驾驶证照</div>
      </div>
    );
    const uploadButton2 = (
      <div>
        <Icon type={imgloading ? 'imgloading' : 'plus'} />
        <div className="ant-upload-text"><span style={{ color: 'red' }}>* </span> 驾驶证照副页</div>
      </div>
    );
    const uploadButton3 = (
      <div>
        <Icon type={imgloading ? 'imgloading' : 'plus'} />
        <div className="ant-upload-text">身份证正面</div>
      </div>
    );
    const uploadButton4 = (
      <div>
        <Icon type={imgloading ? 'imgloading' : 'plus'} />
        <div className="ant-upload-text">身份证反面</div>
      </div>
    );
    const uploadButton5 = (
      <div>
        <Icon type={imgloading ? 'imgloading' : 'plus'} />
        <div className="ant-upload-text">从业资格证</div>
      </div>
    );
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={project==='wlhy'?() => router.push('/driverSide/personal/personalCenter')
          :
          () => router.push('/driverSide/personal/personalShipper')}
        >司机认证
        </NavBar>
        <div className='am-list'>
          <Card title="资质上传" actions={[<Text type="danger" style={{ fontSize: 12 }}>请依次上传身份证正反面、驾驶证照正副页</Text>]}>
            <Flex>
              <Flex.Item>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={(info) => this.handleChange(info, 1)}
                >
                  {imageUrl1 ?
                    <div>
                      <img src={imageUrl1} alt="avatar" style={{ width: '100%', height: '90px' }} />
                      <span
                        onClick={(e) => this.expandImg(e, imageUrl1)}
                        style={{ color: 'dodgerblue', fontSize: '12px' }}
                      >
                        驾驶证照
                        {/* <ImageShow imgPath={imgPath}>查看图片</ImageShow> */}
                      </span>
                    </div>
                    : uploadButton1}
                </Upload>
              </Flex.Item>
              <Flex.Item>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={(info) => this.handleChange(info, 2)}
                >
                  {imageUrl2 ?
                    <div>
                      <img src={imageUrl2} alt="avatar" style={{ width: '100%', height: '90px' }} />
                      <span
                        onClick={(e) => this.expandImg(e, imageUrl2)}
                        style={{ color: 'dodgerblue', fontSize: '12px' }}
                      >驾驶证照副页
                      </span>
                    </div>
                    : uploadButton2}
                </Upload>
              </Flex.Item>
            </Flex>
            <Flex>
              <Flex.Item>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={(info) => this.handleChange(info, 3)}
                >
                  {imageUrl3 ?
                    <div>
                      <img src={imageUrl3} alt="avatar" style={{ width: '100%', height: '90px' }} />
                      <span
                        onClick={(e) => this.expandImg(e, imageUrl3)}
                        style={{ color: 'dodgerblue', fontSize: '12px' }}
                      >身份证正面
                      </span>
                    </div>
                    : uploadButton3}
                </Upload>
              </Flex.Item>
              <Flex.Item>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={(info) => this.handleChange(info, 4)}
                >
                  {imageUrl4 ?
                    <div>
                      <img src={imageUrl4} alt="avatar" style={{ width: '100%', height: '90px' }} />
                      <span
                        onClick={(e) => this.expandImg(e, imageUrl4)}
                        style={{ color: 'dodgerblue', fontSize: '12px' }}
                      >身份证反面
                      </span>
                    </div>
                    : uploadButton4}
                </Upload>
              </Flex.Item>
            </Flex>
            <Flex>
              <Flex.Item>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={(info) => this.handleChange(info, 5)}
                >
                  {imageUrl5 ?
                    <div>
                      <img src={imageUrl5} alt="avatar" style={{ width: '100%', height: '90px' }} />
                      <span
                        onClick={(e) => this.expandImg(e, imageUrl5)}
                        style={{ color: 'dodgerblue', fontSize: '12px' }}
                      >从业资格证
                      </span>
                    </div>
                    : uploadButton5}
                </Upload>
              </Flex.Item>
              </Flex>
          </Card>
          <CardM>
            <CardM.Header
              title="司机信息"
            />
            <CardM.Body>
              <Col style={{ marginTop: 15 }}>
                <MatrixInput label="姓名" placeholder="请输入姓名" id="name" form={form} xs='5' required initialValue={detail.name} />
              </Col>
              <Col style={{ marginTop: 15 }}>
                <MatrixInput label="身份证" placeholder="请输入身份证号" id="jszh" xs='5' required form={form} numberType='isIdCardNo' initialValue={detail.jszh} />
              </Col>
            </CardM.Body>
            <WhiteSpace size="lg" />
            <CardM.Footer
              content={
                <Button2 type="primary" size='small' onClick={this.showSignatureModal}>
                  司机签名
                </Button2>}
              extra={
                <Button2 type="primary" size='small' onClick={this.showSignatureImgModal}>
                  查看签名
                </Button2>
              }
            />
          </CardM>
          <Button
            type="primary"
            style={{ width: '90%', margin: '20px auto', lineHeight: '47px' }}
            onClick={this.toAudit}
            loading={loading}
          >
            提交审核
          </Button>
          <List className='static-list'>
            <Item wrap>请上传本人真实信息，该信息只用于核实您的身份，不会出现泄漏，请放心上传；</Item>
          {/*  <Item>2、客服电话：xxx-xxx-xxxx</Item> */}
          </List>
          <ImageShow imgPath={imgPath} visible={imgShow} onClose={this.onClose} />
          <Modal
            popup
            visible={showSignatureModal}
            onClose={this.onClose}
            animationType="slide-up"
          >
            <CardM>
              <CardM.Header
                title="司机本人签名"
                extra={<span style={{fontSize:'12px'}}>请使用简体中文</span>}
              />
              <CardM.Body>
                <SignatureCanvas penColor="green" canvasProps={{"width": "400", "height": "350"}} ref={(ref) => { this.sigCanvas = ref }} />
              </CardM.Body>
              <CardM.Footer
                content={
                  <Button2 type='primary' onClick={this.clear}>
                    重置
                  </Button2>
                }
                extra={
                  <Button2 type='primary' onClick={this.save}>
                    保存
                  </Button2>
                }
              />
            </CardM>
          </Modal>
          <Modal
            visible={showSignatureImgModal}
            transparent
            maskClosable
            onClose={this.onClose}
          >
            <img style={{width:'240px',height: "200px","backgroundColor": "#ECF5F6"}} src={trimmedDataURL} />
          </Modal>
        </div>
      </div>
    );
  }
}

export default DriverCertification2;
