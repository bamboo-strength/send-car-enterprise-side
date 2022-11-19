import React, { PureComponent } from 'react';
import { Form, Input, Card, Button, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../../Panel';
import styles from '../../../../../layouts/Sword.less';
import { DEVICE_SUBMIT,DEVICE_DETAIL_M } from '../../../../../actions/device';
import { DEVICE_INIT } from '@/actions/device';
import func from '@/utils/Func';
import { getCurrentUser } from '../../../../../utils/authority';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ device ,loading}) => ({
  device,
  loading: loading.models.device,
}))
@Form.create()
class AddForm_default extends PureComponent {

  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
    jfstartValue: null,
    dqendValue: null,
    endOpen2: false,
  };

  componentWillMount() {
    const {
      dispatch,
    } = this.props;
    dispatch(DEVICE_INIT(
      {
        code: ['devicetype','deviceStatus','protocol','monitoring_devicetype']
      }
    ));
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
          starttime: func.format(values.starttime),
          endtime: func.format(values.endtime),
          installTime: func.format(values.installTime),
          devActTime: func.format(values.devActTime),
          onlinetime: func.format(values.onlinetime),
        };

        const checkParams = {
          deviceno: values.deviceno,
          simno: values.simno,
          tenantId: getCurrentUser().tenantId,
        };
        dispatch(DEVICE_DETAIL_M(checkParams)).then(()=>{
          const {
            device: { detail },
          } = this.props;
          if (detail === null || detail.id==null|| detail.id ===0){
            dispatch(DEVICE_SUBMIT(params));
          }else if (detail != null){
            message.info('已存在设备与sim号绑定关系,请勿重复添加!');
          }
        });

        // dispatch(DEVICE_SUBMIT(params));
      }
    });
  };

  // -----------------时间验证 start ------------------------------------
  disabledStartDate = startValue => {
    const { endValue } = this.state;
    // const { form } = this.props;
    // const endValue = form.getFieldValue('devActTime');

    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    // const { form } = this.props;
    // const { startValue } = form.getFieldValue('installTime');

    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  disabledStartDate2 = startValue => {
    const { dqendValue } = this.state;
    // const { form } = this.props;
    // const endValue = form.getFieldValue('devActTime');

    if (!startValue || !dqendValue) {
      return false;
    }
    return startValue.valueOf() > dqendValue.valueOf();
  };

  disabledEndDate2 = endValue => {
    const { jfstartValue } = this.state;
    // const { form } = this.props;
    // const { startValue } = form.getFieldValue('installTime');

    if (!endValue || !jfstartValue) {
      return false;
    }
    return endValue.valueOf() <= jfstartValue.valueOf();
  };

  onStartChange2 = value => {
    this.onChange('jfstartValue', value);
  };

  onEndChange2 = value => {
    this.onChange('dqendValue', value);
  };

  handleStartOpenChange2 = open => {
    if (!open) {
      this.setState({ endOpen2: true });
    }
  };

  handleEndOpenChange2 = open => {
    this.setState({ endOpen2: open });
  };
  // --------------------end-------------------------------------

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      device: {
        init: {devicetypeName,deviceStatusName,protocolName,moinDeviceTypeName}
      },
    } = this.props;

    const { startValue, endValue, endOpen } = this.state;
    const { jfstartValue, dqendValue, endOpen2 } = this.state;

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
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );

    return (
      <Panel title="新增设备信息" back="/base/device" action={action}>
        <Form hideRequiredMark={false} style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="设备编号">
              {getFieldDecorator('deviceno', {
                rules: [
                  {
                    required: true,
                    message: '请输入设备编号',
                  },
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  },
                ],
              })(<Input placeholder="请输入编号" maxLength={20} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备类型">
              {getFieldDecorator('devicetype',{
                rules: [
                  {
                    required: true,
                    message: '请输入设备类型',
                  },
                ],
              })(
                <Select
                  placeholder="请输入设备类型"
                >
                  {devicetypeName.map(d => (
                    <Select.Option key={d.dictKey} value={d.dictKey}>
                      {d.dictValue}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="设备SIM卡号">
              {getFieldDecorator('simno', {
                rules: [
                  {
                    required: true,
                    message: '请输入11位数字设备SIM卡号',
                    pattern: new RegExp(/^\d{11}$/)
                  },
                ],
              })(<Input placeholder="请输入设备SIM卡号" maxLength={20} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="封签号">
              {getFieldDecorator('deviceFQH', {
                rules: [
                  {
                    required: true,
                    message: '请输入6-9位数字设备封签号',
                    pattern: new RegExp(/^\d{6,9}$/)
                  },
                ],
              })(<Input placeholder="请输入6-9位数字设备封签号" maxLength={20} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="缴费时间">
              {getFieldDecorator('starttime', {
                rules: [
                  {
                    required: true,
                    message: '请输入缴费时间',
                  },
                ],
              })(<DatePicker disabledDate={this.disabledStartDate2} showTime format="YYYY-MM-DD HH:mm:ss" value={jfstartValue} onChange={this.onStartChange2} placeholder="请输入缴费时间" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="到期时间">
              {getFieldDecorator('endtime', {
                rules: [
                  {
                    required: true,
                    message: '请输入到期时间',
                  },
                ],
              })(<DatePicker disabledDate={this.disabledEndDate2} showTime format="YYYY-MM-DD HH:mm:ss" value={dqendValue} onChange={this.onEndChange} open={endOpen2} onOpenChange={this.handleEndOpenChange2} placeholder="请输入到期时间" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备状态">
              {getFieldDecorator('deviceStatus',{
                rules: [
                  {
                    required: true,
                    message: '请输入设备状态',
                  },
                ],
              })(
                <Select
                  placeholder="请输入设备状态"
                >
                  {deviceStatusName.map(d => (
                    <Select.Option key={d.dictKey} value={d.dictKey}>
                      {d.dictValue}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="安装时间">
              {getFieldDecorator('installTime', {
                rules: [
                  {
                    required: true,
                    message: '请输入安装时间',
                  },
                ],
              })(<DatePicker disabledDate={this.disabledStartDate} showTime format="YYYY-MM-DD HH:mm:ss" value={startValue} onChange={this.onStartChange} placeholder="请输入安装时间" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="安装人">
              {getFieldDecorator('installUser', {
                rules: [
                  {
                    required: true,
                    message: '请输入设备安装人，允许中文、英文、数字包括下划线1-10位',
                    pattern: new RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_]{1,10}$/)
                  },
                ],
              })(<Input placeholder="请输入设备安装人，允许中文、英文、数字包括下划线1-10位" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备激活时间">
              {getFieldDecorator('devActTime', {
                rules: [
                  {
                    required: true,
                    message: '请输入设备激活时间',
                  },
                ],
              })(<DatePicker disabledDate={this.disabledEndDate} showTime format="YYYY-MM-DD HH:mm:ss" value={endValue} onChange={this.onEndChange} open={endOpen} onOpenChange={this.handleEndOpenChange} placeholder="请输入设备激活时间" />)}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="协议类型">*/}
            {/*  {getFieldDecorator('protocol', {*/}
            {/*    rules: [*/}
            {/*      {*/}
            {/*        required: true,*/}
            {/*        message: '请输入协议类型',*/}
            {/*      },*/}
            {/*    ],*/}
            {/*  })(*/}
            {/*    <Select*/}
            {/*      placeholder="请输入协议类型"*/}
            {/*    >*/}
            {/*      {protocolName.map(d => (*/}
            {/*        <Select.Option key={d.dictKey} value={d.dictKey}>*/}
            {/*          {d.dictValue}*/}
            {/*        </Select.Option>*/}
            {/*      ))}*/}
            {/*    </Select>)}*/}
            {/*</FormItem>*/}
            <FormItem {...formItemLayout} label="监控类型">
              {getFieldDecorator('moindevicetype', {
                rules: [
                  {
                    required: true,
                    message: '请选择监控类型',
                  },
                ],
              })(
                <Select
                  placeholder="请选择监控类型"
                >
                  {moinDeviceTypeName.map(d => (
                    <Select.Option key={d.dictKey} value={d.dictKey}>
                      {d.dictValue}
                    </Select.Option>
                  ))}
                </Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remark')(<TextArea placeholder="请输入备注" maxLength={100} />)}
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default AddForm_default;
