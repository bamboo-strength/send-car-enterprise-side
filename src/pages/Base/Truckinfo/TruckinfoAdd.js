import React, { PureComponent } from 'react';
import { Form, Input, Card, message, Col } from 'antd';
import { connect } from 'dva';
import styles from '../../../layouts/Sword.less';
import func from '@/utils/Func';
import { TRUCKINFO_SUBMIT, TRUCKINFO_DETAIL_M,UPDATESTATE } from '../../../actions/truckinfo';
import { getCurrentUser } from '../../../utils/authority';
import { Icon, NavBar, Button } from 'antd-mobile';
import router from 'umi/router';
import MatrixInput from '@/components/Matrix/MatrixInput';
import MatrixSelect from '@/components/Matrix/MatrixSelect';

const FormItem = Form.Item;

@connect(({ truckinfo }) => ({
  truckinfo,
  // loading: loading.models.truckinfo,
}))
@Form.create()
class TruckinfoAdd extends PureComponent {

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
          starttime: func.format(values.starttime),
          endtime: func.format(values.endtime),
        };
        const checkParams = {
          truckno: values.truckno,
          tenant_id: getCurrentUser().tenantId,
        };
        // 验证是否已经存在了制定车辆.车号,不存在可添加.
        dispatch(TRUCKINFO_DETAIL_M(checkParams)).then(() => {
          const {
            truckinfo: { detail },
          } = this.props;
          if (detail === null || detail.id == null || detail.id === 0) {
            // 将车辆信息存入localstore
            const truck = params;

            localStorage.setItem('truckinfo', JSON.stringify(truck));
            dispatch(UPDATESTATE({ submitLoading: true }))
            dispatch(TRUCKINFO_SUBMIT(params));
          } else {
            message.info('该车已经存在,请勿重复添加!');
          }
        });
      }
    });
  };


  render() {
    const {
      form: { getFieldDecorator },
      form,
      truckinfo:{submitLoading}
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
      <Button type="primary" onClick={this.handleSubmit} style={{ marginTop: '20px' }} loading={submitLoading}>
        提交
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/base/truckinfo')}
        >新增车辆信息
        </NavBar>
        <div className='am-list'>
          <Form hideRequiredMark={false}>
            <Card bordered={false}>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="车号">
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
                  })(<Input placeholder="请输入车号" maxLength={7} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <MatrixSelect label="车轴数" id="axles" form={form} xs={9} required dictCode='axlesName' />
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
                  })(<Input placeholder="请输入司机姓名" maxLength={20} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <MatrixInput label="司机身份证" placeholder="请输入司机身份证" id="driveridno" xs={9} numberType="isIdCardNo" form={form} maxLength={18} />
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
                  })(<Input placeholder="请输入司机手机号" maxLength={11} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="备注">
                  {getFieldDecorator('remark')(<Input.TextArea placeholder="请输入备注" maxLength={100} />)}
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

export default TruckinfoAdd;
