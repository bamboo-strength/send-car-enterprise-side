import { List, NavBar, Button, Toast, Flex } from 'antd-mobile';
import React from 'react';
import { Form, Icon, Upload, Card, Col, Row, AutoComplete } from 'antd';
import router from 'umi/router';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { connect } from 'dva';
import func from '@/utils/Func';
import { MERDRIVER_DETAIL } from '@/actions/merDriver';
import { getToken, getCurrentUser } from '@/utils/authority';
import Text from 'antd/lib/typography/Text';
import MatrixSSQ from'@/components/Matrix/MatrixSSQ';
import { project } from '@/defaultSettings';
import ImageShow from '@/components/ImageShow/ImageShow';
import { detailForDriver,submit } from '@/services/wallet';
import {getCardBin} from "@/services/mybankcard";

const { Item } = List;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

@connect(({ merDriver }) => ({
  merDriver,
}))
@Form.create()
class OpenWallet extends React.Component {
  state = {
    files: [],
    realFiles:{},
    loading: false,
    imgloading: false,
    imageUrl1: '',
    imageUrl2: '',
    imgShow: false,
    imgPath: '',
    data:{},
    bankCardType:'',
    bankName:'',
    bankCode:'',
    regionName: '',
    city: '',
  };

  componentWillMount() {
    const{dispatch,location}=this.props
      detailForDriver().then((resp)=>{
        if(resp.success) {
          if(location.state.type === 0){
            this.setState({
              data:resp.data,
              regionName: resp.data.regionName,
              city: resp.data.district,
            });
        }else{
            this.setState({
              data: resp.data,
              bankName: resp.data.bankName,
              bankCode: resp.data.bankCode,
              bankCardType: resp.data.bankCardType,
              regionName: resp.data.regionName,
              city: resp.data.district,
            });
          }
        }
      })
    dispatch(MERDRIVER_DETAIL(getCurrentUser().userId)).then(() => {
      const { merDriver: { detail } } = this.props;
      let aa = [];
      if (func.notEmpty(detail) && func.notEmpty(detail.certificatesList)) {
        aa = detail.certificatesList;
        aa.map((item, index) => {
          if(item.certificatesType==1){
            if(item.cardSide==1){
              this.setState({
                imageUrl1: item.imagePath,
              });
            }else if(item.cardSide==0){
              this.setState({
                imageUrl2: item.imagePath,
              });
            }
          }
        })

        //   this.setState({
        //   imageUrl1: func.notEmpty(aa[2]) ? aa[2].cardSide==1?aa[2].imagePath : aa[3].imagePath:'',
        //   imageUrl2: func.notEmpty(aa[3]) ? aa[3].cardSide==0?aa[3].imagePath : aa[2].imagePath:'',
        // });
      }
    });

  }

  handleChange = (info, index) => {
    // console.log(info,index,'----------info')
    const { files,realFiles } = this.state;
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
            realFiles.owner1_certificates1_cardSide1 = info.file.originFileObj
          } else if (index === 2) {
            paramName = 'imageUrl2';
            files[1] = info.file.originFileObj;
            realFiles.owner1_certificates1_cardSide2 = info.file.originFileObj
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
    const { form,location } = this.props;
    const { files, loading, imageUrl1, imageUrl2,bankName,bankCode,bankCardType,data,city} = this.state;
    if (loading) {
      return;
    }
    /* if(files.length !== 4){
       Toast.info('请按要求上传图片')
       return
     } */
    // console.log(files[0],files[1],files[2],files[3])
    if ((func.isEmpty(files[0]) || func.isEmpty(files[1])) && (func.isEmpty(imageUrl1) || func.isEmpty(imageUrl2))) {
      Toast.info('身份证为必传项');
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        const param = {
          accountNo:values.accountNo,
          jszh: values.jszh,
          name: values.name,
          phoneNo:values.phoneNo,
          regionfullName:values.regionfullName,
          regionId: values.regionId===''?city:values.regionId,
          bankName:bankName,
          bankCode:bankCode,
          bankCardType:bankCardType
          // id: JSON.stringify(detail) !== '{}' ? detail.id : '',
        };
        const formData = new FormData();
        // files.map(value => {
        //   formData.append('file', value);
        //   return value;
        // });
        // formData.append('owner1_certificates1_cardSide1', files[0]);
        // formData.append('owner1_certificates1_cardSide0', files[1]);
        Object.keys(param).forEach(key => {
          formData.append(key, Array.isArray(param[key]) ? param[key].join(',') : param[key]);
        });
        const myToken = getToken();
        let openaccount=''
        if(location.state.type===0){
          openaccount='/api/fre-yeepay-wallet/openaccountapplication/driverOpenAccount'
        }else if(location.state.type===2)
        {
          openaccount='/api/fre-yeepay-wallet/openaccountapplication/updateDriverOpenAccount'
        }
        fetch(openaccount, {
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
            this.setState({
              loading: false,
            });
            if (data.success) {
              Toast.info(data.msg);
              router.push('/driverSide/personal/personalCenter');
            }else{
              Toast.info(data.msg);
            }
          });
      }
    });
  };

  handleSearchtest = (value) => {
    this.setState({ result: [] });
    const { dataType, id,form} = this.props;
    if (func.notEmpty(value)) {
      getCardBin({ accountNo:value }).then(resp => {
        if (func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
          this.setState({
            bankCardType:resp.data.bankCardType,
            bankName:resp.data.bankName,
            bankCode:resp.data.bankCode
          });
        } else {
          console.log('拼音码无返回值/检查参数是否正确');
        }
      });
      // }
    } else {
      // 显示值为空时 同时去掉隐藏域的值
      form.setFieldsValue({
        [id]: '',
      });
    }
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

  render() {
    const { form, merDriver: { detail },location } = this.props;
    const { imageUrl1, imageUrl2, loading, imgShow, imgPath, imgloading,data,bankName,city,regionName } = this.state;
    console.log(location.state.type);
    console.log(data);
    console.log(regionName);
    const FormItem = Form.Item;
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
      },
    };
    const uploadButton1 = (
      <div>
        <Icon type={imgloading ? 'imgloading' : 'plus'} />
        <div className="ant-upload-text">身份证正面</div>
      </div>
    );
    const uploadButton2 = (
      <div>
        <Icon type={imgloading ? 'imgloading' : 'plus'} />
        <div className="ant-upload-text">身份证反面</div>
      </div>
    );
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={
            () => router.push('/wallet/wallet')}
        >申请钱包开通
        </NavBar>
        <div className='am-list'>
          <Card  style={{ marginTop: 5 }}>
            <Item><MatrixInput label="姓名" placeholder="请输入姓名" id="name" form={form} disabled required initialValue={detail.name} /></Item>
            <Item><MatrixInput label="身份证" placeholder="请输入身份证号" id="jszh" disabled required form={form} numberType='isIdCardNo' initialValue={detail.jszh} /></Item>
            身份信息：
            <Flex>
              <div>&nbsp;&nbsp;</div>
              <Flex>
              <Flex.Item>
                    <div>
                      <img src={imageUrl1} alt="avatar" style={{ width: '100%', height: '90px' }} />
                      <span
                        onClick={(e) => this.expandImg(e, imageUrl1)}
                        style={{ color: 'dodgerblue', fontSize: '12px' ,align:'center'}}

                      >
                        查看身份证正面
                        {/* <ImageShow imgPath={imgPath}>查看图片</ImageShow> */}
                      </span>
                    </div>
              </Flex.Item>
                <Flex.Item>
                  <div>
                    <img src={imageUrl2} alt="avatar" style={{ width: '100%', height: '90px' }} />
                    <span
                      onClick={(e) => this.expandImg(e, imageUrl2)}
                      style={{ color: 'dodgerblue', fontSize: '12px',align:'center' }}
                    >
                      查看身份证反面
                    </span>
                  </div>
                </Flex.Item>
              </Flex>

            </Flex>
            <Item><MatrixInput label="手机号" placeholder="请输入手机号" id="phoneNo" numberType='isMobile' disabled={location.state.type === 1} form={form} required initialValue={detail.phone}/></Item>
            <Item><MatrixSSQ label="所在地" id="regionId" required labelId="regionName" placeholder='请输入所在地区' disabled={location.state.type === 1}
                                  defaultValue={location.state.type !== 0?data.regionName:regionName} needDistrict
                                  // defaultCodeValue={location.state.type === 0?data.city:city}
                                  form={form} style={{ width: '100%' }}/></Item>
            <Item><MatrixInput label="详细地址" placeholder="请输入详细地址" id="regionfullName" form={form} disabled={location.state.type === 1} required
                               initialValue={location.state.type !== 0?data.address:''}/></Item>
            <Item >
              <FormItem {...formItemLayout} label='银行卡号'>
                {getFieldDecorator('accountNo',{
                  rules: [
                    {
                      required:true,
                      message: "不能为空",
                    },
                    {
                      pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                      message: '前后禁止输入空格',
                    },
                  ],
                  initialValue:location.state.type !== 0?data.bankCardNo:''
                  }
                )(
                  <AutoComplete
                    onSearch={this.handleSearchtest}
                    placeholder='请输入银行卡号'
                    allowClear
                    disabled={location.state.type === 1}
                  >
                  </AutoComplete>)}
              </FormItem>
            </Item>
            <Item><MatrixInput label="银行名称" placeholder="请输入银行名称" initialValue={bankName} disabled required id="bankName" form={form}  /></Item>

          </Card>
          {
            location.state.type!==1?
            <Button
              type="primary"
              style={{ width: '90%', margin: '20px auto', lineHeight: '47px' }}
              onClick={this.toAudit}
              loading={loading}
            >
              {location.state.type===0?'提交申请':'修改申请'}
            </Button>:''
          }
          <ImageShow imgPath={imgPath} visible={imgShow} onClose={this.onClose} />
        </div>
      </div>
    );
  }
}

export default OpenWallet;
