import React,{ PureComponent } from 'react';
import { Card, Col, Form, Icon, Row } from 'antd/lib/index';
import { connect } from 'dva/index';
import { getCurrentUser } from '@/utils/authority';
import router from 'umi/router';
import { NavBar } from 'antd-mobile';
import { logoImgUrl, } from '@/defaultSettings';
import { SETTLEDENTERPRISE_TENANTLIST} from '../../../actions/settledEnterprise'


const { Meta } = Card;
@connect(({ settledEnterprise,loading }) =>({
  settledEnterprise,
  loading:loading.models.settledEnterprise,
}))
@Form.create()
class SettledEnterprise extends PureComponent{

   constructor(props) {
    super(props);
     this.state = {
     }
   }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(SETTLEDENTERPRISE_TENANTLIST())
  }

  handleClick = (tenantId) =>{
    router.push(`/businessInto/settledEnterprise/edit/${tenantId}`);
  }

  render() {
    const {
      settledEnterprise: { data },
    } = this.props;
    const items = [];
    if (data !== undefined) {
      data.tenantList.map(value => {
        if(value.tenantName!=='临时用户租户' && value.tenantName!=='司机专用租户' && value.tenantId!==getCurrentUser().tenantId){
            items.push(value)
        }
      })
    }
    const imgStyle = {width: '100%',height: '75px',objectFit: 'contain'}

    return (
      <div className='outBasicStyle'>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/function')}
        >入驻企业
        </NavBar>
        <Row className='am-list' gutter={[4, 4]}>
          {items.map(value => (
            <Col span={8}>
              <Card
                hoverable={false}
                cover={<img alt="example" src={`${logoImgUrl}/personalImg/${value.tenantId}.jpg`} style={imgStyle} />}
                // onClick={()=>this.handleClick(value.tenantId)}
              >
                <Meta title={value.tenantName} description="" />
              </Card>
            </Col>
          ))}
        </Row>

      </div>
    );

  }
}
export  default SettledEnterprise;
