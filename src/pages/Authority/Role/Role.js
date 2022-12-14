import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, message, Modal, Row, Tree, Tabs } from 'antd';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import {
  ROLE_LIST,
  ROLE_GRANT_TREE,
  ROLE_TREE_KEYS,
  ROLE_SET_TREE_KEYS,
  ROLE_GRANT,
} from '../../../actions/role';
import { MENU_REFRESH_DATA } from '../../../actions/menu';
import { tenantMode } from '../../../defaultSettings';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const { TabPane } = Tabs;

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
class Role extends PureComponent {
  state = {
    visible: false,
    confirmLoading: false,
    selectedRows: [],
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(ROLE_GRANT_TREE());
  }

  onSelectRow = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  getSelectKeys = () => {
    const { selectedRows } = this.state;
    return selectedRows.map(row => row.id);
  };

  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(ROLE_LIST(params));
  };

  // ========== 权限配置  =============
  handleGrant = () => {
    const {
      role: { menuTreeKeys, dataScopeTreeKeys, apiScopeTreeKeys },
    } = this.props;

    const keys = this.getSelectKeys();

    this.setState({
      confirmLoading: true,
    });

    const { dispatch } = this.props;
    dispatch(
      ROLE_GRANT(
        {
          roleIds: keys[0],
          menuIds: menuTreeKeys,
          dataScopeIds: dataScopeTreeKeys,
          apiScopeIds: apiScopeTreeKeys,
        },
        () => {
          this.setState({
            visible: false,
            confirmLoading: false,
          });
          message.success('配置成功，该角色所属的用户重新登录后生效。');
          dispatch(MENU_REFRESH_DATA());
        }
      )
    );
    return true;
  };

  showModal = () => {
    const keys = this.getSelectKeys();
    if (keys.length === 0) {
      message.warn('请先选择一条数据!');
      return;
    }
    if (keys.length > 1) {
      message.warn('只能选择一条数据!');
      return;
    }
    const { dispatch } = this.props;
    dispatch(ROLE_TREE_KEYS({ roleIds: keys[0] }));
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch(ROLE_SET_TREE_KEYS({ menuTreeKeys: [], dataScopeTreeKeys: [], apiScopeTreeKeys: [] }));
    this.setState({
      visible: false,
    });
  };

  onMenuCheck = checkedTreeKeys => {
    const {
      dispatch,
      role: { dataScopeTreeKeys, apiScopeTreeKeys },
    } = this.props;
    dispatch(
      ROLE_SET_TREE_KEYS({ menuTreeKeys: checkedTreeKeys, dataScopeTreeKeys, apiScopeTreeKeys })
    );
  };

  onDataScopeCheck = checkedTreeKeys => {
    const {
      dispatch,
      role: { menuTreeKeys, apiScopeTreeKeys },
    } = this.props;
    dispatch(
      ROLE_SET_TREE_KEYS({ dataScopeTreeKeys: checkedTreeKeys, menuTreeKeys, apiScopeTreeKeys })
    );
  };

  onApiScopeCheck = checkedTreeKeys => {
    const {
      dispatch,
      role: { menuTreeKeys, dataScopeTreeKeys },
    } = this.props;
    dispatch(
      ROLE_SET_TREE_KEYS({ apiScopeTreeKeys: checkedTreeKeys, menuTreeKeys, dataScopeTreeKeys })
    );
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="角色名称">
            {getFieldDecorator('roleName')(<Input placeholder="请输入角色名称" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="租户ID">
            {getFieldDecorator('tenantId')(<Input placeholder="请输入租户ID" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="角色别名">
            {getFieldDecorator('roleAlias')(<Input placeholder="请输入角色别名" />)}
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

  renderLeftButton = () => (
    <Button icon="user-add" onClick={this.showModal}>
      权限设置
    </Button>
  );

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  render() {
    const code = 'role';

    const { visible, confirmLoading } = this.state;

    const {
      form,
      loading,
      role: {
        data,
        menuGrantTree,
        menuTreeKeys,
        dataScopeGrantTree,
        dataScopeTreeKeys,
        apiScopeGrantTree,
        apiScopeTreeKeys,
      },
    } = this.props;



    const columns = [
      {
        title: '租户ID',
        dataIndex: 'tenantId',
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
      },
      {
        title: '角色别名',
        dataIndex: 'roleAlias',
      },
      {
        title: '排序',
        dataIndex: 'sort',
      },
    ];

    if (!tenantMode) {
      columns.splice(0, 1);
    }

    return (
      <Panel title="角色管理">
        <Grid
          code={code}
          form={form}
          onSelectRow={this.onSelectRow}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          renderLeftButton={this.renderLeftButton}
          loading={loading}
          data={data}
          columns={columns}
        />
        <Modal
          title="权限配置"
          width={380}
          visible={visible}
          confirmLoading={confirmLoading}
          onOk={this.handleGrant}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Tabs defaultActiveKey="1" size="small">
            <TabPane tab="菜单权限" key="1">
              <Tree checkable checkedKeys={menuTreeKeys} onCheck={this.onMenuCheck}>
                {this.renderTreeNodes(menuGrantTree)}
              </Tree>
            </TabPane>
            <TabPane tab="数据权限" key="2">
              <Tree checkable checkedKeys={dataScopeTreeKeys} onCheck={this.onDataScopeCheck}>
                {this.renderTreeNodes(dataScopeGrantTree)}
              </Tree>
            </TabPane>
            <TabPane tab="接口权限" key="3">
              <Tree checkable checkedKeys={apiScopeTreeKeys} onCheck={this.onApiScopeCheck}>
                {this.renderTreeNodes(apiScopeGrantTree)}
              </Tree>
            </TabPane>
          </Tabs>
        </Modal>
      </Panel>
    );
  }
}
export default Role;
