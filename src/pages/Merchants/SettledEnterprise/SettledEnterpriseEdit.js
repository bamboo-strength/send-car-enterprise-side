import React, { PureComponent } from 'react';
import { Form, Input, Card } from 'antd';
import { connect } from 'dva';
import {  SETTLEDENTERPRISE_SUBMIT,SETTLEDENTERPRISE_TENANTDETAIL} from '../../../actions/settledEnterprise';
import router from 'umi/router';
import {Button,Icon, NavBar } from 'antd-mobile';
import Panel from '../../../components/Panel';


const FormItem = Form.Item;
@connect(({ settledEnterprise, loading }) => ({
  settledEnterprise,
  submitting: loading.effects['businessInto/settledEnterprise'],
}))
@Form.create()
class SettledEnterpriseEdit extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { tenantId },
      },
    } = this.props;
/*    dispatch(SETTLEDENTERPRISE_INIT( {
      code: []
    }));  */
    dispatch(SETTLEDENTERPRISE_TENANTDETAIL({tenantId:tenantId}));
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      dispatch,
      match: {
        params: { id },
      },
      form,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const params = {
        id,
        ...values,
      };
      dispatch(SETTLEDENTERPRISE_SUBMIT(params));
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      settledEnterprise: {detail},
      submitting,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 11 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 13 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting} style={{marginTop:'20px'}}>
        申请入驻
      </Button>
    );
    const tenName=`入驻到${detail.tenantName}`;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/businessInto/settledEnterprise')}
        >{tenName}
        </NavBar>
        <div className='am-list'>
          <Form >
            <Card bordered={false}>
              <FormItem {...formItemLayout} label="入驻企业租户号">
                {getFieldDecorator('tenantId', {
                  initialValue: detail.tenantId,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="企业名称">
                {getFieldDecorator('tenantName', {
                  initialValue: detail.tenantName,
                })(<Input placeholder="请输入名称" maxLength={20} disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="社会统一信用编码">
                {getFieldDecorator('cods', {
                  initialValue: detail.cods,
                })(<Input placeholder="请输入社会统一信用编码" maxLength={20} disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="开户行">
                {getFieldDecorator('bankName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入开户行',
                    },
                    {
                      pattern: /^[^\s]*$/,
                      message: '禁止输入空格',
                    },
                    {
                      max:100,
                      message: '开户行不能大于100个字符',
                    },
                  ],
                })(<Input placeholder="请输入开户行" maxLength={20} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="生产许可证">
                {getFieldDecorator('productLicense', {
                  rules: [
                    {
                      required: true,
                      message: '请输入生产许可证',
                    },
                    {
                      pattern: /^[^\s]*$/,
                      message: '禁止输入空格',
                    },
                    {
                      max:100,
                      message: '生产许可证不能大于100个字符',
                    },
                  ],
                })(<Input placeholder="请输入生产许可证" maxLength={20} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="经营许可证">
                {getFieldDecorator('businessLicense', {
                  rules: [
                    {
                      required: true,
                      message: '请输入经营许可证',
                    },
                    {
                      pattern: /^[^\s]*$/,
                      message: '禁止输入空格',
                    },
                    {
                      max:100,
                      message: '经营许可证不能大于100个字符',
                    },
                  ],
                })(<Input placeholder="请输入经营许可证" maxLength={20} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="联系人">
                {getFieldDecorator('name', {
                  initialValue: detail.linkman,
                })(<Input placeholder="请输入联系人" maxLength={20} disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="联系电话">
                {getFieldDecorator('contactNumber', {
                  initialValue: detail.contactNumber,
                })(<Input placeholder="请输入联系电话" maxLength={20} disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="客户类型" style={{display:'none'}}>
                {getFieldDecorator('customerType', {
                  initialValue: 2,
                })(<Input placeholder="" disabled />)}
              </FormItem>
            </Card>
            {action}
          </Form>
        </div>

      </div>
    );
  }
}
export default SettledEnterpriseEdit;
