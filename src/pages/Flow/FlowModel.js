import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Tag } from 'antd';
import Panel from '../../components/Panel';
import { FLOW_INIT, FLOW_MODEL_LIST } from './actions/flow';
import Grid from '../../components/Sword/Grid';
import { deployModel } from '../../services/flow';
import styles from '../../layouts/Sword.less';
import func from '../../utils/Func';
import { flowDesignUrl } from '../../defaultSettings';

const FormItem = Form.Item;

@connect(({ flow, loading }) => ({
  flow,
  loading: loading.models.flow,
}))
@Form.create()
class FlowModel extends PureComponent {
  state = {
    designVisible: false,
    deployVisible: false,
    deployLoading: false,
    modelId: '',
    src: '',
  };

  // ============ 初始化数据 ===============
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(FLOW_INIT());
  }

  showDesignModal = path => {
    this.setState({
      designVisible: true,
      src: path,
    });
  };

  handleDesignCancel = () => {
    this.setState({
      designVisible: false,
      src: '',
    });
    this.handleDesignReset();
  };

  handleDesignReset = () => {
    this.setState({
      designVisible: false,
      src: '',
    });
  };

  showDeployModal = modelId => {
    this.setState({
      deployVisible: true,
      modelId,
    });
  };

  handleDeployCancel = () => {
    this.setState({
      deployVisible: false,
      modelId: '',
      deployLoading: false,
    });
  };

  handleDeploy = () => {
    const { modelId } = this.state;
    const { form } = this.props;
    const category = form.getFieldValue('flowCategory');
    if (func.isEmpty(category)) {
      message.warn('请先选择流程类型');
      return;
    }
    this.setState({ deployLoading: true });
    deployModel({ modelId, category: `flow_${category}` }).then(resp => {
      if (resp.success) {
        message.success(resp.msg);
      } else {
        message.error(resp.msg || '部署失败');
      }
      this.handleDeployCancel();
    });
  };

  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(FLOW_MODEL_LIST(params));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    this.handleDesignReset = onReset;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="模型标识">
            {getFieldDecorator('modelKey')(<Input placeholder="请输入模型标识" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="模型名称">
            {getFieldDecorator('name')(<Input placeholder="请输入模型名称" />)}
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

  // ============ 处理按钮点击回调事件 ===============
  handleBtnCallBack = payload => {
    const { btn, keys } = payload;
    if (btn.code === 'flow_model_create') {
      this.showDesignModal(`${flowDesignUrl}/index.html`);
      return;
    }
    if (btn.code === 'flow_model_update') {
      if (keys.length === 0) {
        message.warn('请先选择一条数据!');
        return;
      }
      if (keys.length > 1) {
        message.warn('只能选择一条数据!');
        return;
      }
      this.showDesignModal(`${flowDesignUrl}/index.html#/editor/${keys[0]}`);
      return;
    }
    if (btn.code === 'flow_model_download') {
      window.open(`${flowDesignUrl}/app/rest/models/${keys[0]}/bpmn20`);
      return;
    }
    if (btn.code === 'flow_model_deploy') {
      this.showDeployModal(keys[0]);
    }
  };

  render() {
    const code = 'flow_model';

    const {
      form,
      loading,
      flow: {
        model,
        init: { flowCategory },
      },
    } = this.props;

    const { getFieldDecorator } = form;

    const { designVisible, deployVisible, src, deployLoading } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 15 },
      },
    };

    const columns = [
      {
        title: '模型主键',
        dataIndex: 'id',
      },
      {
        title: '模型标识',
        dataIndex: 'modelKey',
      },
      {
        title: '模型名称',
        dataIndex: 'name',
      },
      {
        title: '流程版本',
        dataIndex: 'version',
        render: version => (
          <span>
            <Tag color="geekblue" key={version}>
              v{version}
            </Tag>
          </span>
        ),
      },
      {
        title: '创建时间',
        dataIndex: 'created',
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdated',
      },
    ];

    return (
      <Panel>
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          btnCallBack={this.handleBtnCallBack}
          loading={loading}
          data={model}
          columns={columns}
        />
        <Modal
          width={1366}
          height={768}
          style={{ top: 20 }}
          visible={designVisible}
          onOk={this.handleDesignCancel}
          onCancel={this.handleDesignCancel}
        >
          <iframe
            src={src}
            width={1300}
            height={700}
            title="流程设计器"
            frameBorder="no"
            border="0"
            marginWidth="0"
            marginHeight="0"
            scrolling="no"
            allowTransparency="yes"
          />
        </Modal>
        <Modal
          title="流程部署配置"
          width={400}
          visible={deployVisible}
          onOk={this.handleDeploy}
          confirmLoading={deployLoading}
          onCancel={this.handleDeployCancel}
        >
          <Form style={{ marginTop: 8 }}>
            <Card className={styles.card} bordered={false}>
              <FormItem {...formItemLayout} label="流程类型">
                {getFieldDecorator('flowCategory')(
                  <Select placeholder="请选择流程类型">
                    {flowCategory.map(d => (
                      <Select.Option key={d.dictKey} value={d.dictKey}>
                        {d.dictValue}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Card>
          </Form>
        </Modal>
      </Panel>
    );
  }
}
export default FlowModel;
