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
        ??????
      </Button>
    );

    return (
      <Panel title="????????????" back="/base/log" action={action}>
        <Form hideRequiredMark={false} style={{ marginTop: 8 }}>
          <Card title="??????????????????" className={styles.card} bordered={false}>
            <Row>
              <Col span={15}>
                <FormItem {...formItemLayout} label="??????ID">
                  {getFieldDecorator('tenantId',{
                    rules: [
                      {
                        required: true,
                        message: '???????????????ID???',
                      },

                    ],
                    initialValue: data.tenantId,
                  })(<Input placeholder="???????????????ID" maxLength={20} />)}
                </FormItem>
              </Col>
              <Col span={15}>
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator('logtype',{
                    rules: [
                      {
                        required: true,
                        message: '?????????????????????',
                      },
                    ],
                    initialValue: data.logtype,
                  })(<Input placeholder="?????????????????????" maxLength={20}  />)}
                </FormItem>
              </Col>
              <Col span={15}>
                <FormItem {...formItemLayout} label="?????????">
                  {getFieldDecorator('createUser',{
                    rules: [
                      {
                        required: true,
                        message: '??????????????????',
                      },
                    ],
                    initialValue: data.createUser,
                  })(<Input placeholder="??????????????????" maxLength={20} />)}
                </FormItem>
              </Col>
              <Col span={15}>
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator('createDept',{
                    rules: [
                      {
                        required: true,
                        message: '?????????????????????',
                      },
                    ],
                    initialValue: data.createDept,
                  })(<Input placeholder="?????????????????????" maxLength={20} />)}
                </FormItem>
              </Col>

            </Row>
            <Row gutter={24}>
              {/*<Col span={15}>*/}
              {/*  <FormItem {...formItemLayout} label="????????????">*/}
              {/*    {getFieldDecorator('createTime', {*/}
              {/*      initialValue: func.moment(data.createTime),*/}
              {/*    })(*/}

              {/*      <DatePicker*/}
              {/*        style={{ width: '100%' }}*/}
              {/*        format="YYYY-MM-DD HH:mm:ss"*/}
              {/*        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss')}}*/}
              {/*        placeholder="?????????????????????"*/}
              {/*      />*/}
              {/*    )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
              <Col span={15}>
                <FormItem {...formItemLayout} label="?????????">
                  {getFieldDecorator('updateUser',{
                    rules: [
                      {
                        required: true,
                        message: '??????????????????',
                      },
                    ],
                    initialValue: data.updateUser,
                  })(<Input placeholder="??????????????????" maxLength={20} />)}
                </FormItem>
              </Col>
              {/*<Col span={15}>*/}
              {/*  <FormItem {...formItemLayout} label="????????????">*/}
              {/*    {getFieldDecorator('updateTime', {*/}
              {/*     // initialValue: func.moment(detail.updateTime),*/}
              {/*    })(*/}
              {/*      <DatePicker*/}
              {/*        style={{ width: '100%' }}*/}
              {/*        format="YYYY-MM-DD HH:mm:ss"*/}
              {/*        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}*/}
              {/*        placeholder="?????????????????????"*/}
              {/*      />*/}
              {/*    )}*/}
              {/*  </FormItem>*/}
              {/*</Col>*/}
              <Col span={15}>
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator('deptId', {
                    rules: [
                      {
                        required: true,
                        message: '?????????????????????',
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
                      placeholder="?????????????????????"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={15}>
                <FormItem {...formItemLayout} label="?????????">
                  {getFieldDecorator('executes',{
                    rules: [
                      {
                        required: true,
                        message: '??????????????????',
                      },
                    ],
                    initialValue: data.executes,
                  })(<Input placeholder="??????????????????" maxLength={20} />)}
                </FormItem>
              </Col>
            </Row>

          </Card>
        </Form>
        {/*<SearchDataTable*/}
        {/*  titel='????????????'*/}
        {/*  visible={userVisible}*/}
        {/*  handleClose={this.handleCancel}*/}
        {/*  onAffirm={this.handleOkBefore}*/}
        {/*  paramValue={{key: "userIds",otherKey: "userName",otherValue: 'realName'}}*/}
        {/*  //   selectType='checked'*/}
        {/*  //  size={7}*/}
        {/*  //  rowKey='name'*/}
        {/*  selectType='checkbox'*/}
        {/*  searchConditionLabel={['??????','??????','??????']}*/}
        {/*  searchConditionCode={['account','name','realName']}*/}
        {/*  colName={['??????','??????','??????']}*/}
        {/*  colCode={['account','name','realName']}*/}
        {/*  searchPath='/api/shipper-user/list'*/}
        {/*/>*/}
        {/*<SearchDataTable*/}
        {/*  titel='????????????'*/}
        {/*  visible={menuVisible}*/}
        {/*  handleClose={this.handleCancel}*/}
        {/*  onAffirm={this.handleOkBefore}*/}
        {/*  paramValue={{key: "menuIds",otherKey: "menuName",otherValue: 'menuName'}}*/}
        {/*  //   selectType='checked'*/}
        {/*  //  size={7}*/}
        {/*  //  rowKey='name'*/}
        {/*  selectType='checkbox'*/}
        {/*  searchConditionLabel={['????????????','????????????']}*/}
        {/*  searchConditionCode={['menuCode','menuName']}*/}
        {/*  colName={['????????????','????????????']}*/}
        {/*  colCode={['menuCode','menuName']}*/}
        {/*  searchPath='/api/base-wx/wxmenu/list'*/}
        {/*/>*/}
      </Panel>

    );
  }
}

export default LogEdit;
