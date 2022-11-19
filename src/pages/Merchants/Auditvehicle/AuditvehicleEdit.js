import React, { PureComponent } from 'react';
import { Form, Card, Input, message } from 'antd';
import { Button, Icon, NavBar } from 'antd-mobile';
import { connect } from 'dva';
import router from 'umi/router';
import { AUDITVEHICLE_DETAIL } from '../../../actions/auditvehicle';
import { disagree } from '@/services/auditvehicle';

const FormItem = Form.Item;
const { Meta } = Card;
const { TextArea } = Input;

@connect(({ auditvehicle, loading }) => ({
  auditvehicle,
  submitting: loading.effects['/businessInto/auditvehicle'],
}))
@Form.create()
class ProductAudit extends PureComponent {

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(AUDITVEHICLE_DETAIL(id));
  }

  handleAccpet = e => {
    e.preventDefault();
    const {
      form,
      match: {
        params: { id },
      },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          auditFlag: 1,
          id,
          ...values,
        };
        this.setState({ submitting: true });
        disagree(params).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            router.push('/businessInto/auditvehicle');
          } else {
            message.error(resp.msg || '审核失败');
          }
          this.setState({ submitting: false });
        });
      }
    });
  };

  handleAcceptance = e => {
    e.preventDefault();
    const {
      form,
      match: {
        params: { id },
      },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          auditFlag: 0,
          id,
          ...values,
        };
        this.setState({ submitting: true });
        disagree(params).then(resp => {
          if (resp.success) {

            message.success(resp.msg);
            router.push('/businessInto/auditvehicle');
          } else {
            message.error(resp.msg || '驳回失败');
          }
          this.setState({ submitting: false });
        });
      }
    });
  };

  handleReturn = e => {
    e.preventDefault();
    const {
      form,
    } = this.props;
    form.validateFieldsAndScroll((err) => {
      if (!err) {
        this.setState({ submitting: true });
        router.push('/businessInto/auditvehicle');
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      auditvehicle: { detail },
      submitting,
    } = this.props;
    const { form } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const action = (
      <div>
        <Button type="primary" onClick={this.handleAccpet} loading={submitting} style={{ marginTop: '20px' }}>
          审核通过
        </Button>
        <Button type="danger" onClick={this.handleAcceptance} loading={submitting} style={{ marginTop: '20px' }}>
          驳回
        </Button>
      </div>
    );
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/businessInto/auditvehicle')}
        >入驻车辆审核
        </NavBar>
        <Form className='am-list'>
          <Card bordered={false} style={{ paddingBottom: '45px' }}>
            <FormItem {...formItemLayout} label="企业名称">
              <span>{detail.tenantName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="车号">
              <span>{detail.truckno}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="车辆类型">
              <span>{detail.trucktypeName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="审核备注">
              {getFieldDecorator('auditRemark', {
                rules: [
                  {
                    required: false,
                    message: '请填写审核备注内容',
                  },
                ],
              })(<TextArea style={{ minHeight: 32 }} placeholder="请填写审核备注内容" rows={4} maxLength={100}/>)}
            </FormItem>
          </Card>
          {action}
        </Form>
      </div>
    );

  }
}

export default ProductAudit;
