import React, { PureComponent } from 'react';
import { Form, Input, Card, Col } from 'antd/lib/index';
import { connect } from 'dva/index';
import { SPEC_SUBMIT, SPEC_DETAIL } from '../../../actions/spec';
import { Icon, NavBar, Button } from 'antd-mobile';
import router from 'umi/router';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ spec, loading }) => ({
  spec,
  submitting: loading.effects['base/spec'],
}))
@Form.create()
class SpecEdit extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    dispatch(SPEC_DETAIL(id));
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
      dispatch(SPEC_SUBMIT(params));
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      spec: { detail },
      submitting,
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
      <Button type="primary" onClick={this.handleSubmit} loading={submitting} style={{ marginTop: '20px' }}>
        提交
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/base/spec')}
        >修改规格信息
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card bordered={false}>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="规格">
                  {getFieldDecorator('spec', {
                    rules: [
                      {
                        required: true,
                        message: '请输入规格',
                      },
                    ],
                    getValueFromEvent: (event) => {
                      return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                    },
                    initialValue: detail.spec,
                  })(<Input placeholder="请输入规格" maxLength={50}/>)}
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
                    <TextArea style={{ minHeight: 32 }} placeholder="请输入备注" rows={4} maxLength={255}/>,
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

export default SpecEdit;
