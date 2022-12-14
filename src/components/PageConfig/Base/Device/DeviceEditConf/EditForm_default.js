import React, { PureComponent } from 'react';
import { Form, Input, Card, Button, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../../../Panel';
import styles from '../../../../../layouts/Sword.less';
import { DEVICE_DETAIL, DEVICE_INIT, DEVICE_SUBMIT,DEVICE_DETAIL_M  } from '../../../../../actions/device';
import { getCurrentUser } from '../../../../../utils/authority';
import func from '@/utils/Func';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ device ,loading}) => ({
  device,
  loading: loading.models.device,
}))
@Form.create()
class EditForm_default extends PureComponent {

  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
    jfstartValue: null,
    dqendValue: null,
    endOpen2: false,
  };

  componentWillMount() {
    const {parentProps} = this.props;
    // console.log('---EditForm_948728---')
    // console.log(parentProps)
    // console.log(this.props)
    const {
      match: {
        params: { id },
      },
    } = parentProps;
    const {
      dispatch,
    } = this.props;
    dispatch(DEVICE_DETAIL(id));
    dispatch(DEVICE_INIT(
      {
        code: ['devicetype','deviceStatus','protocol','monitoring_devicetype']
      }
    ));
  }

  handleSubmit = e => {
    e.preventDefault();
    const {parentProps} = this.props;

    const {
      dispatch,
      form,
    } = this.props;

    const {
      match: {
        params: { id },
      },
    } = parentProps;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const checkParams = {
          deviceno: values.deviceno,
          simno: values.simno,
          tenantId: getCurrentUser().tenantId,
        };

        const params = {
          id,
          ...values,
          starttime: func.format(values.starttime),
          endtime: func.format(values.endtime),
          installTime: func.format(values.installTime),
          devActTime: func.format(values.devActTime),
          onlinetime: func.format(values.onlinetime),
        };

        dispatch(DEVICE_DETAIL_M(checkParams)).then(()=>{
          const {
            device: { detail },
          } = this.props;
          if (detail === null || detail.id==null|| detail.id ===0 || id === detail.id){
            dispatch(DEVICE_SUBMIT(params));
          }else if (detail != null && id !== detail.id){
            message.info('??????????????????sim???????????????,??????????????????!');
          }
        });

        // dispatch(DEVICE_CHECk(checkParams)).then(() => {
        //   const {
        //     device: { checkStatus },
        //   } = this.props;
        //   if (checkStatus){
        //     const params = {
        //       id,
        //       ...values,
        //       starttime: func.format(values.starttime),
        //       endtime: func.format(values.endtime),
        //       installTime: func.format(values.installTime),
        //       devActTime: func.format(values.devActTime),
        //       onlinetime: func.format(values.onlinetime),
        //     };
        //     // console.log('params',params);
        //     dispatch(DEVICE_SUBMIT(params));
        //   }
        // });

      }
    });
  };

  // -----------------???????????? start ------------------------------------
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
      device: {
        detail,
        init: {devicetypeName,deviceStatusName,protocolName,moinDeviceTypeName}
      },
      submitting,
    } = this.props;

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

    const { startValue, endValue, endOpen } = this.state;
    const { jfstartValue, dqendValue, endOpen2 } = this.state;

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        ??????
      </Button>
    );

    return (
      <Panel title="??????????????????" back="/base/device" action={action}>
        <Form hideRequiredMark={false} style={{ marginTop: 8 }}>
          <Card title="????????????" className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('deviceno', {
                rules: [
                  {
                    required: true,
                    message: '???????????????',
                  },{
                    pattern: /^[^\s]*$/,
                    message: '??????????????????',
                  },
                ],
                initialValue: detail.deviceno,
              })(<Input placeholder="???????????????" readOnly="readOnly" disabled='disabled' />)}
            </FormItem>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('devicetype',{
                rules: [
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ],
                initialValue: detail.devicetype,
              })(
                <Select
                  placeholder="?????????????????????"
                >
                  {devicetypeName.map(d => (
                    <Select.Option key={d.dictKey} value={d.dictKey}>
                      {d.dictValue}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="??????SIM??????">
              {getFieldDecorator('simno', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    required: true,
                    message: '?????????11???????????????SIM??????',
                    pattern: new RegExp(/^\d{11}$/)
                  },
                ],
                initialValue: detail.simno,
              })(<Input placeholder="?????????11???????????????SIM??????" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="???????????????">
              {getFieldDecorator('deviceFQH', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    required: true,
                    message: '?????????6-9????????????????????????',
                    pattern: new RegExp(/^\d{6,9}$/)
                  },
                ],
                initialValue: detail.deviceFQH,
              })(<Input placeholder="?????????6-9????????????????????????" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('starttime', {
                rules: [
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ],initialValue: func.moment(detail.starttime),
              })(<DatePicker disabledDate={this.disabledStartDate2} showTime format="YYYY-MM-DD HH:mm:ss" value={jfstartValue} onChange={this.onStartChange2} placeholder="?????????????????????" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('endtime', {
                rules: [
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ],
                initialValue:func.moment(detail.endtime),
              })(<DatePicker disabledDate={this.disabledEndDate2} showTime format="YYYY-MM-DD HH:mm:ss" value={dqendValue} onChange={this.onEndChange} open={endOpen2} onOpenChange={this.handleEndOpenChange2} placeholder="?????????????????????" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('deviceStatus',{
                rules: [
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ], initialValue: detail.status,
              })(
                <Select
                  placeholder="?????????????????????"
                >
                  {deviceStatusName.map(d => (
                    <Select.Option key={d.dictKey} value={d.dictKey}>
                      {d.dictValue}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('installTime', {
                rules: [
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ],
                initialValue: func.moment(detail.installTime),
              })(<DatePicker disabledDate={this.disabledStartDate} showTime format="YYYY-MM-DD HH:mm:ss" value={startValue} onChange={this.onStartChange} placeholder="?????????????????????" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="?????????">
              {getFieldDecorator('installUser', {
                rules: [
                  {
                    required: true,
                    message: '????????????????????????????????????????????????????????????????????????1-10???',
                    pattern: new RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_]{1,10}$/)
                  },
                ],
                initialValue: detail.installUser,
              })(<Input placeholder="????????????????????????????????????????????????????????????????????????1-10???" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="??????????????????">
              {getFieldDecorator('devActTime', {
                rules: [
                  {
                    required: true,
                    message: '???????????????????????????',
                  },
                ],
                initialValue:  func.moment(detail.devActTime),
              })(<DatePicker placeholder="???????????????????????????" disabledDate={this.disabledEndDate} showTime format="YYYY-MM-DD HH:mm:ss" value={endValue} onChange={this.onEndChange} open={endOpen} onOpenChange={this.handleEndOpenChange} />)}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="????????????">*/}
            {/*  {getFieldDecorator('protocol', {*/}
            {/*    rules: [*/}
            {/*      {*/}
            {/*        required: true,*/}
            {/*        message: '?????????????????????',*/}
            {/*      },*/}
            {/*    ],*/}
            {/*    initialValue: detail.protocol,*/}
            {/*  })(*/}
            {/*    <Select*/}
            {/*      placeholder="?????????????????????"*/}
            {/*    >*/}
            {/*      {protocolName.map(d => (*/}
            {/*        <Select.Option key={d.dictKey} value={d.dictKey}>*/}
            {/*          {d.dictValue}*/}
            {/*        </Select.Option>*/}
            {/*      ))}*/}
            {/*    </Select>*/}
            {/*  )}*/}
            {/*</FormItem>*/}
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('moindevicetype', {
                rules: [
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ],
                initialValue: detail.moindevicetype,
              })(
                <Select
                  placeholder="?????????????????????????????????"
                >
                  {moinDeviceTypeName.map(d => (
                    <Select.Option key={d.dictKey} value={d.dictKey}>
                      {d.dictValue}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="??????">
              {getFieldDecorator('remark', {
                rules: [
                  {
                    max: 50,
                    message: '??????????????????50?????????',
                  },
                ],
                initialValue: detail.remark,
              })(<TextArea style={{ minHeight: 32 }} placeholder="??????????????????????????????50????????????" rows={4} />)}
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default EditForm_default;
