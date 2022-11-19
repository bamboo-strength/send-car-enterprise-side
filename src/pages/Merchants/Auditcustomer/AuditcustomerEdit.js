import React, { PureComponent } from 'react';
import { Form, Card, Col, Input, Row, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import {Button,Icon, NavBar } from 'antd-mobile';
import styles from '../../../layouts/Sword.less';
import { AUDITCUSTOMER_DETAIL} from '../../../actions/auditcustomer';
import MatrixAutoComplete from '../../../components/Matrix/MatrixAutoComplete';
import { disagree } from '@/services/auditcustomer'

const FormItem = Form.Item;
const { Meta } = Card;
const { TextArea } = Input;

@connect(({ auditcustomer, loading }) => ({
  auditcustomer,
  submitting: loading.effects['/businessInto/auditcustomer'],
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
    dispatch(AUDITCUSTOMER_DETAIL(id));
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
          auditFlag:1,
          id,
          ...values,
        };
        this.setState({ submitting: true });
        disagree(params).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            router.push('/businessInto/auditcustomer');
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
          auditFlag:0,
          id,
          ...values,
        };
        this.setState({ submitting: true });
        disagree(params).then(resp => {
          if (resp.success) {

            message.success(resp.msg);
            router.push('/businessInto/auditcustomer');
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
        router.push('/businessInto/auditcustomer');
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      auditcustomer: {detail},
      submitting,
    } = this.props;
   const {form}=this.props;
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
        <Button type="primary" onClick={this.handleAccpet} loading={submitting} style={{marginTop:'20px'}}>
          审核通过
        </Button>
        <Button type="danger" onClick={this.handleAcceptance} loading={submitting} style={{marginTop:'20px'}}>
          驳回
        </Button>
      </div>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/businessInto/auditcustomer')}
        >入驻客户审核
        </NavBar>
        <Form style={{ marginTop: 8 }}>
          <Card bordered={false} style={{paddingBottom:'45px'}}>
          <Row gutter={16}>
          <Col span={8}>
              <FormItem {...formItemLayout} label="企业名称">
                <span>{detail.tenantName}</span>
              </FormItem>
            <FormItem {...formItemLayout} label="开户行">
              <span>{detail.bankName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="统一社会信用代码">
              <span>{detail.cods}</span>
            </FormItem>
            <MatrixAutoComplete label='客户名称' placeholder='拼音码检索' dataType='customer' id='customerId' labelId='customerName' value={detail.customerId} labelValue={detail.customerName} form={form} required />
            <FormItem {...formItemLayout} label="审核备注">
              {getFieldDecorator('auditRemark', {
                rules: [
                  {
                    required: false,
                    message: '请填写审核备注内容',
                  },
                ],
              })(<TextArea style={{ minHeight: 32 }} placeholder="请填写审核备注内容" rows={4} maxLength={100} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="ID主键" style={{display:'none'}}>
              {getFieldDecorator('id', {
                initialValue: detail.id,
              })(<Input placeholder="" disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="客户类型" style={{display:'none'}}>
              {getFieldDecorator('customerType', {
                initialValue: detail.customerType,
              })(<Input placeholder="" disabled />)}
            </FormItem>
          </Col>
            <Col span={8}>
            <FormItem {...formItemLayout} label="生产许可证">
              <span>{detail.productLicense}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="经营许可证">
              <span>{detail.businessLicense}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="联系人">
              <span>{detail.linkman}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="联系电话">
              <span>{detail.contactNumber}</span>
            </FormItem>
          </Col>
          <Col span={8}>
            <Card
              className={styles.card}
              bordered={false}
              // hoverable
              style={{width: 300, height: 250}}
              cover={<img alt="example" src={detail.identityPicsFront} />}
            >
              <Meta title="营业执照" />
            </Card>
          </Col>
          </Row>
        </Card>
          {action}
        </Form>
      </div>
    );

  }
}

export default ProductAudit;
