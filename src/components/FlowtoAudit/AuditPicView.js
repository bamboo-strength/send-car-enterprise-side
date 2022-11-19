import React, {PureComponent} from 'react';
import { Form, Drawer, Card,Button, Row, Col, Icon, message} from 'antd';
import { connect } from 'dva';
import Zmage from 'react-zmage';
import Func from '@/utils/Func';
import {AUDIT_GETAUDITPIC} from '../../actions/audit';


@connect(({ audit, loading }) => ({
  audit,
  loading: loading.models.audit,
}))

@Form.create()
class AuditPicView extends PureComponent{

  state = {
    visible: false,
    orderHandelId: '',
  };

  componentWillMount() {
    const {dispatch, orderHandelId} = this.props;
    if(Func.isEmpty(orderHandelId)){
      message.error("照片查看页未获取到订单ID");
      return;
    }else{
      this.setState({
        orderHandelId: orderHandelId,
      });
    }
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });

    const {dispatch, orderHandelId} = this.props;
    const payload = {
      orderHandelId: orderHandelId,
    };
    dispatch(AUDIT_GETAUDITPIC(payload));
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { Meta } = Card;
    const {
      audit: {
        AuditPic,
      },
    } = this.props;

    console.log('---图片信息---')
    console.log(AuditPic)

    const inputPile = [];  // 定义一个数组
    for (let i = 0; i < AuditPic.length; i+=1) {  // for循环数组
      inputPile.push(  // 将组件塞入定义的数组中
        <Col span={6}>
          <Card
            hoverable
            style={{ width: 300 }}
            cover={<Zmage src={AuditPic[i].picurl} />}
          >
            <Meta title={`订单ID：${AuditPic[i].orderId}`} description={<span>车号：{AuditPic[i].truckno} <br /> 审批等级：{AuditPic[i].auditLevelName} <br /> 上传人：{AuditPic[i].userName} <br /> 上传时间：{AuditPic[i].createTime}</span>} />
          </Card>
        </Col>
      );
    }


    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Button type="Default" onClick={this.showDrawer}>
          <Icon type="picture" /> 查看图片
        </Button>

        <Drawer
          title="查看图片"
          width='100%'
          height='60%'
          placement="bottom"
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Row>
            {inputPile}
          </Row>

        </Drawer>
      </div>
    );
  }
}

export default AuditPicView;
