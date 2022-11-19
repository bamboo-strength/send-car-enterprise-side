import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Form, Card, Button } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { JGRELATION_DETAIL } from '../../../actions/jgRelation';

const FormItem = Form.Item;

@connect(({ jgRelation }) => ({
  jgRelation,
}))
@Form.create()
class JgRelationView extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(JGRELATION_DETAIL(id));
  }

  handleEdit = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`/automatic/jgRelation/edit/${id}`);
  };

  render() {
    const {
      jgRelation: { detail },
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
      <Button type="primary" onClick={this.handleEdit}>
        修改
      </Button>
    );

    return (
      <Panel title="查看" back="/automatic/jgRelation" action={action}>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <Card className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="账号">
              <span>{detail.account}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="极光推送registration_id(终端注册时回传)">
              <span>{detail.registrationId}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="标签 tags (终端注册时回传)">
              <span>{detail.tags}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="别名 alias (终端注册时回传)">
              <span>{detail.alias}</span>
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}
export default JgRelationView;
