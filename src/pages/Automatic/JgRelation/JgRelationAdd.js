import React, { PureComponent } from 'react';
import { Form, Input, Card, Button } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { JGRELATION_SUBMIT } from '../../../actions/jgRelation';

const FormItem = Form.Item;

@connect(({ loading }) => ({
  submitting: loading.effects['jgRelation/submit'],
}))
@Form.create()
class JgRelationAdd extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch(JGRELATION_SUBMIT(values));
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
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

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );

    return (
      <Panel title="新增" back="/automatic/jgRelation" action={action}>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <Card className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="账号">
              {getFieldDecorator('account', {
                rules: [
                  {
                    required: true,
                    message: '请输入账号',
                  },
                ],
              })(<Input placeholder="请输入账号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="极光推送registration_id(终端注册时回传)">
              {getFieldDecorator('registrationId', {
                rules: [
                  {
                    required: true,
                    message: '请输入极光推送registration_id(终端注册时回传)',
                  },
                ],
              })(<Input placeholder="请输入极光推送registration_id(终端注册时回传)" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="标签 tags (终端注册时回传)">
              {getFieldDecorator('tags', {
                rules: [
                  {
                    required: true,
                    message: '请输入标签 tags (终端注册时回传)',
                  },
                ],
              })(<Input placeholder="请输入标签 tags (终端注册时回传)" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="别名 alias (终端注册时回传)">
              {getFieldDecorator('alias', {
                rules: [
                  {
                    required: true,
                    message: '请输入别名 alias (终端注册时回传)',
                  },
                ],
              })(<Input placeholder="请输入别名 alias (终端注册时回传)" />)}
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default JgRelationAdd;
