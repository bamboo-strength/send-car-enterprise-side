import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row } from 'antd';
import Panel from '../../../components/Panel';
import { JGRELATION_LIST } from '../../../actions/jgRelation';
import Grid from '../../../components/Sword/Grid';

const FormItem = Form.Item;

@connect(({ jgRelation, loading }) => ({
  jgRelation,
  loading: loading.models.jgRelation,
}))
@Form.create()
class JgRelation extends PureComponent {
  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(JGRELATION_LIST(params));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="查询名称">
            {getFieldDecorator('name')(<Input placeholder="查询名称" />)}
          </FormItem>
        </Col>
        <Col>
          <div style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={onReset}>
              重置
            </Button>
          </div>
        </Col>
      </Row>
    );
  };

  render() {
    const code = 'jgRelation';

    const {
      form,
      loading,
      jgRelation: { data },
    } = this.props;

    const columns = [
      {
        title: '账号',
        dataIndex: 'account',
      },
      {
        title: '极光推送registration_id(终端注册时回传)',
        dataIndex: 'registrationId',
      },
      {
        title: '标签 tags (终端注册时回传)',
        dataIndex: 'tags',
      },
      {
        title: '别名 alias (终端注册时回传)',
        dataIndex: 'alias',
      },
    ];

    return (
      <Panel>
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          loading={loading}
          data={data}
          columns={columns}
        />
      </Panel>
    );
  }
}
export default JgRelation;
