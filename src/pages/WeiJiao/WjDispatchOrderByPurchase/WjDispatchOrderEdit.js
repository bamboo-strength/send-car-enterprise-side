import { ImagePicker, List, NavBar, WhiteSpace, Button, Toast, Modal, Flex } from 'antd-mobile';
import React from 'react';
import { Form, Icon, Upload, Card, Col, message } from 'antd';
import router from 'umi/router';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { connect } from 'dva';
import func from '@/utils/Func';
import { getToken } from '@/utils/authority';


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

@connect(({ merDriver }) => ({
  merDriver,
}))
@Form.create()
class WjDispatchOrderEdit extends React.Component {
  state = {
    files: [],
    loading: false,
    imgloading: false,
    imageUrl1: '',
    imgShow: false,
    imgPath: '',
  };

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
          if (index === 1) {
            paramName = 'imageUrl1';
            files[0] = info.file.originFileObj;
          }
          this.setState({
            [paramName]: imageUrl,
            imgloading: false,
            files,
          });
        },
      );
    }
  };

  toAudit = () => {
    const { form, location } = this.props;
    const { files, loading, imageUrl1 } = this.state;
    if (loading) {
      return;
    }
    if ((func.isEmpty(files[0]))&& (func.isEmpty(imageUrl1))) {
      Toast.info('随货同行单为必传项');
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        const param = {
          ...values,
          id: location.state.id
        };
        const formData = new FormData();
        files.map(value => {
          formData.append('file', value);
          return value;
        });

        Object.keys(param).forEach(key => {
          formData.append(key, Array.isArray(param[key]) ? param[key].join(',') : param[key]);
        });
        const myToken = getToken();
        fetch('/api/mer-dispatch/dispatchbill/submitPreamountAndFiles', {
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
            Toast.info(data.msg);
            this.setState({
              loading: false,
            });
            if (data.success) {
              router.push('/dispatch/dispatchbillbyorder');
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
    });
  };

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
      message.error('只能上传图片');
      return false;
    }
    return isPic;
  };



  render() {
    const { form} = this.props;
    const { imageUrl1, loading, imgShow, imgPath, imgloading } = this.state;

    const uploadButton1 = (
      <div>
        <Icon type={imgloading ? 'imgloading' : 'plus'} />
        <div className="ant-upload-text"><span style={{ color: 'red' }}>* </span>随货同行单</div>
      </div>
    );


    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dispatch/dispatchbillbyorder')}
        >随货同行单
        </NavBar>
        <div className='am-list'>
          <Card title="上传随货同行单">
            <Flex style={{marginLeft: '100px'}}>
              <Flex.Item>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={(info) => this.handleChange(info, 1)}
                >
                  {imageUrl1 ?
                    <div>
                      <img src={imageUrl1} alt="avatar" style={{ width: '100%', height: '90px' }} />
                      <span
                        onClick={(e) => this.expandImg(e, imageUrl1)}
                        style={{ color: 'dodgerblue', fontSize: '12px' }}
                      >查看图片
                        </span>
                    </div>
                    : uploadButton1}
                </Upload>
              </Flex.Item>
            </Flex>
          </Card>
          <Card style={{ marginTop: 5 }}>
            <Col style={{ marginTop: 15 }}>
              <MatrixInput label="随货同行量" placeholder="请输入随货同行量" id="preamount" form={form} required numberType='isFloatGtZero' maxLength={6} />
            </Col>
          </Card>
          <Button
            type="primary"
            style={{ width: '90%', margin: '20px auto', lineHeight: '47px' }}
            onClick={this.toAudit}
            loading={loading}
          >
            提交
          </Button>
          <Modal
            className="imgCon"
            visible={imgShow}
            transparent
            maskClosable
            onClose={this.onClose}
            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          >
            <img style={{ width: '100%' }} src={imgPath} alt="" />
          </Modal>
        </div>
      </div>
    );
  }
}

export default WjDispatchOrderEdit;
