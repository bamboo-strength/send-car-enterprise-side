import React, { PureComponent } from 'react';
import { Form, Input, Card, Select, DatePicker } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import { Icon, NavBar, Button } from 'antd-mobile';
import router from 'umi/router';
import { NOTICE_INIT, NOTICE_DETAIL, NOTICE_SUBMIT } from '../../../actions/notice';
import func from '../../../utils/Func';
import styles from '../../../layouts/Sword.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ notice, loading }) => ({
  notice,
  submitting: loading.effects['notice/submit'],
}))
@Form.create()
class NoticeAdd extends PureComponent {

  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(NOTICE_INIT());
    dispatch(NOTICE_DETAIL(id));
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
        releaseTime: func.format(values.releaseTime),
      };
      dispatch(NOTICE_SUBMIT(params));
    });
  };

  disabledDate = endValue => {
    const { startValue } = this.state;
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

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleOpenChange = open => {
    this.onChange('startValue', new Date());
    this.setState({ endOpen: open });
  };

  render() {
    const { endValue, endOpen } = this.state;

    const {
      form: { getFieldDecorator },
      notice: { init, detail },
      submitting,
    } = this.props;

    const { category } = init;

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
      <Button type="primary" onClick={this.handleSubmit} loading={submitting} style={{ marginTop: '20px' }}>
        <FormattedMessage id="button.submit.name"/>
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/desk/notice')}
        >修改公告
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card bordered={false}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="desk.notice.title"/>} className='add-config'>
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'desk.notice.title.validation' }),
                    },
                    {
                      pattern: /^[^\s]*$/,
                      message: '禁止输入空格',
                    },
                  ],
                  initialValue: detail.title,
                })(<Input placeholder={formatMessage({ id: 'desk.notice.title.placeholder' })} maxLength={100}/>)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="desk.notice.category"/>}
                        className='add-config'>
                {getFieldDecorator('category', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'desk.notice.category.validation' }),
                    },
                  ],
                  initialValue: detail.category,
                })(
                  <Select placeholder={formatMessage({ id: 'desk.notice.category.placeholder' })}>
                    {category.map(d => (
                      <Select.Option key={d.dictKey} value={d.dictKey}>
                        {d.dictValue}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="desk.notice.date"/>} className='add-config'>
                {getFieldDecorator('releaseTime', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'desk.notice.date.validation' }),
                    },
                  ],
                  initialValue: moment(detail.releaseTime, 'YYYY-MM-DD HH:mm:ss'),
                })(
                  <DatePicker
                    style={{ width: '100%' }}
                    disabledDate={this.disabledDate}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    value={endValue}
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleOpenChange}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="desk.notice.content"/>} className='add-config'>
                {getFieldDecorator('content', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'desk.notice.content.validation' }),
                    },
                  ],
                  initialValue: detail.content,
                })(
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder={formatMessage({ id: 'desk.notice.content.placeholder' })}
                    rows={3}
                    maxLength={500}
                  />,
                )}
              </FormItem>
            </Card>
          </Form>
          {action}
        </div>
      </div>
    );
  }
}

export default NoticeAdd;
