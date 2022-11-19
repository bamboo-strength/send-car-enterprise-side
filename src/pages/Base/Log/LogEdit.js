import React, { PureComponent } from 'react';
import { Form, Input, Card, Button, Row, Col, TreeSelect,DatePicker } from 'antd';
import { connect } from 'dva';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { LOG_INIT, LOG_UPDATE } from '@/actions/LogActions';
import { detail } from '@/services/LogService';
import func from '@/utils/Func';
import moment from 'moment';


const FormItem = Form.Item;
// const { Search } = Input;
@connect(({ mylog ,loading}) => ({
  mylog,
  loading: loading.models.mylog,
}))
@Form.create()
class LogEdit extends PureComponent {
  state = {
    data: {},
    userVisible: false,
    menuVisible: false,
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    detail({ id }).then(resp => {
      if (resp.success) {
        this.setState({ data: resp.data });
      }
    });
    dispatch(LOG_INIT());
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form , dispatch,
      match: {
        params: { id },
      }
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id,
          ...values,
        };
        dispatch(LOG_UPDATE(params));
      }
    });
  };

  showModal = (params,e) => {

      if (params === 'user'){
        this.setState({
          userVisible: true,
        });
      }else if(params === 'menu'){
        this.setState({
          menuVisible: true,
        });
      }
    };

    handleCancel = () => {
      this.setState({
        userVisible: false,
        menuVisible: false,
      });
  };

  handleOkBefore = (selectedRows) =>{
    const {form} = this.props;
    return form;
  }

  render() {
    const {
      form: { getFieldDecorator },
      mylog: {
         init: { deptTree },
      },
    } = this.props;
      const { data } = this.state;
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

       const { userVisible, menuVisible } = this.state;
    const action = (
      <Button type="primary" onClick={this.handleSubmit}>
        提交
      </Button>
    );

    return (
      <Panel title="修改日志" back="/base/log" action={action}>
        <Form hideRequiredMark={false} style={{ marginTop: 8 }}>
          <Card title="日志基本信息" className={styles.card} bordered={false}>
            <Row>
              <Col span={15}>
                <FormItem {...formItemLayout} label="租户ID">
                  {getFieldDecorator('tenantId',{
                    rules: [
                      {
                        required: true,
                        message: '请输入租户ID号',
                      },

                    ],
                    initialValue: data.tenantId,
                  })(<Input placeholder="请输入租户ID" maxLength={20} />)}
                </FormItem>
              </Col>
              <Col span={15}>
                <FormItem {...formItemLayout} label="日志类型">
                  {getFieldDecorator('logtype',{
                    rules: [
                      {
                        required: true,
                        message: '请输入日志类型',
                      },
                    ],
                    initialValue: data.logtype,
                  })(<Input placeholder="请输入日志类型" maxLength={20}  />)}
                </FormItem>
              </Col>
              <Col span={15}>
                <FormItem {...formItemLayout} label="创建人">
                  {getFieldDecorator('createUser',{
                    rules: [
                      {
                        required: true,
                        message: '请输入创建人',
                      },
                    ],
                    initialValue: data.createUser,
                  })(<Input placeholder="请输入创建人" maxLength={20} />)}
                </FormItem>
              </Col>
              <Col span={15}>
                <FormItem {...formItemLayout} label="创建部门">
                  {getFieldDecorator('createDept',{
                    rules: [
                      {
                        required: true,
                        message: '请输入创建部门',
                      },
                    ],
                    initialValue: data.createDept,
                  })(<Input placeholder="请输入创建部门" maxLength={20} />)}
                </FormItem>
              </Col>

            </Row>
            <Row gutter={24}>
              {/*<Col span={15}>*/}
              {/*  <FormItem {...formItemLayout} label="创建时间">*/}
              {/*    {getFieldDecorator('createTime', {*/}
              {/*      initialValue: func.moment(data.createTime),*/}
              {/*    })(*/}

              {/*      <DatePicker*/}
              {/*        style={{ width: '100%' }}*/}
              {/*        format="YYYY-MM-DD HH:mm:ss"*/}
              {/*        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss')}}*/}
              {/*        placeholder="请选择创建时间"*/}
              {/*      />*/}
              {/*    )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
              <Col span={15}>
                <FormItem {...formItemLayout} label="修改人">
                  {getFieldDecorator('updateUser',{
                    rules: [
                      {
                        required: true,
                        message: '请输入修改人',
                      },
                    ],
                    initialValue: data.updateUser,
                  })(<Input placeholder="请输入修改人" maxLength={20} />)}
                </FormItem>
              </Col>
              {/*<Col span={15}>*/}
              {/*  <FormItem {...formItemLayout} label="修改时间">*/}
              {/*    {getFieldDecorator('updateTime', {*/}
              {/*     // initialValue: func.moment(detail.updateTime),*/}
              {/*    })(*/}
              {/*      <DatePicker*/}
              {/*        style={{ width: '100%' }}*/}
              {/*        format="YYYY-MM-DD HH:mm:ss"*/}
              {/*        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}*/}
              {/*        placeholder="请选择修改时间"*/}
              {/*      />*/}
              {/*    )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
              <Col span={15}>
                <FormItem {...formItemLayout} label="所属机构">
                  {getFieldDecorator('deptId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属机构',
                      },
                    ],
                    initialValue: data.deptId,
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={deptTree}
                      allowClear
                      showSearch
                      treeNodeFilterProp="title"
                      multiple
                      placeholder="请选择所属机构"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={15}>
                <FormItem {...formItemLayout} label="执行类">
                  {getFieldDecorator('executes',{
                    rules: [
                      {
                        required: true,
                        message: '请输入执行类',
                      },
                    ],
                    initialValue: data.executes,
                  })(<Input placeholder="请输入执行类" maxLength={20} />)}
                </FormItem>
              </Col>
            </Row>

          </Card>
        </Form>
        {/*<SearchDataTable*/}
        {/*  titel='用户信息'*/}
        {/*  visible={userVisible}*/}
        {/*  handleClose={this.handleCancel}*/}
        {/*  onAffirm={this.handleOkBefore}*/}
        {/*  paramValue={{key: "userIds",otherKey: "userName",otherValue: 'realName'}}*/}
        {/*  //   selectType='checked'*/}
        {/*  //  size={7}*/}
        {/*  //  rowKey='name'*/}
        {/*  selectType='checkbox'*/}
        {/*  searchConditionLabel={['账号','昵称','名字']}*/}
        {/*  searchConditionCode={['account','name','realName']}*/}
        {/*  colName={['账号','昵称','名字']}*/}
        {/*  colCode={['account','name','realName']}*/}
        {/*  searchPath='/api/shipper-user/list'*/}
        {/*/>*/}
        {/*<SearchDataTable*/}
        {/*  titel='菜单信息'*/}
        {/*  visible={menuVisible}*/}
        {/*  handleClose={this.handleCancel}*/}
        {/*  onAffirm={this.handleOkBefore}*/}
        {/*  paramValue={{key: "menuIds",otherKey: "menuName",otherValue: 'menuName'}}*/}
        {/*  //   selectType='checked'*/}
        {/*  //  size={7}*/}
        {/*  //  rowKey='name'*/}
        {/*  selectType='checkbox'*/}
        {/*  searchConditionLabel={['菜单编码','菜单名称']}*/}
        {/*  searchConditionCode={['menuCode','menuName']}*/}
        {/*  colName={['菜单编码','菜单名称']}*/}
        {/*  colCode={['menuCode','menuName']}*/}
        {/*  searchPath='/api/base-wx/wxmenu/list'*/}
        {/*/>*/}
      </Panel>

    );
  }
}

export default LogEdit;
