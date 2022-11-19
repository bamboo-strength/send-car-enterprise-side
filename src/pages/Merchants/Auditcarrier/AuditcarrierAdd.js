import React, { PureComponent } from 'react';
import { Form, Card, Select, Col } from 'antd/lib/index';
import { connect } from 'dva/index';
import { Icon, NavBar, Button } from 'antd-mobile';
import router from 'umi/router';
import { AUDITCARRIER_ADD, AUDITCARRIER_INIT,UPDATESTATE } from '../../../actions/auditcarrier';
import { getCurrentUser } from '../../../utils/authority';
import MatrixAutoComplete from '../../../components/Matrix/MatrixAutoComplete';


const FormItem = Form.Item;

@connect(({ auditcarrier, loading }) => ({
  auditcarrier,
  submitting: loading.effects['businessinto/auditcarrier'],
}))
@Form.create()
class AuditcarrierAdd extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(AUDITCARRIER_INIT({
      code: ['relationTelentList'],
    }));
  }


  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const params = {
        carrierType: 2,
        relationTenant: getCurrentUser().tenantId,
        ...values,
      };
      dispatch(UPDATESTATE({ submitLoading: true }))
      dispatch(AUDITCARRIER_ADD(params));
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      auditcarrier: {
        init: {
          relationTelentList,
        },
        submitLoading
      },

    } = this.props;
    const { form } = this.props;


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
      <Button type="primary" onClick={this.handleSubmit} style={{ marginTop: '20px' }} loading={submitLoading}>
        新增
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/businessinto/auditcarrier')}
        >新增
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card bordered={false}>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="企业名称">
                  {getFieldDecorator('tenantId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择企业名称',
                      },
                    ],
                  })(
                    <Select
                      placeholder="请选择企业名称"
                    >
                      {relationTelentList && relationTelentList.map(d => (
                        <Select.Option key={d.tenant_id} value={d.tenant_id}>
                          {d.tenant_name}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <MatrixAutoComplete
                  label='承运商名称'
                  placeholder='拼音码检索'
                  xs={9}
                  dataType='carrier'
                  required
                  id='carrierId'
                  labelId='carrierName'
                  form={form}
                />
              </Col>
            </Card>
          </Form>
          {action}
        </div>
      </div>
    );
  }
}

export default AuditcarrierAdd;
