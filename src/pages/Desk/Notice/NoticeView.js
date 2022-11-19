import React, { PureComponent } from 'react';
import { Form, Card, Button, Row } from 'antd';
import router from 'umi/router';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Icon, NavBar } from 'antd-mobile';
import { NOTICE_DETAIL } from '../../../actions/notice';

const FormItem = Form.Item;

@connect(({ notice }) => ({
  notice,
}))
@Form.create()
class NoticeAdd extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(NOTICE_DETAIL(id));
  }

  handleEdit = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`/desk/notice/edit/${id}`);
  };

  render() {
    const {
      notice: { detail },
    } = this.props;

    const formItemLayout = {
        labelCol: {
          xs: { span: 40 },
          sm: { span: 33 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 10 },
        },
      }
    ;

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/desk/notice')}
        >查看公告
        </NavBar>
        <Card bordered={false} style={{ paddingBottom: '45px' }} className='am-list'>
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="desk.notice.title" />}>
              <span style={{ wordBreak: 'break-word' }}>{detail.title}</span>
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="desk.notice.category" />}>
              <span>{detail.categoryName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="desk.notice.date"/>}>
              <span>{detail.releaseTime}</span>
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="desk.notice.content" />}>
              <span>{detail.content}</span>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

export default NoticeAdd;
