import React, { PureComponent } from 'react';
import { Form, Input, Card, Col } from 'antd/lib/index';
import { connect } from 'dva/index';
import { Icon, NavBar, Button } from 'antd-mobile';
import router from 'umi/router';
import { PACKAGE_SUBMIT,UPDATESTATE } from '../../../actions/package';
import MatrixAutoComplete from '../../../components/Matrix/MatrixAutoComplete';


const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ packages, loading }) => ({
  packages,
  submitting: loading.effects['base/package'],
}))
@Form.create()
class PackageAdd extends PureComponent {


  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const params = {
        ...values,
      };
      dispatch(UPDATESTATE({ submitLoading: true }))
      dispatch(PACKAGE_SUBMIT(params));
    });
  };


  render() {
    const {
      form,
      form: { getFieldDecorator },
      packages:{submitLoading}
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 15 },
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
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/base/package')}
        >新增包装物信息
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card bordered={false}>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label='包装代号'>
                  {getFieldDecorator('pkid', {
                    rules: [
                      {
                        required: true,
                        message: '请填写包装名称',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                  })(<Input placeholder='请填写包装代号' maxLength={24} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <MatrixAutoComplete
                  label='物资'
                  placeholder='拼音码检索'
                  xs={9}
                  dataType='goods'
                  id='materialno'
                  labelId='materialnoName'
                  form={form}
                  required
                />
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label='包装名称'>
                  {getFieldDecorator('pkname', {
                    rules: [
                      {
                        required: true,
                        message: '请填写包装名称',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                  })(<Input placeholder='请填写包装名称' maxLength={256} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label='包装单位'>
                  {getFieldDecorator('unit', {
                    rules: [
                      {
                        message: '请填写包装单位',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                  })(<Input placeholder='请填写包装单位' maxLength={256} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label='包装数量(个)'>
                  {getFieldDecorator('pkqty', {
                    rules: [
                      {
                        required: true,
                        message: '请填写包装数量',
                      },
                      {
                        message: '只允许录入正整数',
                        pattern: /^[1-9](\d{0,10})$/,
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                  })(<Input placeholder='请填写包装数量' maxLength={16} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label='包装重量(kg)'>
                  {getFieldDecorator('pkwgt', {
                    rules: [
                      {
                        required: true,
                        message: '请填写包装重量',
                      },
                      {
                        message: '只能录入大于零的数,小数位最多保留两位',
                        pattern: /^[1-9]*[0-9]?(\.[0-9]{1,2})?$/,
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                  })(<Input placeholder='请填写包装重量' maxLength={16} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="备注">
                  {getFieldDecorator('remark', {
                    rules: [
                      {
                        max: 255,
                        message: '备注不能大于1024个字符',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                  })(
                    <TextArea
                      style={{ minHeight: 32 }}
                      placeholder="请填写备注"
                      rows={3}
                    />,
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
  export default PackageAdd;
