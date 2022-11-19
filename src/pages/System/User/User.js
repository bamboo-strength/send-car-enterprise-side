import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, message, Modal, Row, Tree, TreeSelect } from 'antd';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { USER_INIT, USER_LIST, USER_ROLE_GRANT } from '../../../actions/user';
import { resetPassword } from '../../../services/user';
import { tenantMode } from '../../../defaultSettings';
import SearchDataTable from '@/components/SearchDataList/SearchDataTable';
import { getCurrentUser } from '@/utils/authority';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const { Search } = Input;

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
@Form.create()
class User extends PureComponent {
  state = {
    visible: false,
    confirmLoading: false,
    selectedRows: [],
    checkedTreeKeys: [],
    visibleUser: false,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(USER_INIT());
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
    let payload = {
      ...params,
    };
    if(payload.userName === ''){
      payload.createUser = undefined;
    }
    payload.userName = undefined;
    dispatch(USER_LIST(payload));
  };

  // ============ 处理按钮点击回调事件 ===============
  handleBtnCallBack = payload => {
    const { btn, keys } = payload;
    if (btn.code === 'user_role') {
      if (keys.length === 0) {
        message.warn('请先选择一条数据!');
        return;
      }
      this.showModal();
      return;
    }
    if (btn.code === 'user_reset') {
      if (keys.length === 0) {
        message.warn('请先选择一条数据!');
        return;
      }
      Modal.confirm({
        title: '重置密码确认',
        content: '确定将选择账号密码重置为123456?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const response = await resetPassword({ userIds: keys });
          if (response.success) {
            message.success(response.msg);
          } else {
            message.error(response.msg || '重置失败');
          }
        },
        onCancel() {},
      });
    }
  };

  handleGrant = () => {
    const { checkedTreeKeys } = this.state;
    const keys = this.getSelectKeys();

    this.setState({
      confirmLoading: true,
    });

    const { dispatch } = this.props;
    dispatch(
      USER_ROLE_GRANT({ userIds: keys, roleIds: checkedTreeKeys.checked }, () => {
        this.setState({
          visible: false,
          confirmLoading: false,
        });
        message.success('配置成功');
        this.setState({
          checkedTreeKeys: [],
        });
      })
    );
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showModal2 = (params,e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (params === 'user'){
      this.setState({
        visibleUser: true,
      });
    }
  };

  handleCancel = () =>
    this.setState({
      visible: false,
      visibleUser: false,
    });

  handleOkBefore = (selectedRows) =>{
    const {form} = this.props;
    return form;
  }

  onCheck = checkedTreeKeys => this.setState({ checkedTreeKeys });

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

  CreateSearchUser=(visibleUser)=>{
    return (
      <SearchDataTable
        titel='用户信息'
        visible={visibleUser}
        handleClose={this.handleCancel}
        onAffirm={this.handleOkBefore}
        paramValue={{key: "createUser",otherKey: "userName",otherValue: 'realName'}}
        // selectType='checked'
        //  size={7}
        //  rowKey='name'
        searchConditionLabel={['用户名','登录账号']}
        searchConditionCode={['realName','account']}
        colName={['用户名','登录账号']}
        colCode={['realName','account']}
        searchPath='/api/shipper-user/list'
      />
    )
  }

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const {
      form,
      user: {
        init: { deptTree },
      },
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="登录账号">
              {getFieldDecorator('account')(<Input placeholder="请输入登录账号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="用户姓名">
              {getFieldDecorator('realName')(<Input placeholder="请输入用户姓名" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="创建人">
              {getFieldDecorator('userName')(<Search placeholder="请输入创建人" onClick={(e) => this.showModal2("user",e)} enterButton />)}
            </FormItem>
          </Col>
          <Col span={6} sm={24} style={{display: 'none'}}>
            <FormItem label="创建人">
              {getFieldDecorator('createUser')(<Input placeholder="请输入创建人" readOnly="readOnly"  />)}
            </FormItem>
          </Col>
          {
            getCurrentUser().tenantId === "131183" ?
              <div>
                <Col md={6} sm={24}>
                  <FormItem label="机构">
                    {getFieldDecorator('deptId')(
                      <TreeSelect
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={deptTree}
                        allowClear
                        showSearch
                        treeNodeFilterProp="title"
                        placeholder="请选择机构"
                      />
                    )}
                  </FormItem>
                </Col>
              </div>
              :
              ""
          }
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          {
            getCurrentUser().tenantId === "764537" ?
              <div>
                <Col md={10} sm={24}>
                  <FormItem label="机构">
                    {getFieldDecorator('deptId')(
                      <TreeSelect
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={deptTree}
                        allowClear
                        showSearch
                        treeNodeFilterProp="title"
                        placeholder="请选择机构"
                      />
                    )}
                  </FormItem>
                </Col>
              </div>
              :
              ""
          }
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
      </div>
    );
  };

  render() {
    const code = 'user';

    const { visible, confirmLoading, checkedTreeKeys, visibleUser } = this.state;

    const {
      form,
      loading,
      user: {
        data,
        init: { roleTree },
      },
    } = this.props;

    const columns = [
      {
        title: '所属租户',
        dataIndex: 'tenantId',
      },
      {
        title: '登录账号',
        dataIndex: 'account',
      },
      {
        title: '用户昵称',
        dataIndex: 'name',
      },
      {
        title: '用户姓名',
        dataIndex: 'realName',
      },
      {
        title: '用户性别',
        dataIndex: 'sexName',
      },
      {
        title: '所属角色',
        dataIndex: 'roleName',
      },
      {
        title: '创建人',
        dataIndex: 'createUserName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '所属机构',
        dataIndex: 'deptName',
      },
      {
        title: '手机号码',
        dataIndex: 'phone',
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
      },
    ];

    if (!tenantMode) {
      columns.splice(0, 1);
    }

    return (
      <Panel title="用户管理">
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          onSelectRow={this.onSelectRow}
          renderSearchForm={this.renderSearchForm}
          btnCallBack={this.handleBtnCallBack}
          loading={loading}
          data={data}
          columns={columns}
        />
        <Modal
          title="权限配置"
          width={350}
          visible={visible}
          confirmLoading={confirmLoading}
          onOk={this.handleGrant}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Tree checkable checkStrictly checkedKeys={checkedTreeKeys} onCheck={this.onCheck}>
            {this.renderTreeNodes(roleTree)}
          </Tree>
        </Modal>

        {this.CreateSearchUser(visibleUser)}
      </Panel>
    );
  }
}
export default User;
