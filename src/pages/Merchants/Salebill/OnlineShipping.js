import React, { PureComponent } from 'react';
import { Form, Card, message, Input, Col, Select } from 'antd';
import { NavBar,Button,Icon } from 'antd-mobile';
import { connect } from 'dva';
import router from 'umi/router';
import MatrixSSQ from "@/components/Matrix/MatrixSSQ";
import { detail,getOne,publishedSources } from '@/services/salebill';

const FormItem = Form.Item;
@connect(({ salebill, loading }) => ({
  salebill,
  submitting: loading.effects['/salebill/salebill'],
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
}))
@Form.create()
class onlineShipping extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      //   submitting: false,
      detail:{},
      shipAddress:'',
      shipAddressName:'',
      shipFullAddress:'',
    };
  }

  componentWillMount() {
    const {
      match: {params: {id},},
      location,
    } = this.props;
    console.log("location",location);
    detail({id}).then(resp=>{
      this.setState({
        detail: resp.data,
      })
      getOne({deptId:location.state.data.deptId}).then((res)=>{
          this.setState({
          shipAddress:res.data.shipAddress,
          shipAddressName:res.data.shipAddressName,
          shipFullAddress:res.data.shipFullAddress,
        })
      })
    })
  }

  handleAccpet = e => {
    e.preventDefault();
    const {
      match: {params: {id}},
      form,
      location
    } = this.props;
    console.log(location);
    const {shipAddress,detail}=this.state
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
          shipAddress:shipAddress,
          billno:location.state.data.billno,
          materialno:detail.materialnos
        };
        delete params.id
        console.log(params);
        publishedSources(params).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            router.push('/salebill/salebill');
          }
        });
      }
    });
  };

  /* 物资总量事件 */
  onChange = e =>{
    const {form} = this.props;
    const {radioValue} = this.state;
    const {price} = form.getFieldsValue();
    const aa = e.target.value
    form.setFieldsValue({
      totalFreight:price * e.target.value,
      materialTotalamount:radioValue === 2? aa:''
    })
    console.log("price",e);
  }

  /* 单价事件 */
  onChangePrice = e =>{
    console.log(e);
    const {form} = this.props;
    const {materialTotalnum} = form.getFieldsValue();
    form.setFieldsValue({
      totalFreight:e.target.value * materialTotalnum ,
    })
  }

  handleOkBefore = () =>{
    const {form} = this.props;
    return form;
  };

  render() {
    const {
      submitting,
      form: { getFieldDecorator },
      form,
      location
    } = this.props;
    const { detail,shipAddressName,shipFullAddress }=this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 11 },
        md: { span: 9 },
      },
    };
    const action = (
      <Button type="primary" onClick={this.handleAccpet} loading={submitting}>
        确认
      </Button>
    );

    return (
      <div>
        <div className="commonAdd">
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => router.push('/salebill/salebill')}
          >网络托运
          </NavBar>
          <div className='am-list'>
            <Form>
              <Card bordered={false}>
                <Col span={24} className='add-config'>
                {/* <FormItem {...formItemLayout} label="订单编号">*/}
                {/*  {getFieldDecorator('billno', {*/}
                {/*    rules: [*/}
                {/*      {*/}
                {/*        required: true,*/}
                {/*        message: '请输入订单编号',*/}
                {/*      },*/}
                {/*    ],*/}
                {/*    initialValue: detail.billno,*/}
                {/*  })(<Input placeholder="请输入订单编号" maxLength={96} disabled/>)}*/}
                {/*</FormItem>*/}
                  <FormItem {...formItemLayout} label="发货人">
                    {getFieldDecorator('shipper', {
                      rules: [
                        {
                          required: true,
                          message: '请输入发货人',
                        },
                      ],
                    })(<Input placeholder="请输入客户名称" maxLength={96}  />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="发货人联系方式">
                    {getFieldDecorator('shipperPhone', {
                      rules: [
                        {
                          required: true,
                          message: '请输入发货人联系方式',
                        },
                      ],
                    })(<Input placeholder="请输入发货人联系方式" maxLength={96}  />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="发货地址">
                    {getFieldDecorator('shipAddressName', {
                      rules: [
                        {
                          required: true,
                          message: '请输入发货地址',
                        },
                      ],
                      initialValue: shipAddressName,
                    })(<Input placeholder="请输入发货地址" maxLength={96} disabled />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="发货详细地址">
                    {getFieldDecorator('shipFullAddress', {
                      rules: [
                        {
                          required: true,
                          message: '请输入发货详细地址',
                        },
                      ],
                      initialValue: shipFullAddress,
                    })(<Input placeholder="请输入发货详细地址" maxLength={96} disabled/>)}
                  </FormItem>
                </Col>
                <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="收货人">
                  {getFieldDecorator('receiver', {
                    rules: [
                      {
                        required: true,
                        message: '请输入收货人',
                      },
                    ],
                  })(<Input placeholder="请输入收货人" maxLength={96}/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="收货人联系方式">
                  {getFieldDecorator('receiverPhone', {
                    rules: [
                      {
                        required: true,
                        message: '请输入收货人联系方式',
                      },
                    ],
                  })(<Input placeholder="请输入收货人联系方式" maxLength={96}/>)}
                </FormItem>
                <MatrixSSQ label={"收货地址"} required="true" id="receiveAddress" labelId="receiveAddressName" needDistrict placeholder='请选择收货地址' form={form} />
                <FormItem {...formItemLayout} label="收货详细地址">
                  {getFieldDecorator('receiveFullAddress', {
                    rules: [
                      {
                        required: true,
                        message: '请输入收货详细地址',
                      },
                    ],
                  })(<Input  placeholder="请输入收货详细地址" maxLength={96}/>)}
                </FormItem>
                  <FormItem {...formItemLayout} label="物资名称">
                    {getFieldDecorator('materialName', {
                      rules: [
                        {
                          required: true,
                          message: '请输入物资名称',
                        },
                      ],
                      initialValue: detail.materialnosName,
                    })(<Input  placeholder="请输入物资名称" maxLength={96} disabled />)}
                  </FormItem>
                {/*<FormItem {...formItemLayout} label="物资名称">*/}
                {/*  <MatrixAutoComplete required='true' placeholder='请输入拼音码检索' dataType='goods' id='materialno' labelId='materialName' form={form} />*/}
                {/*</FormItem>*/}
                  {/*<FormItem {...formItemLayout} label="计价方式">*/}
                  {/*  {getFieldDecorator('pricingMode', {*/}
                  {/*    rules: [*/}
                  {/*      {*/}
                  {/*        required: true,*/}
                  {/*        message: '请选择计价方式',*/}
                  {/*      },*/}
                  {/*    ],*/}
                  {/*  })(<Select*/}
                  {/*    placeholder="请选择计价方式"*/}
                  {/*  >*/}
                  {/*    <Select.Option value="2">按重量(吨)</Select.Option>*/}
                  {/*    <Select.Option value="1">按车数(车)</Select.Option>*/}
                  {/*    <Select.Option value="3">按体积(立方)</Select.Option>*/}
                  {/*    <Select.Option value="4">按件数(件)</Select.Option>*/}
                  {/*  </Select>)}*/}
                  {/*</FormItem>*/}
                  <FormItem {...formItemLayout} label="物资总数量">
                    {getFieldDecorator('materialTotalnum', {
                      rules: [
                        {
                          required: true,
                          message: '请输入物资总数量',
                        },
                      ],
                      initialValue: detail.totalamount,
                    })(<Input placeholder="请输入物资总数量" maxLength={96} onChange={(e)=>this.onChange(e)} disabled/>)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="运费单价">
                    {getFieldDecorator('price', {
                      rules: [
                        {
                          required: true,
                          message: '请输入运费单价',
                        },
                      ],
                    })(<Input placeholder="请输入运费单价" maxLength={96} onChange={(e)=>this.onChangePrice(e)}/>)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="总运费">
                    {getFieldDecorator('totalFreight', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input placeholder="总运费" maxLength={96} disabled />)}
                  </FormItem>
                </Col>
              </Card>
            </Form>
            {action}
          </div>
        </div>
      </div>
    );
  }
}

export default onlineShipping;
