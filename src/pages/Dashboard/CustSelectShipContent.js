import React, { PureComponent } from 'react';
import { getCurrentUser } from '@/utils/authority';
import { connect } from 'dva';
import { Form, Select, message } from 'antd';
import { TENANTRELATION_LIST } from '../../actions/tenantRelation';
import func from '@/utils/Func';
import { getCommonParam } from '../Merchants/commontable';

@connect(({ tenantRelation, loading }) => ({
  tenantRelation,
  loading: loading.models.tenantRelation,
}))

@Form.create()
class CustSelectShipContent extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      firstVlaue: '',
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(TENANTRELATION_LIST({ tenantId: getCurrentUser().tenantId })).then(() => {
      const { tenantRelation: { data } } = this.props;
      if (func.notEmpty(data) && data.list.length > 0) {
        const real = localStorage.getItem('merchantsFhfTenantId') ? localStorage.getItem('merchantsFhfTenantId') : data.list[0].relation_tenant;
        localStorage.setItem('merchantsFhfTenantId', real);
        getCommonParam(real);  // 系统参数
        this.setState({
          firstVlaue: real,
        });
      }
      if (data.list.length === 0) {
        // message.config({ top: 100, duration: 100, maxCount: 1,});
        message.info('请先入驻发货方！');
        return false;
      }
    });
  }

  handleChangeTenant = (value) => {
    if (func.notEmpty(value)) {
      localStorage.setItem('merchantsFhfTenantId', value);
      getCommonParam(value);  // 系统参数
      location.reload();
    } else {
      localStorage.setItem('merchantsFhfTenantId', '');
    }
  };

  render() {
    const { firstVlaue } = this.state;
    // console.log(firstVlaue,localStorage.getItem("merchantsFhfTenantId"),'--------------')
    const {
      form: { getFieldDecorator },
      tenantRelation: { data },
    } = this.props;
    return (
      <span style={{ display: 'flex' }}>
        <div style={{ width: '20%', display: 'flex', alignItems: 'center' }}>发货方：</div>
        {getFieldDecorator('shipperTenantId', {
          initialValue: `${firstVlaue}` ? `${firstVlaue}` : undefined,
        })(
          <Select
            onChange={this.handleChangeTenant}
            placeholder="请输入发货方"
            style={{ width: '80%' }}
          >
            {data.list.map(d => (
              <Select.Option key={d.relation_tenant} value={d.relation_tenant}>
                {d.tenant_name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </span>
    );

  }
}

export default CustSelectShipContent;
