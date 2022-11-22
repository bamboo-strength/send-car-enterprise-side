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
class Merchants extends PureComponent {

  state = {
    detail: {},
    product: {},
  }

  componentWillMount() {
    const user = getCurrentUser();

    tenantDetail({createUser: user.userId, tenantId: user.tenantId,}).then((resDetail) => {
      if (resDetail.success && Func.notEmpty(resDetail.data.id)){
        tenantProduct({tenantDetailId:resDetail.data.id, product: 1}).then((resProduct) => {
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
    router.push(`/console/product/product/1`);
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
        <Card title="大车奔腾物流平台" className={styles.card} bordered={false}>
          <Card
            className={styles.card}
            bordered={false}
            hoverable
            // style={{ width: 480 }}
          />
          <Card className={styles.card} bordered={false}>
            客商平台用于企业物流信息的发布、承运计划的管理、车辆管理、运输信息的查询。<br /><br />
            提前规划、处理生产企业及购买企业的物流管理工作，提前将物流计划知会各方，信息实时传递准确无误，通过微信、邮件、短信、电话等多种方式在线通知。<br /><br />
            企业提前掌握物料需求，及时调整采购储备，减少采购资金占用。物流企业、车队、司机通过同一平台共享运输需求及调度信息。
          </Card>
          <Card className={styles.card} bordered={false}>
            {this.getButOrDiv()}
          </Card>
        </Card>
      </Panel>
    );
  }
}
export default Merchants;
