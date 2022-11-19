import React, { PureComponent } from 'react';
import { Form, Input, Card } from 'antd';
import { connect } from 'dva';
import { Icon, NavBar,Button } from 'antd-mobile';
import router from 'umi/router';
import func from '../../../utils/Func';
import {CARRIER_DETAIL, CARRIER_SUNMIT} from '@/actions/carrier';

const FormItem = Form.Item;

@connect(({ carrier, loading }) => ({
  carrier,
  loading: loading.models.carrier,
}))
@Form.create()
class CarrierSelfInfo extends PureComponent {

  componentWillMount() {
    const {
      match :{
        params:{ id },
      },
      dispatch,
    } = this.props;
    dispatch(CARRIER_DETAIL(id));
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      match:{
        params:{id},
      },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id,
          ...values,
          date:func.format(values.date),
          isDeleted:'0'
        };
        dispatch(CARRIER_SUNMIT(params));
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      carrier: { detail },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} style={{marginTop:'20px'}}>
        提交
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/base/carrier')}
        >承运商信息维护
        </NavBar>
        <Form hideRequiredMark={false} style={{ marginTop: 8 }}>
          <Card bordered={false} style={{paddingBottom:'35px'}}>
            <FormItem {...formItemLayout} label="承运商名称">
              {getFieldDecorator('name',{
                rules:[
                  {
                    required:true,
                    message:'请输入承运商名称',
                  },
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  }
                ],
                initialValue: detail.name
              })(<Input placeholder="请输入承运商名称" maxLength={40} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="编码">
              {getFieldDecorator('code',{
                rules:[
                  {
                    required:true,
                    message:'请输入编码',
                  },
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  }
                ],
                initialValue: detail.code
              })(<Input placeholder="请输入编码" maxLength={20} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="简称">
              {getFieldDecorator('shortname',{
                rules:[
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  }
                ],
                initialValue: detail.shortname
              })(<Input placeholder="请输入简称" maxLength={20} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="拼音码">
              {getFieldDecorator('spellcode',{
                rules:[
                  {
                    length:40
                  }
                ],
                initialValue: detail.spellcode
              })(<Input placeholder="请输入拼音码" readOnly />)}
            </FormItem>
            <FormItem {...formItemLayout} label="地址">
              {getFieldDecorator('addr',{
                rules:[
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  }
                ],
                initialValue: detail.addr
              })(<Input placeholder="请输入地址" maxLength={80} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="联系人">
              {getFieldDecorator('contacts',{
                rules:[
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  }
                ],
                initialValue:detail.contacts
              })(<Input placeholder="请输入联系人" maxLength={20} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机">
              {getFieldDecorator('phone',{
                rules:[
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  },
                  {
                    pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/,
                    message: '手机号格式不正确',
                  },
                ],
                initialValue:detail.phone
              })(<Input placeholder="请输入手机号" minLength={11} maxLength={13} />)}
            </FormItem>
          </Card>
        </Form>
        {action}
      </div>
    );

  }
}

export default CarrierSelfInfo;
