import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Col, Button } from 'antd';
import styles from '../../../layouts/Sword.less';
import router from 'umi/router';
import { getCurrentUser } from '@/utils/authority';
import Func from '@/utils/Func';
import Panel from '@/components/Panel';
import { detail as tenantDetail } from '@/services/TenantDetailServices';
import { detail as tenantProduct } from '@/services/TenantProductServices';

@connect(({ tenantDetail, loading }) => ({
  tenantDetail,
  loading: loading.models.tenantDetail,
}))
@Form.create()
class FlowControl extends PureComponent {

  state = {
    detail: {},
    product: {},
  }

  componentWillMount() {
    const user = getCurrentUser();

    tenantDetail({createUser: user.userId, tenantId: user.tenantId,}).then((resDetail) => {
      if (resDetail.success && Func.notEmpty(resDetail.data.id)){
        tenantProduct({tenantDetailId:resDetail.data.id, product: 0}).then((resProduct) => {
          if (resProduct.success){
            this.setState({
              detail:resDetail.data,
              product:resProduct.data
            });
          }
        })
      }
    })
  }

  // 跳转提交页面
  handleSubmit = e => {
    router.push(`/console/product/product/0`);
  };

  // 返回Button
  getButOrDiv = () =>{
    const { detail, product } = this.state;

    if (Func.notEmpty(detail.id) && Func.notEmpty(product.id)){
      return (
        <div>
          {
            product.auditFlag===0?
              <Button type="primary" disabled>已申请</Button>
              :
              (product.auditFlag===1?
                <Button type="primary" onClick={this.handleSubmit}>重新开通</Button>
                :
                <Button type="primary" disabled>已开通</Button>)
          }
        </div>
      );
    }
    return (
      <Button type="primary" onClick={this.handleSubmit}>立即开通</Button>
    );
  }

  render() {

    return (
      <Panel>
        <Card title="水泥流向管控系统" className={styles.card} bordered={false}>
          <Card
            className={styles.card}
            bordered={false}
            hoverable
            // style={{ width: 480 }}
            cover={<img alt="example" src={require('../../../../public/product/lxgk.jpg')} />}
          />
          <Card className={styles.card} bordered={false}>
            物资车辆流向智能监控平台物资车辆流向智能监控平台通过综合使用云平台、GS地理信息技术、GPS+北斗定位技术、信息编码技术、物联网技术、移动通信技术，对业务车辆自装货出厂直至规定区域停车卸货进行全过程分析。<br /><br />
            “GPS+电子围栏+照片+载重”四维一体，以订单为核心，可实现轨迹的跟踪判断、行驶途中重量的监测判断、车辆装货照片的上传及智能比对等，预判经销商销售的产品是否有违流现象，实现了对物资车辆流向的智能管理。
          </Card>
          <Card className={styles.card} bordered={false}>
            {this.getButOrDiv()}
          </Card>
        </Card>
      </Panel>
    );
  }
}
export default FlowControl;
