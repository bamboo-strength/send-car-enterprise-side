import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Button, InputNumber, TreeSelect, Select } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import func from '../../../utils/Func';
import { DEPT_INIT, DEPT_SUBMIT, DEPT_DETAIL, DEPT_CLEAR_DETAIL } from '../../../actions/dept';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ dept, loading }) => ({
  dept,
  submitting: loading.effects['dept/submit'],
}))
@Form.create()
class DeptAdd extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    if (func.notEmpty(id)) {
      dispatch(DEPT_DETAIL(id));
    } else {
      dispatch(DEPT_CLEAR_DETAIL());
    }
    dispatch(DEPT_INIT());
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch(DEPT_SUBMIT(values));
      }
    });
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

    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
        提交
      </Button>
    );

    return (
      <Panel title="新增机构" back="/system/dept" action={action}>
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <FormItem label="机构简称">
              {getFieldDecorator('deptName', {
                rules: [
                  {
                    required: true,
                    message: '请输入机构简称',
                  },
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  },
                ],
              })(<Input placeholder="请输入机构简称" maxLength={40} />)}
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
              })(<Input placeholder="请输入机构全称" maxLength={40} />)}
            </FormItem>
            <FormItem label="上级机构">
              {getFieldDecorator('parentId', {
                initialValue: detail.id,
              })(
                <TreeSelect
                  disabled={func.notEmpty(detail.id)}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={tree}
                  allowClear
                  showSearch
                  treeNodeFilterProp="title"
                  placeholder="请选择上级机构"
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
                initialValue: detail.nextSort,
              })(<InputNumber placeholder="请输入机构排序" />)}
            </FormItem>
            <FormItem label="机构备注">
              {getFieldDecorator('remark',{
                rules: [
                  {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                  },
                ],
              })(<TextArea rows={4} placeholder="请输入机构备注" maxLength={100} />)}
            </FormItem>
          </Card>
        </Form>
      </Panel>
    );
  }
}

export default DeptAdd;
