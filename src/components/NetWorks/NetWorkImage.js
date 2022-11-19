import React,{PureComponent} from "react";
import { Upload, Icon, message, } from "antd";
import Text from "antd/lib/typography/Text";
import NetWork from "@/components/NetWorks/NetWork.less";
import ImageShow from "@/components/ImageShow/ImageShow";
import { photoUpload, uploadCertificates } from '@/services/maintenance';
import styles from '@/global.less';
import { Toast } from 'antd-mobile';
import { ImagePhotoUpload } from '@/components/Matrix/image';


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function dealImageCompression(path, obj,callback){
  const img = new Image();
  img.src = path;
  img.onload = ()=> {
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
    w = w > 500 ? w * quality : w;
    h = w > 500 ? w / scale : h;
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

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传JPG/PNG格式的文件!');
  }
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    message.error('图片大小不能超过50M!');
  }

  return isJpgOrPng && isLt50M;
}

export default class NetWorkImage extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imgShow: false,
      imgPath: '',
    };
  }


  handleChange = (info) => {
    if((info.file.type === 'image/jpeg' || info.file.type === 'image/png')){
      this.setState({ loading: true }); // 确定是图片类型时再loading
    }
  };

  /* 图片放大事件 */
  expandImg = (e,url)=>{
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      imgPath: url,
      imgShow: true,
    });
  }

  onSuccess = (response,file)=>{
    let {imageUrl} = this.state
    const {form,id,upload} = this.props
    getBase64(file, imageUrls => {
        Toast.loading('图片上传中，请等待！',0);
        dealImageCompression(imageUrls, 0.5, base64 => {
          imageUrl = base64;
          if (upload) { // 区分东平上传地址
              uploadCertificates({ file: dataURItoBlob(base64) }).then(resp => {
                Toast.hide()
                form.setFieldsValue({
                  [id]: resp.data,
                });
              });
          } else {
            photoUpload({ file: dataURItoBlob(base64) }).then(resp => {
              Toast.hide()
              form.setFieldsValue({
                [id]: resp.data,
              });
            });
          }
          this.setState({
            imageUrl,
            loading: false,
          });
        });
      }
    );
  }

  handleCancel = () => this.setState({ imgShow: false});

  render() {
    const {label,id,required,form,prompt,disabled,url,thumbUrl,labelNumber,labelNone,className,extra,breakSpaces} = this.props
    const {loading,imageUrl,imgPath,imgShow,} = this.state
    const { getFieldDecorator,getFieldError } = form
    const uploadButton = (
      <div className='uploadDiv'>
        <div className={NetWork.matrixUploadImage}>
          {loading?<Icon type='loading' className='uploadIcon' style={{position: 'absolute',fontSize:'40px'}} />:undefined}
          <img src={thumbUrl || ImagePhotoUpload} alt='' />
        </div>
      </div>
    );
    return (
      <div style={{ position: 'relative' }} className={`${className}`}>
        <div className={`${NetWork.NetWorkImage} am-list-item`} style={{height:'auto !important'}}>
          {
            !labelNone && <div className={`am-input-label am-input-label-${labelNumber}`} style={{whiteSpace: breakSpaces?'break-spaces':'nowrap'}}>{required ? <span style={{color:'red'}}>*</span>:''} {label}：</div>
          }
          {getFieldDecorator(id, {
            rules: [
              {
                required,
                message: `${label}不能为空`,
              },
            ],
            initialValue:url
          })
          (
            <Upload
              name="picsFront"
              listType="picture-card"
              className="avatar-uploader uploadImage"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={(info) => this.handleChange(info)}
              onSuccess={(response,file)=>this.onSuccess(response,file,)}
              disabled={disabled}
              accept="image/*"
              capture="camera"
              openFileDialogOnClick={!loading}
            >
              {imageUrl ? (  // 修改图片时 默认展示图片
                <div className='uploadDiv'>
                  <img src={imageUrl} alt="avatar" onClick={(e) => this.expandImg(e, imageUrl)} />
                  <div className="ant-upload-text">修改图片</div>
                </div>
              ):url ?( // 上传图片时 判断是否在上传
                loading?uploadButton:
                <div className='uploadDiv'>
                  <img src={url} alt="avatar" className={disabled?'ImagePointer':undefined} onClick={(e) => this.expandImg(e, url)} />
                  {
                      disabled?<div className="ant-upload-text ImagePointer" onClick={(e) => this.expandImg(e, url)}>查看图片</div>:
                      <div className="ant-upload-text">修改图片</div>
                    }
                </div>
              ):uploadButton}
            </Upload>
          )}
          {extra && <p style={{width: '31%'}}><span style={{color:'red'}}>*</span> {extra}</p>}
          {
            prompt?<Text> {message || `请上传一张${label}，要求照片清晰！`} </Text>:undefined
          }

          <ImageShow imgPath={imgPath} visible={imgShow} onClose={this.handleCancel} />
        </div>
        {
          !!getFieldError(id) === true && <div className={`am-list-item ${styles.errorlistItem}`}><div className={`am-input-label am-input-label-${labelNumber}`} /> {getFieldError(id)}</div>
        }
      </div>
    );
  }
}
