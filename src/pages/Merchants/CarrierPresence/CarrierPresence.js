import React,{ PureComponent } from 'react';
import {Card, Col, Form, Row } from 'antd/lib/index';
import { connect } from 'dva/index';
import router from 'umi/router';
import { CARRIERPRESENCE_TENANTLIST} from '../../../actions/carrierPresence'
import { getCurrentUser } from '@/utils/authority';
import { Icon, NavBar,Button } from 'antd-mobile';

const { Meta } = Card;
@connect(({ carrierPresence,loading }) =>({
  carrierPresence,
  loading:loading.models.carrierPresence,
}))
@Form.create()
class CarrierPresence extends PureComponent{

   constructor(props) {
    super(props);
     this.state = {
     }
   }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(CARRIERPRESENCE_TENANTLIST())
  }

  handleClick = (tenantId) =>{
    router.push(`/businessInto/carrierPresence/edit/${tenantId}`);
    return;
  }

  render() {
    const {
      carrierPresence: { data },
    } = this.props;
    const items = [];
    if (data !== undefined) {
      data.tenantList.map(value => {
        if(value.tenantName!=='临时用户租户' && value.tenantName!=='司机专用租户' && value.tenantId!==getCurrentUser().tenantId){
          items.push(value)
        }

      })
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/function')}
        >承运商入驻企业
        </NavBar>
        <Card title="" bordered={false} style={{ marginTop: 8 }}>
          <Row gutter={16}>
            {items.map(value => (
              <Col span={8}>
                <Card
                 // bordered={false}
                  hoverable={false}
                  style={{ width: '100px',height:'110px',marginTop:'5px'}}
                  cover={<img alt="example" src={value.logo} />}
                  onClick={this.handleClick.bind(this,value.tenantId)}
                >
                  <Meta title={value.tenantName} description="" style={{fontSize:'12px'}} />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    );

  }
}
export  default CarrierPresence;
