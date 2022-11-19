import React, { PureComponent } from 'react';
import { Form, Input, Card, Select, Upload, Icon, Col } from 'antd';
import { connect } from 'dva';
import { NavBar, Button } from 'antd-mobile';
import router from 'umi/router';
import { CUSTOMER_SUBMIT, CUSTOMER_INIT,UPDATESTATE } from '../../../actions/customer';
import MatrixSelect from '@/components/Matrix/MatrixSelect';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ customer }) => ({
  customer,
  // loading: loading.models.customer,
}))
@Form.create()
class CustomerAdd extends PureComponent {

  componentWillMount() {

    const { dispatch } = this.props;
    dispatch(CUSTOMER_INIT({
      code: ['registerflagname', 'deptName', 'industryname'],
    }));
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
        };
        dispatch(UPDATESTATE({ submitLoading: true }))
        dispatch(CUSTOMER_SUBMIT(params));
        // message.success('提交成功！');
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      customer: {
        init: { registerflagname, industryname },
        submitLoading
      },
      form
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
      <Button type="primary" onClick={this.handleSubmit} loading={submitLoading} style={{ marginTop: '20px' }}>
        提交
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/base/customer')}
        >新增客户信息
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
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                    ],
                    getValueFromEvent: (event) => {
                      return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                    },
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
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                    ],
                    getValueFromEvent: (event) => {
                      return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                    },
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
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                    ],
                  })(<Input placeholder="请输入统一社会信用代码" maxLength={18}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <MatrixSelect
                  label="注册类型"
                  id="registerflag"
                  form={form}
                  xs={9}
                  dictCode='registerflagname'
                  required
                />
                {/* <FormItem {...formItemLayout} label="注册类型">
                  {getFieldDecorator('registerflag', {
                    rules: [
                      {
                        required: true,
                        message: '请选择注册类型',
                      },
                    ],
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
                </FormItem> */}
              </Col>
              <Col span={24} className='add-config'>
                <MatrixSelect
                  label="行业"
                  id="industry"
                  form={form}
                  xs={9}
                  dictCode='industryname'
                  required
                />
                {/* <FormItem {...formItemLayout} label="行业">
                  {getFieldDecorator('industry', {
                    rules: [
                      {
                        required: true,
                        message: '请选择行业',
                      },
                    ],
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
                </FormItem> */}
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="法人代表">
                  {getFieldDecorator('corp', {
                    rules: [
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                    ],
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
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                    ],
                  })(<Input placeholder="请输入邮编" maxLength={6}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="传真">
                  {getFieldDecorator('fax', {
                    rules: [
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                    ],
                  })(<Input placeholder="请输入传真" maxLength={8}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="准购证编号">
                  {getFieldDecorator('purchaselicense', {
                    rules: [
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                    ],
                  })(<Input placeholder="请输入准购证编号" maxLength={56}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="生产许可证">
                  {getFieldDecorator('productlicense', {
                    rules: [
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                    ],
                  })(<Input placeholder="请输入生产许可证" maxLength={56}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="经营许可证">
                  {getFieldDecorator('businesslicense', {
                    rules: [
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                    ],
                  })(<Input placeholder="请输入经营许可证" maxLength={56}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="联系人">
                  {getFieldDecorator('busideptprin', {
                    rules: [
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                    ],
                  })(<Input placeholder="请输入联系人" maxLength={56}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="办公电话">
                  {getFieldDecorator('phone', {
                    rules: [
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                      {
                        pattern: /0\d{2,3}-\d{7,8}/,
                        message: '办公电话格式不正确',
                      },
                    ],
                  })(<Input placeholder="请输入办公电话" maxLength={13}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="联系电话">
                  {getFieldDecorator('prinphone', {
                    rules: [
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                      {
                        pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/,
                        message: '联系电话格式不正确',
                      },
                    ],
                  })(<Input placeholder="请输入联系电话" maxLength={11}/>)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="备注">
                  {getFieldDecorator('remark', {
                    getValueFromEvent: (event) => {
                      return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                    },
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

export default CustomerAdd;


