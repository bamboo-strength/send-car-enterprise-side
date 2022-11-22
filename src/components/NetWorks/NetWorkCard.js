import React, { PureComponent } from 'react';
import Text from 'antd/es/typography/Text';
import { Card } from 'antd';

export default class NetWorkCard extends PureComponent {
  render() {
    const { rowData, actions, onclick } = this.props;
    return (
      <Card
        title={<Text style={{ color: '#1890FF' }}>运单编号：{rowData.id}</Text>}
        extra={
          <div>
            {rowData.waybillStatusName === '已支付'
              ? rowData.evaluationDriverStatusName
              : rowData.waybillStatusName === '已审核'
              ? '待支付'
              : rowData.waybillStatusName}
          </div>
        }
        bordered={false}
        size="small"
        actions={actions}
        onClick={onclick}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 5,
            marginTop: 8,
          }}
        >
          <Text type="secondary">物资：{rowData.materialName}</Text>
          {/* <Text type="secondary">数量：{rowData.carryAmountName}</Text> */}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary">车号：{rowData.vehicleno}</Text>
          <Text type="secondary">货源类型：{rowData.sourceGoodsTypeName}</Text>
        </div>
      </Card>
    );
  }
}
