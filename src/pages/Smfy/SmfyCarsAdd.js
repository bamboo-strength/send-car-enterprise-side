import {Card, List, NavBar, WhiteSpace, Button, Toast, Modal} from 'antd-mobile';
import { Form, Upload, Icon, Col, Row } from 'antd';
import React from 'react';
import router from 'umi/router';
import MatrixInput from '@/components/Matrix/MatrixInput';
import MatrixSelect from '@/components/Matrix/MatrixSelect';
import { connect } from 'dva';
import func from '@/utils/Func';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import { requestApi } from '@/services/api';
import {detailByVehicleId} from '@/services/merDriver'

const { Item } = List;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

@connect(({ merVehicle, tableExtend,loading }) => ({
  merVehicle,
  tableExtend,
  loading: loading.models.merVehicle,
}))
@Form.create()
class SmfyCarsAdd extends React.Component {
  state = {
    //  files: [],
    loading: false,
    imgloading: false,
    imgShow: false,
    imgPath: '',
    showColumsText:[],
    showColumsImg:[],
    imageUrls:{},
    realFiles:{},
    detail:{}
  };

  componentWillMount() {
    const {dispatch,location} = this.props
    const {imageUrls} = this.state
    dispatch(TABLEEXTEND_COLUMNLIST({'tableName': 'smfy_vehicle','modulename':'smfyVehicle',queryType:1})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined && func.notEmpty(data.columList)) {
        const aa=data.columList;
        const showColumsText = aa.table_main.filter(item=>item.category !== 7)
        const showColumsImg = aa.table_main.filter(item=>item.category === 7)
        // 车辆详情
        if(location.state && location.state.truckId){
          detailByVehicleId({id:location.state.truckId}).then(resp=>{
            const detail = resp.data
            if(func.notEmpty(detail) && func.notEmpty(detail.certificatesList)){
              showColumsImg.map((column,index)=>{
                imageUrls[column.columnName] =  func.notEmpty(detail.certificatesList[index])?detail.certificatesList[index].imagePath:''
              })
              this.setState({
                showColumsText,
                showColumsImg,
                imageUrls,
                detail
              })
            }
          })
        }else {
          this.setState({
            showColumsText,
            showColumsImg,
          })
        }

      }
    })
  }

  handleChange = (info, item) => {
    const { imageUrls ,realFiles} = this.state;
    if (info.file.status === 'uploading') {
      this.setState({ imgloading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
          imageUrls[item.columnName] = imageUrl
          // files.push(info.file.originFileObj)
          realFiles[item.columnName] = info.file.originFileObj
          this.setState({
            imageUrls,
            imgloading: false,
            //  files,
            realFiles
          });
        },
      );
    }
  };

  toAudit = () => {
    const {  form } = this.props;
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
        };
        requestApi('/api/mer-driver-vehicle/vehicleCertification/submit', {...param,...realFiles}).then(data => {
          // Toast.info(data.msg);
          this.setState({
            loading: false,
          });
          if (data.success) {
            alert('提交成功', '再来一车？', [
              { text: '取消', onPress: () => router.push(`/driverSide/personal/personalCenter`) },
              {
                text: '好的',
                onPress: () =>{
                  form.resetFields() // 清空车号或车辆相关信息
                }
              },
            ])
          }
        });
      }
    });
  };

  // 放大图片
  expandImg = (e, imgRul) => {
    //  console.log(e)
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

  render() {
    const { form } = this.props;
    const { showColumsText,showColumsImg,imageUrls, loading, imgShow, imgPath,imgloading,detail} = this.state;
    const iteams=getEditConf(showColumsText,form,detail,{});
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/driverSide/personal/myCars')}
        >车辆认证
        </NavBar>
        <div className='am-list'>
          <Card>
            <Card.Header
              title="证件上传"
              extra={<span style={{ fontSize: '12px' }}>单位（吨）</span>}
            />
            <Card.Body>
              <Row gutter={24}>
                {
                  showColumsImg.map(item => (
                    <Col span={12}>
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        // beforeUpload={beforeUpload}
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
                            <Icon type={imgloading ? 'imgloading' : 'plus'} />
                            <div className="ant-upload-text">{item.isrequired === 1?<span style={{color:'red'}}>* </span>:''}{item.columnAlias}</div>
                          </div>}
                      </Upload>
                    </Col>
                  ))
                }
              </Row>
            </Card.Body>
            <Card.Footer style={{ fontSize: '10px', color: 'red' }} content="请依次上传证件(单文件最大2MB)"/>
            <List className='static-list'>
              <WhiteSpace size="xl" />
              {
                showColumsText.length>0?iteams:
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
              }

            </List>
          </Card>
          <Button type="primary" style={{ width: '50%', margin: '20px auto' }} onClick={this.toAudit} loading={loading}>
            提交
          </Button>
        </div>
        <Modal
          className="imgCon"
          visible={imgShow}
          transparent
          maskClosable
          onClose={this.onClose}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <img style={{ width: '100%' }} src={imgPath} alt=""/>
        </Modal>
      </div>
    );
  }
}

export default SmfyCarsAdd;
