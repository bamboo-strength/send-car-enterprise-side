import React, { PureComponent } from 'react';
import { Form, Card, Col, Input, Row, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import {Button,Icon, NavBar } from 'antd-mobile';
import { AUDITCARRIER_DETAIL} from '../../../actions/auditcarrier';
import { disagree } from '@/services/auditcarrier'
import MatrixAutoComplete from '../../../components/Matrix/MatrixAutoComplete';

const FormItem = Form.Item;
const { Meta } = Card;
const { TextArea } = Input;

@connect(({ auditcarrier, loading }) => ({
  auditcarrier,
  submitting: loading.effects['/businessInto/auditcarrier'],
}))
@Form.create()
class AuditcarrierEdit extends PureComponent {

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(AUDITCARRIER_DETAIL(id));
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
            router.push('/businessInto/auditcarrier');
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
            router.push('/businessInto/auditcarrier');
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
        router.push('/businessInto/auditcarrier');
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      auditcarrier: {detail},
      submitting,
    } = this.props;
    const {form}=this.props;
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
          onLeftClick={() => router.push('/businessinto/auditcarrier')}
        >入驻企业承运商审核
        </NavBar>
        <Form style={{ marginTop: 8 }}>
          <Card  className={styles.card} bordered={false} style={{paddingBottom:'45px'}}>
            <FormItem {...formItemLayout} label="企业名称">
              <span>{detail.tenantName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="开户行">
              <span>{detail.bankName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="统一社会信用代码">
              <span>{detail.cods}</span>
            </FormItem>
            <MatrixAutoComplete label='承运商名称' placeholder='拼音码检索' dataType='carrier' id='carrierId' labelId='carrierName' value={detail.carrierId} labelValue={detail.carrierName} form={form} required />
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
            <FormItem {...formItemLayout} label="租户号" style={{display:'none'}}>
              {getFieldDecorator('tenantId', {
                initialValue: detail.tenantId,
              })(<Input placeholder="" disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="关联的租户" style={{display:'none'}}>
              {getFieldDecorator('relationTenant', {
                initialValue: detail.relationTenant,
              })(<Input placeholder="" disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="承运商类型" style={{display:'none'}}>
              {getFieldDecorator('carrierType', {
                initialValue: detail.carrierType,
              })(<Input placeholder="" disabled />)}
            </FormItem>
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
            <Card
              className={styles.card}
              bordered={false}
              // hoverable
              style={{width: 300, height: 250}}
              cover={<img alt="example" src={detail.identityPicsFront} />}
            >
              <Meta title="营业执照" />
            </Card>
          </Card>
        </Form>
        {action}
      </div>
    );

  }
}

export default AuditcarrierEdit;
