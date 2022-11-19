import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, message, Col } from 'antd';
import router from 'umi/router';
import { Icon, NavBar, Button } from 'antd-mobile';
import func from '@/utils/Func';
import { TRUCKINFO_DETAIL, TRUCKINFO_SUBMIT, TRUCKINFO_DETAIL_M } from '../../../actions/truckinfo';
import { getCurrentUser } from '../../../utils/authority';
import MatrixInput from '@/components/Matrix/MatrixInput';
import MatrixSelect from '@/components/Matrix/MatrixSelect';

const FormItem = Form.Item;

@connect(({ truckinfo, loading }) => ({
  truckinfo,
  loading: loading.models.truckinfo,
}))
@Form.create()
class TruckinfoEdit extends PureComponent {

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(TRUCKINFO_DETAIL(id));
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      dispatch,
      form,
      match: {
        params: { id },
      },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id,
          ...values,
          starttime: func.format(values.starttime),
          endtime: func.format(values.endtime),
          isDeleted: 0,
        };
        const checkParams = {
          truckno: values.truckno,
          tenant_id: getCurrentUser().tenantId,
        };

        dispatch(TRUCKINFO_DETAIL_M(checkParams)).then(() => {
          const {
            truckinfo: { detail },
          } = this.props;

          if (detail !== null && detail.id != null && detail.id === id) {
            dispatch(TRUCKINFO_SUBMIT(params));
          } else if (detail != null && detail.truckno !== undefined) {
            message.info(`${detail.truckno}该车号已存在,请核实!`);
          } else {
            dispatch(TRUCKINFO_SUBMIT(params));
          }
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      truckinfo: {
        detail,
      },
      form,
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
      <Button type="primary" onClick={this.handleSubmit} style={{ marginTop: '20px' }}>
        提交
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/base/truckinfo')}
        >修改车辆信息
        </NavBar>
        <div className='am-list'>
          <Form hideRequiredMark={false}>
            <Card bordered={false}>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="车号" colon>
                  {getFieldDecorator('truckno', {
                    rules: [
                      {
                        required: true,
                        message: '请输入车号',
                      },
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                      {
                        pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
                        message: '车号输入不正确',
                      },
                    ],
                    initialValue: detail.truckno,
                  })(<Input placeholder="请输入车号" maxLength={7} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <MatrixSelect
                  label="车轴数"
                  id="axles"
                  form={form}
                  xs={9}
                  dictCode='axlesName'
                  required
                  initialValue={detail.axles}
                />
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="司机姓名">
                  {getFieldDecorator('drivername', {
                    rules: [
                      {
                        message: '请输入司机姓名',
                      },
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                    ],
                    initialValue: detail.drivername,
                  })(<Input placeholder="请输入司机姓名" maxLength={20} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <MatrixInput
                  label="司机身份证"
                  placeholder="请输入司机身份证"
                  id="driveridno"
                  xs={9}
                  numberType="isIdCardNo"
                  initialValue={detail.driveridno}
                  form={form}
                  maxLength={18}
                />
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="司机手机号">
                  {getFieldDecorator('phone', {
                    rules: [
                      {
                        message: '请输入司机手机号',
                      },
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                      {
                        pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/,
                        message: '手机号格式不正确',
                      },
                    ],
                    initialValue: detail.phone,
                  })(<Input placeholder="请输入司机手机号" maxLength={11} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>

                <FormItem {...formItemLayout} label="备注">
                  {getFieldDecorator('remark', {
                    initialValue: detail.remark,
                  })(<Input.TextArea placeholder="请输入备注" maxLength={100} />)}
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

export default TruckinfoEdit;
