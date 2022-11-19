import React, {PureComponent} from 'react';
import { Form, Drawer, Button, Input, Row, Col, Icon, message, Descriptions, List, Avatar  } from 'antd';
import { connect } from 'dva';
import { infoByOrderId } from '@/services/audit';
import Func from '@/utils/Func';

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.models.audit,
}))
@Form.create()
class AuditHandle extends PureComponent{

  state = {
    visible: false,
    data: {},
  };

  componentWillMount() {
    const {orderHandelId} = this.props;
    if(Func.notEmpty(orderHandelId)){
      infoByOrderId({ orderHandelId }).then(resp => {
        if (resp.success) {
          this.setState({ data: resp.data });
        }else{
          message.error("订单号为空，未查询到审批信息！")
        }
      });
    }

  }



  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };


  handleSubmit = (e, orderHandelIdS) => {
    // console.log(`s:${orderHandelIdS}`);
    e.preventDefault();
    const {
      form,
      dispatch,
    } = this.props;
    // console.log(dispatch)
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id:orderHandelIdS,
          ...values,
        };
        dispatch({
          type: 'audit/submit',
          payload: params,
        });
      }
    });
  };

  handleReject = (e,orderHandelIdR) => {
    // console.log(`r:${orderHandelIdR}`);
    e.preventDefault();
    const {
      form,
      dispatch,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id:orderHandelIdR,
          ...values,
        };
        dispatch({
          type: 'audit/reject',
          payload: params,
        });
      }
    });
  };

  handleUnPass = (e,orderHandelIdR) => {
    // console.log(`UnPass:${orderHandelIdR}`);
    e.preventDefault();
    const {
      form,
      dispatch,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id:orderHandelIdR,
          ...values,
        };
        dispatch({
          type: 'audit/unPass',
          payload: params,
        });
      }
    });
  };


  render() {

    const { getFieldDecorator } = this.props.form;
    const {orderHandelId} = this.props;
    // console.log(`接收参数：${orderHandelId}`)

     const { data } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showDrawer}>
          <Icon type="plus" /> 进行审批
        </Button>

        <Drawer
          title="审批操作"
          width={650}
          placement="left"
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item1 =>{
              return (
                <List.Item>
                  <List.Item.Meta
                    title={item1.levelName}
                    description="审批等级"
                  />
                  <List.Item.Meta
                    title={item1.resultName}
                    description="状态"
                  />
                  <List.Item.Meta
                    title={item1.isRejectName}
                    description="是否驳回"
                  />
                  <List.Item.Meta
                    title={item1.userName}
                    description="审批人"
                  />
                  <List.Item.Meta
                    title={item1.createTime}
                    description="审批时间"
                  />
                  <List.Item.Meta
                    // title={item1.remark.replace("<br>","")}
                    title={item1.remark}
                    description="备注"
                  />
                </List.Item>
             )}
            }
          />
          {/*<Panel title="审核" back="/flowto/audit">*/}
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="  请输入备注">
                  {getFieldDecorator('remark', {
                    rules: [
                      {
                        required: false,
                        message: '请输入备注',
                      },
                      {
                        pattern:  /^.{1,200}$/,
                        message: '长度最多200字符',
                      },
                    ],
                  })(<Input.TextArea rows={10} placeholder="请输入备注" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {/*</Panel>*/}

          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button type="danger" onClick={(e) => this.handleReject(e,orderHandelId)} icon="warn">
              驳回
            </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="danger" onClick={(e) => this.handleUnPass(e,orderHandelId)} icon="close">
              不通过
            </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={(e) => this.handleSubmit(e,orderHandelId)} icon="check">
              通过
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default AuditHandle;
