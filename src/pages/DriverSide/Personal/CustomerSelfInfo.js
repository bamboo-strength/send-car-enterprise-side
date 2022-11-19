import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Select, Col } from 'antd';
import router from 'umi/router';
import { Icon, NavBar, Button } from 'antd-mobile';
import { CUSTOMER_DETAIL, CUSTOMER_SUBMIT, CUSTOMER_INIT } from '../../../actions/customer';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ customer, loading }) => ({
  customer,
  loading: loading.models.customer,
}))
@Form.create()
class CustomerSelfInfo extends PureComponent {

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(CUSTOMER_INIT({
      code: ['registerflagname', 'deptName', 'industryname'],
    }));
    dispatch(CUSTOMER_DETAIL(id));
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id,
          ...values,
        };
        dispatch(CUSTOMER_SUBMIT(params));
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      customer: {
        detail,
        init: { registerflagname, industryname },
      },
    } = this.props;

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
      <Button type="primary" onClick={this.handleSubmit} style={{ marginTop: '20px' }}>
        提交
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/base/customer')}
        >客户信息维护
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card bordered={false}>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('custname', {
                    rules: [
                      {
                        required: true,
                        message: '请输入客户名称',
                      },
                    ],
                    getValueFromEvent: (event) => {
                      return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                    },
                    initialValue: detail.custname,
                  })(<Input placeholder="请输入客户名称" maxLength={96}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="客户简称">
                  {getFieldDecorator('forshort', {
                    rules: [
                      {
                        required: true,
                        message: '请输入客户简称',
                      },
                    ],
                    getValueFromEvent: (event) => {
                      return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                    },
                    initialValue: detail.forshort,
                  })(<Input placeholder="请输入客户简称" maxLength={96}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="统一社会信用代码">
                  {getFieldDecorator('creditCode', {
                    rules: [
                      {
                        message: '统一社会信用代码格式不正确',
                        pattern: /[1-9A-GY]{1}[1239]{1}[1-5]{1}[0-9]{5}[0-9A-Z]{10}/,
                      },
                      {
                        required: true,
                        message: '请输入统一社会信用代码',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                    initialValue: detail.creditCode,
                  })(<Input placeholder="请输入统一社会信用代码" maxLength={40}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="注册类型">
                  {getFieldDecorator('registerflag', {
                    rules: [
                      {
                        required: true,
                        message: '请选择注册类型',
                      },
                    ],
                    initialValue: detail.registerflag,
                  })(
                    <Select
                      placeholder="请选择注册类型"
                    >
                      {registerflagname.map(d => (
                        <Select.Option key={d.dictKey} value={d.dictKey}>
                          {d.dictValue}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="行业">
                  {getFieldDecorator('industry', {
                    rules: [
                      {
                        required: true,
                        message: '请选择行业',
                      },
                    ],
                    initialValue: detail.industry,
                  })(
                    <Select
                      placeholder="请选择行业"
                    >
                      {industryname.map(d => (
                        <Select.Option key={d.dictKey} value={d.dictKey}>
                          {d.dictValue}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="法人代表">
                  {getFieldDecorator('corp', {
                    rules: [
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                    initialValue: detail.corp,
                  })(<Input placeholder="请输入法人代表" maxLength={56}/>)}
                </FormItem>

              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="邮编">
                  {getFieldDecorator('postcode', {
                    rules: [
                      {
                        message: '邮编格式不正确',
                        pattern: /^[1-9]\d{5}$/g,
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                    initialValue: detail.postcode,
                  })(<Input placeholder="请输入邮编" maxLength={40}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="传真">
                  {getFieldDecorator('fax', {
                    rules: [
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                    initialValue: detail.fax,
                  })(<Input placeholder="请输入传真" maxLength={56}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="准购证编号">
                  {getFieldDecorator('purchaselicense', {
                    rules: [
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                    initialValue: detail.purchaselicense,
                  })(<Input placeholder="请输入准购证编号" maxLength={56}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="生产许可证">
                  {getFieldDecorator('productlicense', {
                    rules: [
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                    initialValue: detail.productlicense,
                  })(<Input placeholder="请输入生产许可证" maxLength={56}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="经营许可证">
                  {getFieldDecorator('businesslicense', {
                    rules: [
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                    initialValue: detail.businesslicense,
                  })(<Input placeholder="请输入经营许可证" maxLength={56}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="联系人">
                  {getFieldDecorator('busideptprin', {
                    rules: [
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                    initialValue: detail.busideptprin,
                  })(<Input placeholder="请输入联系人" maxLength={56}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="办公电话">
                  {getFieldDecorator('phone', {
                    rules: [
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                      {
                        pattern: /0\d{2,3}-\d{7,8}/,
                        message: '办公电话格式不正确',
                      },
                    ],
                    initialValue: detail.phone,
                  })(<Input placeholder="请输入办公电话" maxLength={40}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="联系电话">
                  {getFieldDecorator('prinphone', {
                    rules: [
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                      {
                        pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/,
                        message: '联系电话格式不正确',
                      },
                    ],
                    initialValue: detail.prinphone,
                  })(<Input placeholder="请输入联系电话" maxLength={40}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="备注">
                  {getFieldDecorator('remark', {
                    getValueFromEvent: (event) => {
                      return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                    },
                    initialValue: detail.remark,
                  })(
                    <TextArea style={{ minHeight: 32 }} placeholder="请输入备注" rows={4} maxLength={1024}/>,
                  )}
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

export default CustomerSelfInfo;
