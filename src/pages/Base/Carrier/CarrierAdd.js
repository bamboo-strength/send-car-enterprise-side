import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Col } from 'antd';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { CARRIER_SUNMIT,UPDATESTATE } from '@/actions/carrier';
import { Icon, NavBar,Button } from 'antd-mobile';
import router from 'umi/router';

const FormItem = Form.Item;

@connect(({ carrier, loading }) => ({
  carrier,
  loading: loading.models.carrier,
}))
@Form.create()
class CarrierAdd extends PureComponent {

//  提交按钮事件
  handleSubmit = e => {
    e.preventDefault();
    const { form ,dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
        };
        dispatch(UPDATESTATE({ submitLoading: true }))
        dispatch(CARRIER_SUNMIT(params));
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      carrier:{submitLoading}
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
      <Button type="primary" onClick={this.handleSubmit} loading={submitLoading} style={{marginTop:'20px'}}>
        提交
      </Button>
    );


    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/base/carrier')}
        >新增承运商
        </NavBar>
        <div className='am-list'>
        <Form>
          <Card bordered={false} className={styles.card}>
            <Col span={24} className='add-config'>
            <FormItem {...formItemLayout} label="承运商名称">
              {getFieldDecorator('name',{
                rules:[
                  {
                    required:true,
                    message:'请输入承运商名称',
                  },
                  {
                    pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                    message: '前后禁止输入空格',
                  },
                ]
              })(<Input placeholder="请输入承运商名称" maxLength={40} />)}
            </FormItem>
            </Col>
            <Col span={24} className='add-config'>
            <FormItem {...formItemLayout} label="编码">
              {getFieldDecorator('code',{
                rules:[
                  {
                    required:true,
                    message:'请输入编码',
                  },
                  {
                    pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                    message: '前后禁止输入空格',
                  },
                ]
              })(<Input placeholder="请输入编码" maxLength={20} />)}
            </FormItem>
          </Col>
          <Col span={24} className='add-config'>
            <FormItem {...formItemLayout} label="简称">
              {getFieldDecorator('shortname',{
                rules:[
                  {
                    pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                    message: '前后禁止输入空格',
                  },
                ]
              })(<Input placeholder="请输入简称" maxLength={20} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="地址">
              {getFieldDecorator('addr',{
                rules:[
                  {
                    pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                    message: '前后禁止输入空格',
                  },
                ]
              })(<Input placeholder="请输入地址" maxLength={80} />)}
            </FormItem>
          </Col>
            <Col span={24} className='add-config'>
            <FormItem {...formItemLayout} label="联系人">
              {getFieldDecorator('contacts',{
                rules:[
                  {
                    pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                    message: '前后禁止输入空格',
                  },
                ]
              })(<Input placeholder="请输入联系人" maxLength={20} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机">
              {getFieldDecorator('phone',{
                rules:[
                  {
                    required:true,
                    message:'请输入联系人手机',
                  },
                  {
                    pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                    message: '前后禁止输入空格',
                  },
                  {
                    pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/,
                    message: '手机格式不正确',
                  },
                ]
              })(<Input placeholder="请输入手机" minLength={11} maxLength={13} />)}
            </FormItem>
            </Col>
          </Card>
        </Form>
          {action}
        </div>
      </div>
    );
  }
}
export default CarrierAdd;

