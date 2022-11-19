import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Tag } from 'antd';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { DEPT_LIST } from '../../../actions/dept';
import { tenantMode } from '../../../defaultSettings';

const FormItem = Form.Item;

@connect(({ dept, loading }) => ({
  dept,
  loading: loading.models.dept,
}))
@Form.create()
class Dept extends PureComponent {
  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(DEPT_LIST(params));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <FormItem label="机构名称">
          {getFieldDecorator('deptName')(<Input placeholder="请输入机构名称" />)}
        </FormItem>
        <FormItem label="租户ID">
          {getFieldDecorator('tenantId')(<Input placeholder="请输入租户ID" />)}
        </FormItem>
        <FormItem label="机构全称">
          {getFieldDecorator('fullName')(<Input placeholder="请输入机构全称" />)}
        </FormItem>
        <div style={{ float: 'right' }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onReset}>
            重置
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const code = 'dept';

    const {
      form,
      loading,
      dept: { data },
    } = this.props;

    const columns = [
      {
        title: '租户ID',
        dataIndex: 'tenantId',
        width:200
      },
      {
        title: '机构名称',
        dataIndex: 'deptName',
      },
      {
        title: '机构全称',
        dataIndex: 'fullName',
      },
      {
        title: '机构类型',
        dataIndex: 'deptCategoryName',
        render: deptCategoryName => (
          <span>
            <Tag color="geekblue" key={deptCategoryName}>
              {deptCategoryName}
            </Tag>
          </span>
        ),
      },
      {
        title: '排序',
        dataIndex: 'sort',
      },
      // {
      //   title: '销发编码',
      //   dataIndex: 'code',
      // },
      // {
      //   title: '父级编码',
      //   dataIndex: 'parentCode',
      // },
    ];

    if (!tenantMode) {
      columns.splice(0, 1);
    }

    return (
      <Panel title="机构管理">
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
export default Dept;
