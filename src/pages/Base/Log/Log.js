import { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, message } from 'antd';
import Grid from '@/components/Sword/Grid';
import Panel from '@/components/Panel';
import { connect } from 'dva';

import { LOG_LIST } from '@/actions/LogActions';

const FormItem = Form.Item;

@connect(({mylog , loading}) => ({
  mylog,
  loading:  loading.models.mylog,
}))
@Form.create()
class Log extends PureComponent {
  state = {
    selectedRows:[],
  };

  onSelectRow = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(LOG_LIST(params));
  };

  // ==== 查询表单 ====
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
        <FormItem label="ID号">
          {getFieldDecorator('id')(<Input placeholder="请输入ID号" />)}
        </FormItem>
      </Col>
        <Col md={6} sm={24}>
          <FormItem label="租户ID">
            {getFieldDecorator('tenantId')(<Input placeholder="请输入租户ID号" />)}
          </FormItem>
        </Col>

        <Col md={6} sm={24}>
          <FormItem label="创建人">
            {getFieldDecorator('createUser')(<Input placeholder="请输入创建人" />)}
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

  test = () => {
    const keys = this.getSelectKeys();
    if (keys.length === 0) {
      message.warn('请选择一条数据!');
    } else {
      console.log(`已选择数据id:${keys}`);
    }
  }

  // renderLeftButton = () => (
  //   <Button icon="tool" onClick={this.test}>
  //     测试
  //   </Button>
  // );

  render() {
    const code = 'mylog';

    const {
      form,
      loading,
      mylog:{data},
    } = this.props;

    const columns = [
      {
        title: 'ID号',
        dataIndex: 'id',
        width:'7%',
      },
      {
        title: '租户ID',
        dataIndex: 'tenantId',
        width:'8%',
      },
      {
        title: '日志类型',
        dataIndex: 'logtypeName',
        width:'3%',
      },
      // {
      //   title: '操作',
      //   dataIndex: 'operation',
      //   width:'4%',
      // },
      {
        title: '修改前数据',
        dataIndex: 'befor',
         width:'30%',
      },
      {
        title: '修改后数据',
        dataIndex: 'after',
         width:'30%',
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
        width:'6%',
      },
      {
        title: '创建部门',
        dataIndex: 'createDept',
        width:'6%',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width:'7%',
      },
      {
        title: '修改人',
        dataIndex: 'updateUser',
        width:'6%',
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        width:'7%',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width:'3%',
      },
      {
        title: '是否删除',
        dataIndex: 'isDeleted',
        width:'3%',
      },
      {
        title: '机构',
        dataIndex: 'deptId',
        width:'5%',
      },
      {
        title: '执行类',
        dataIndex: 'executes',
        width:'10%',
      },
    ];
    return (
      <Panel>
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          onSelectRow={this.onSelectRow}
          renderSearchForm={this.renderSearchForm}
          renderRightButton={this.renderRightButton}
          loading={loading}
          data={data}
          columns={columns}
          scroll={{x:2500, y: 500 }}
        />
      </Panel>
    );
  }
}
export default Log;
