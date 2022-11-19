import React, { PureComponent } from 'react';
import { Form, Card, Button, Select, Upload, Icon, Tooltip, message } from 'antd';
import { connect } from 'dva';
import Panel from '../../components/Panel';
import styles from '../../layouts/Sword.less';
import { FLOW_INIT, FLOW_DEPLOY_UPLOAD } from './actions/flow';

const FormItem = Form.Item;

@connect(({ flow, loading }) => ({
  flow,
  submitting: loading.effects['flow/deployUpload'],
}))
@Form.create()
class FlowDeploy extends PureComponent {
  state = {
    fileList: [],
  };

  // ============ 初始化数据 ===============
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(FLOW_INIT());
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { fileList } = this.state;
    if (fileList.length === 0) {
      message.warn('请先上传部署文件');
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          fileList,
          ...values,
        };
        dispatch(FLOW_DEPLOY_UPLOAD(params));
      }
    });
  };

  render() {
    const { fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        if (file.name.indexOf('.bpmn20.xml') === -1) {
          message.warn('请上传 bpmn20.xml 标准格式文件');
          return false;
        }
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    const {
      form,
      submitting,
      flow: {
        init: { flowCategory },
      },
    } = this.props;

    const { getFieldDecorator } = form;

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
        执行部署
      </Button>
    );

    return (
      <Panel title="流程文件上传" back="/system/param" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card className={styles.card} bordered={false}>
            <FormItem {...formItemLayout} label="流程类型">
              {getFieldDecorator('flowCategory', {
                rules: [
                  {
                    required: true,
                    message: '请选择流程类型',
                  },
                ],
              })(
                <Select placeholder="请选择流程类型">
                  {flowCategory.map(d => (
                    <Select.Option key={`flow_${d.dictKey}`} value={`flow_${d.dictKey}`}>
                      {d.dictValue}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="流程文件">
              <Upload {...props}>
                <Tooltip placement="top" title="请上传 bpmn20.xml 标准格式文件">
                  <Button>
                    <Icon type="upload" /> 选择文件
                  </Button>
                </Tooltip>
              </Upload>
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default FlowDeploy;
