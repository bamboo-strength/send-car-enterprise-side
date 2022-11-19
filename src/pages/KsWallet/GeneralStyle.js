import { List } from 'antd';
import React from 'react';
import { router } from 'umi';
import { Flex } from 'antd-mobile';
import Text from 'antd/es/typography/Text';

/* 账单列表样式 */
export function BilllistStyle(props) {
  const {rowData:{id,transactionTypeName,amount,oppAcctName,transactionType,transStatus,transStatusName,createTime}} = props
  const amountStatus = transactionType === 2 || transactionType === 3 ? '+':'-'
  const textColor = transactionType === 2 || transactionType === 3 ? '#f9c108' :'#000000a6'
  return (
    <List.Item>
      <List.Item.Meta
        onClick={() => router.push(`/kswallet/billing/billingdetails/${id}`)}
        title={
          <Flex justify='between'>
            <Text strong>{transactionTypeName}</Text>
            <Text strong style={{ fontSize: 16,color:textColor }}>{amountStatus}{Number(amount).toFixed(2)}</Text>
          </Flex>}
        description={
          <div>
            <Flex direction='column' align='start'>
              <Text>{oppAcctName}</Text>
              <Flex direction='row' justify="between" style={{width: '100%',marginTop:'1%'}}>
                <Text>{createTime}</Text>
                <Text style={{ color: transStatus === 5 ? '#10E956' : transStatus === 2 ? '#1890FF' : '#ff0000' }}>{transStatusName}</Text>
              </Flex>
            </Flex>
          </div>}
      />
    </List.Item>
  )
}
