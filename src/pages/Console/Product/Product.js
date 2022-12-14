import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Col, Button, Input, Checkbox, message, Icon, Upload, Tooltip } from 'antd';
import styles from '../../../layouts/Sword.less';
import { TENANTDETAIL_SUBMIT } from '@/actions/TenantDetailActions';
import { getCurrentUser, getToken } from '@/utils/authority';
import Link from 'umi/link';
import Func from '@/utils/Func';
import Panel from '@/components/Panel';
import router from 'umi/router';
import { detail as tenantDetail } from '@/services/TenantDetailServices';
import { detail as tenantProduct } from '@/services/TenantProductServices';

const FormItem = Form.Item;

@connect(({ tenantDetail, loading }) => ({
  tenantDetail,
  loading: loading.models.tenantDetail,
}))
@Form.create()
class Product extends PureComponent {

  state = {
    fileFrontList: [],
    fileBackList: [],
    loadingFront: false,
    loadingBack: false,
    detail: {},
    product: -1,
    tenantNameSuffix: false,
    codsSuffix: false,
    linkmanSuffix: false,
    phoneSuffix: false,
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { product },
      },
    } = this.props;
    console.log(product)

    const user = getCurrentUser();
    console.log(user)
    tenantDetail({createUser: user.userId, tenantId: user.tenantId,}).then((resDetail) => {

      if (resDetail.success && Func.notEmpty(resDetail.data.id)){
        tenantProduct({tenantDetailId:resDetail.data.id, product: product}).then((resProduct) => {
          console.log("resDetail",resDetail)
          console.log("resProduct",resProduct)
          if (resProduct.success){
            if (Func.notEmpty(resDetail.data.id) && Func.notEmpty(resProduct.data.id) && resProduct.data.auditFlag !==1){
              this.handleIsProduct(product);
            }
            this.setState({
              detail:resDetail.data,
              imageUrl:resDetail.data.identityPicsFront,
              imageUrl2:resDetail.data.identityPicsBack,
              product:product,
            });
          }else {
            this.setState({
              detail:resDetail.data,
              imageUrl:resDetail.data.identityPicsFront,
              imageUrl2:resDetail.data.identityPicsBack,
              product:product,
            });
          }
        })
      }else {
        this.setState({
          detail:resDetail.data,
          product:product,
        });
      }
    })
  }

  handleIsProduct = (product) => {
    console.log(product)
    if(product === '0'){
      message.success('?????????????????????????????????????????????');
      router.push('/console/product/flowcontrol');
    }else {
      message.success('?????????????????????????????????????????????');
      router.push('/console/product/merchants');
    }

  };

  handleSubmit = e => {
    e.preventDefault();
    const { form , dispatch,} = this.props;
    const { fileFrontList,fileBackList,product } = this.state;
    const file = [...fileFrontList,...fileBackList];
    const formData = new FormData();
    const user = getCurrentUser();
    file.map(value => {
      formData.append('file',value);
      return value;
    })
    if (product === '0'){
      formData.append('bucketName','lxgk');
      formData.append('fileName','lxgk');
    }else {
      formData.append('bucketName','kspt');
      formData.append('fileName','kspt');
    }

    // ????????????
    const myToken = getToken();

    if (fileFrontList.length=== 0 && fileFrontList.length === 0){
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const params = {
            ...values,
            tenantId: user.tenantId,
          };
          dispatch(TENANTDETAIL_SUBMIT(params));
          // message.success('???????????????');
        }
      });
    }else {
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log(values)
          fetch('/api/shippers-flowpic/flowMonipic/uploadIdentityPhoto',{
            method:'POST',
            headers: {
              'Authorization':'Basic c3dvcmQ6c3dvcmRfc2VjcmV0',
              'Blade-Auth': myToken,
            },
            name: 'file',
            body: formData,
            mode:'cors',
            cache:'default'
          })
            .then(res =>res.json())
            .then((data) => {
              if(data.success){
                const params = {
                  ...values,
                  tenantId: user.tenantId,
                  identityPicsFront: data.data[0],
                  identityPicsBack: data.data[1],
                };

                dispatch(TENANTDETAIL_SUBMIT(params));
                // message.success('???????????????');
              }else{
                message.error('???????????????');
              }
            })
        }
      });
    }
  };

  getBase64 = (img, callback) =>{
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUploadFront  = (file) =>{
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('Image must smaller than 2MB!');
    // }
    this.setState(state => ({
      fileFrontList: [file],
    }));
    return isJpgOrPng;
  }

  beforeUploadBack  = (file) =>{
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('Image must smaller than 2MB!');
    // }
    this.setState(state => ({
      fileBackList: [file],
    }));
    return isJpgOrPng;
  }

  handleChangeFront = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loadingFront: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loadingFront: false,
        }),
      );
    }
  };

  handleChangeBack = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loadingBack: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl2 =>
        this.setState({
          imageUrl2,
          loadingBack: false,
        }),
      );
    }
  };

  checkTenantName = (rule, value, callback) =>{
    if (Func.notEmpty(value)){
      this.setState({tenantNameSuffix: true})
    }else {
      this.setState({tenantNameSuffix: false})
    }
    callback();
  }

  checkCods = (rule, value, callback) =>{
    if (Func.notEmpty(value)){
      this.setState({codsSuffix: true})
    }else {
      this.setState({codsSuffix: false})
    }
    callback();
  }

  checkLinkman = (rule, value, callback) =>{
    if (Func.notEmpty(value)){
      this.setState({linkmanSuffix: true})
    }else {
      this.setState({linkmanSuffix: false})
    }
    callback();
  }

  checkPhone = (rule, value, callback) =>{
    if (Func.notEmpty(value)){
      this.setState({phoneSuffix: true})
    }else {
      this.setState({phoneSuffix: false})
    }
    callback();
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {loadingFront,loadingBack,imageUrl,imageUrl2, detail, product,tenantNameSuffix,codsSuffix,linkmanSuffix,phoneSuffix} = this.state;

    let titleName = "";
    if (product === '0'){
      titleName = "??????????????????";
    }else {
      titleName = "??????????????????";
    }

    const uploadButtonFront = (
      <div>
        <Icon type={loadingFront ? 'loading' : 'plus'} />
        <div className="ant-upload-text">??????????????????</div>
      </div>
    );

    const uploadButtonBack = (
      <div>
        <Icon type={loadingBack ? 'loading' : 'plus'} />
        <div className="ant-upload-text">????????????????????????????????????</div>
      </div>
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 15 },
      },
    };

    return (
      <Panel>
        <Card title={titleName} className={styles.card} bordered={false}>
          <Card
            className={styles.card}
            bordered={false}
            // hoverable
            style={{ marginTop: 35 }}
          />
          <Form hideRequiredMark={false} >
            <Card className={styles.card} bordered={false}>
              <FormItem {...formItemLayout} style={{display: 'none'}}>
                {getFieldDecorator('id', {initialValue: detail.id,})(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} style={{display: 'none'}}>
                {getFieldDecorator('tenantDetailId', {initialValue: detail.id,})(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} style={{display: 'none'}}>
                {getFieldDecorator('product', {initialValue: product,})(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} style={{display: 'none'}}>
                {getFieldDecorator('clientId', {initialValue: product ==='0'?'lxgk':'kspt',})(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} style={{display: 'none'}}>
                {getFieldDecorator('auditFlag', {initialValue: 0,})(<Input />)}
              </FormItem>
              {/*<FormItem {...formItemLayout}>*/}
              {/*  {getFieldDecorator('companyType', {*/}
              {/*    rules: [*/}
              {/*      {*/}
              {/*        required: true,*/}
              {/*        message: '???????????????????????????',*/}
              {/*      },*/}
              {/*    ],*/}
              {/*  })(*/}
              {/*    <Select placeholder="???????????????????????????">*/}
              {/*      {companyType.map(d => (*/}
              {/*        <Select.Option key={d.dictKey} value={d.dictKey}>*/}
              {/*          {d.dictValue}*/}
              {/*        </Select.Option>*/}
              {/*      ))}*/}
              {/*    </Select>*/}
              {/*  )}*/}
              {/*</FormItem>*/}
              <FormItem {...formItemLayout} >
                {getFieldDecorator('tenantName',{
                  rules: [
                    {
                      required: true,
                      message: '?????????????????????',
                    },
                    {
                      pattern: /^[^\s]*$/,
                      message: '??????????????????',
                    },
                    {
                      validator: this.checkTenantName
                    }
                  ],
                  initialValue: detail.tenantName,
                })(
                  <Input
                    placeholder="???????????????????????????"
                    maxLength={50}
                    prefix={<Icon type="team" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    suffix={
                      tenantNameSuffix?
                        ""
                        :
                        <Tooltip title="??????????????????????????????">
                          <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('cods',{
                  rules: [
                    // {
                    //   required: true,
                    //   message: '?????????????????????????????????',
                    // },
                    {
                      pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/,
                      message: '????????????????????????????????????',
                    },
                    {
                      validator: this.checkCods
                    }
                  ],
                  initialValue: detail.cods,
                })(
                  <Input
                    placeholder="?????????????????????????????????"
                    maxLength={20}
                    prefix={<Icon type="code" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    // suffix={
                    //   codsSuffix?
                    //     ""
                    //     :
                    //     <Tooltip title="????????????????????????????????????">
                    //       <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                    //     </Tooltip>
                    // }
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('linkman',{
                  rules: [
                    {
                      required: true,
                      message: '????????????????????????',
                    },
                    {
                      pattern: /^[^\s]*$/,
                      message: '??????????????????',
                    },
                    {
                      validator: this.checkLinkman
                    }
                  ],
                  initialValue: detail.linkman,
                })(
                  <Input
                    placeholder="????????????????????????"
                    maxLength={20}
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    suffix={
                      linkmanSuffix?
                        ""
                        :
                        <Tooltip title="???????????????????????????">
                          <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('contactNumber',{
                  rules: [
                    {
                      required: true,
                      message: '??????????????????????????????',
                    },
                    {
                      pattern: /^1[3-9]\d{9}$/,
                      message: '????????????????????????',
                    },
                    {
                      validator: this.checkPhone
                    }
                  ],
                  initialValue: detail.contactNumber,
                })(
                  <Input
                    placeholder="??????????????????????????????"
                    maxLength={11}
                    prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    suffix={
                      phoneSuffix?
                        ""
                        :
                        <Tooltip title="??????????????????????????????!">
                          <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} help="????????????????????????????????????">
                {getFieldDecorator('identityPicsFront',{
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '???????????????????????????????????????',
                  //   },
                  // ],
                  initialValue: detail.identityPicsFront,
                })(
                  <Upload
                    name="picsFront"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={this.beforeUploadFront}
                    onChange={this.handleChangeFront}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButtonFront}
                  </Upload>
                )}

              </FormItem>
              {/*<FormItem {...formItemLayout} help="????????????????????????????????????">*/}
              {/*  {getFieldDecorator('identityPicsBack',{*/}
              {/*    // rules: [*/}
              {/*    //   {*/}
              {/*    //     required: true,*/}
              {/*    //     message: '???????????????????????????????????????',*/}
              {/*    //   },*/}
              {/*    // ],*/}
              {/*    initialValue: detail.identityPicsBack,*/}
              {/*  })(*/}
              {/*    <Upload*/}
              {/*      name="picsBack"*/}
              {/*      listType="picture-card"*/}
              {/*      className="avatar-uploader"*/}
              {/*      showUploadList={false}*/}
              {/*      beforeUpload={this.beforeUploadBack}*/}
              {/*      onChange={this.handleChangeBack}*/}
              {/*    >*/}
              {/*      {imageUrl2 ? <img src={imageUrl2} alt="avatar" style={{ width: '100%' }} /> : uploadButtonBack}*/}
              {/*    </Upload>*/}
              {/*  )}*/}
              {/*</FormItem>*/}
              {/*<FormItem {...formItemLayout}>*/}
              {/*  {getFieldDecorator('agreement', {*/}
              {/*    valuePropName: 'checked',*/}
              {/*    rules: [*/}
              {/*      {*/}
              {/*        required: true,*/}
              {/*        message: '????????????',*/}
              {/*      },*/}
              {/*    ],*/}
              {/*  })(*/}
              {/*    <Checkbox>*/}
              {/*      <Link className={styles.login}>*/}
              {/*        ????????????*/}
              {/*      </Link>*/}
              {/*    </Checkbox>,*/}
              {/*  )}*/}
              {/*</FormItem>*/}
              <FormItem {...formItemLayout}>
                <Button type="danger" onClick={this.handleSubmit} block>
                  ??????
                </Button>
              </FormItem>
            </Card>
          </Form>
        </Card>
      </Panel>
    );
  }
}
export default Product;
