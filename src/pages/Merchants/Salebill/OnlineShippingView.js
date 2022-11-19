import React, { PureComponent } from 'react';
import { Form, Card, message, Input, Col, Select } from 'antd';
import { NavBar,Button,Icon } from 'antd-mobile';
import { connect } from 'dva';
import router from 'umi/router';
import MatrixSSQ from "@/components/Matrix/MatrixSSQ";
import { page } from '@/services/salebill'
import { detail } from '@/services/salebill';

const FormItem = Form.Item;
@connect(({ salebill, loading }) => ({
  salebill,
  submitting: loading.effects['/salebill/salebill'],
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
}))
@Form.create()
class onlineShippingView extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      //   submitting: false,
      detail:{},
    };
  }

  componentWillMount() {
    const {
      dispatch,match: {params: {id}},
      location
    } = this.props;
    const params={billno:id}
    page(params).then(resp=>{
      this.setState({
        detail: resp.data,
      })
    })
  }

  goback = e => {
    router.push('/salebill/salebill');
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
    const { detail }=this.state
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
      <Button type="primary" onClick={this.goback} loading={submitting}>
        上一步
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
                  <FormItem {...formItemLayout} label="订单编号">
                    {getFieldDecorator('billno', {
                      rules: [
                        {
                          required: true,
                          message: '请输入订单编号',
                        },
                      ],
                      initialValue: detail.billno,
                    })(<Input placeholder="请输入订单编号" maxLength={96} disabled/>)}
                  </FormItem>
                  {/*<FormItem {...formItemLayout} label="发布范围">*/}
                  {/*  {getFieldDecorator('publishScope', {*/}
                  {/*    rules: [*/}
                  {/*      {*/}
                  {/*        required: true,*/}
                  {/*        message: '请输入发布范围',*/}
                  {/*      },*/}
                  {/*    ],*/}
                  {/*    initialValue: 1,*/}
                  {/*  })(<Input placeholder="请输入发布范围" maxLength={96} disabled />)}*/}
                  {/*</FormItem>*/}
                  <FormItem {...formItemLayout} label="发货人">
                    {getFieldDecorator('shipper', {
                      rules: [
                        {
                          required: true,
                          message: '请输入发货人',
                        },
                      ],
                      initialValue: detail.shipper,
                    })(<Input placeholder="请输入客户名称" maxLength={96} disabled />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="发货人联系方式">
                    {getFieldDecorator('shipperPhone', {
                      rules: [
                        {
                          required: true,
                          message: '请输入发货人联系方式',
                        },
                      ],
                      initialValue: detail.shipperPhone,
                    })(<Input placeholder="请输入发货人联系方式" maxLength={96} disabled />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="发货地址">
                    {getFieldDecorator('shipAddressName', {
                      rules: [
                        {
                          required: true,
                          message: '请输入发货地址',
                        },
                      ],
                      initialValue: detail.shipAddressRegionName,
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
                      initialValue: detail.shipFullAddress,
                    })(<Input placeholder="请输入发货详细地址" maxLength={96} disabled/>)}
                  </FormItem>
                </Col>
              </Card>
              <Card>
                <Col span={24} className='add-config'>
                  <FormItem {...formItemLayout} label="收货人">
                    {getFieldDecorator('receiver', {
                      rules: [
                        {
                          required: true,
                          message: '请输入收货人',
                        },
                      ],
                      initialValue: detail.receiver,
                    })(<Input placeholder="请输入收货人" maxLength={96} disabled/>)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="收货人联系方式">
                    {getFieldDecorator('receiverPhone', {
                      rules: [
                        {
                          required: true,
                          message: '请输入收货人联系方式',
                        },
                      ],
                      initialValue: detail.receiverPhone,
                    })(<Input placeholder="请输入收货人联系方式" maxLength={96} disabled/>)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="收货地址">
                    {getFieldDecorator('receiveAddress', {
                      rules: [
                        {
                          required: true,
                          message: '请输入收货地址',
                        },
                      ],
                      initialValue: detail.receiveAddressRegionName
                    })( <Input placeholder="请输入收货地址" maxLength={96} disabled/>)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="收货详细地址">
                    {getFieldDecorator('receiveFullAddress', {
                      rules: [
                        {
                          required: true,
                          message: '请输入收货详细地址',
                        },
                      ],
                      initialValue: detail.receiveFullAddress,
                    })(<Input placeholder="请输入收货详细地址" maxLength={96} disabled/>)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="物资名称">
                    {getFieldDecorator('goods', {
                      rules: [
                        {
                          required: true,
                          message: '请输入物资名称',
                        },
                      ],
                      initialValue: detail.materialName,
                    })(<Input placeholder="请输入物资名称" maxLength={96} disabled/>)}
                  </FormItem>
                  {/*<FormItem {...formItemLayout} label="计价方式">*/}
                  {/*  {getFieldDecorator('pricingModeName', {*/}
                  {/*    rules: [*/}
                  {/*      {*/}
                  {/*        required: true,*/}
                  {/*        message: '请选择计价方式',*/}
                  {/*      },*/}
                  {/*    ],*/}
                  {/*    initialValue: detail.pricingModeName,*/}
                  {/*  })(<Input placeholder="请选择计价方式" maxLength={96} disabled/>)}*/}
                  {/*</FormItem>*/}
                  <FormItem {...formItemLayout} label="物资总数量">
                    {getFieldDecorator('materialTotalnum', {
                      rules: [
                        {
                          required: true,
                          message: '请输入物资总数量',
                        },
                      ],
                      initialValue: detail.materialTotalamount,
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
                      initialValue: detail.price,
                    })(<Input placeholder="请输入运费单价" maxLength={96} onChange={(e)=>this.onChangePrice(e)} disabled/>)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="总运费">
                    {getFieldDecorator('totalFreight', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                      initialValue: detail.totalFreight,
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

export default onlineShippingView;
