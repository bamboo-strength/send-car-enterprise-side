import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Card,
  Row,
  Col,
  Button,
  InputNumber,
  TreeSelect,
  message,
  Select,
} from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { DEPT_DETAIL, DEPT_INIT, DEPT_SUBMIT } from '../../../actions/dept';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ dept, loading }) => ({
  dept,
  submitting: loading.effects['dept/submit'],
}))
@Form.create()
class DeptEdit extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(DEPT_DETAIL(id));
    dispatch(DEPT_INIT());
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
    const parentId = form.getFieldValue('parentId');
    if(parentId !== undefined){
      if (id === parentId.toString()) {
        message.warn('上级机构不能选择自身!');
        return;
      }
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id,
          ...values,
        };
        dispatch(DEPT_SUBMIT(params));
      }
    });
  };

  onParentIdChange = (value, title) => {
    console.log(value);
    console.log(title);
  };

  render() {
    const {
      form: { getFieldDecorator },
      dept: {
        detail,
        init: { tree, category },
      },
      submitting,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const formAllItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );

    return (
      <Panel title="修改机构" back="/system/dept" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <FormItem label="机构名称">
              {getFieldDecorator('deptName', {
                rules: [
                  {
                    required: true,
                    message: '请输入机构名称',
                  },
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  },
                ],
                initialValue: detail.deptName,
              })(<Input placeholder="请输入机构名称" maxLength={40} />)}
            </FormItem>
            <FormItem label="机构全称">
              {getFieldDecorator('fullName', {
                rules: [
                  {
                    required: true,
                    message: '请输入机构全称',
                  },
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  },
                ],
                initialValue: detail.fullName,
              })(<Input placeholder="请输入机构全称" maxLength={40} />)}
            </FormItem>
            <FormItem label="上级机构">
              {getFieldDecorator('parentId', {
                rules: [
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  },
                ],
                initialValue: detail.parentId==='0'?'':detail.parentId,
              })(
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={tree}
                  placeholder="请选择上级机构"
                  allowClear
                  showSearch
                  treeNodeFilterProp="title"
                  onChange={this.onParentIdChange}
                />
              )}
            </FormItem>
            <FormItem className={styles.inputItem} label="机构类型">
              {getFieldDecorator('deptCategory', {
                rules: [
                  {
                    required: true,
                    message: '请选择机构类型',
                  },
                ],
                initialValue: detail.deptCategory,
              })(
                <Select placeholder="请选择机构类型">
                  {category.map(d => (
                    <Select.Option key={d.dictKey} value={d.dictKey}>
                      {d.dictValue}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Card>
          <br />
          <Card title="其他信息" className={styles.card} bordered={false}>
            <FormItem className={styles.inputItem} label="机构排序">
              {getFieldDecorator('sort', {
                rules: [
                  {
                    required: true,
                    message: '请输入机构排序',
                  },
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  },
                  {
                    pattern:  /^.{1,10}$/,
                    message: '长度最多10字符',
                  },
                ],
                initialValue: detail.sort,
              })(<InputNumber placeholder="请输入机构排序" />)}
            </FormItem>
            <FormItem label="机构备注">
              {getFieldDecorator('remark', {
                rules: [
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  },
                ],
                initialValue: detail.remark,
              })(<TextArea rows={4} placeholder="请输入机构备注" maxLength={100} />)}
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default DeptEdit;
