import React, { PureComponent } from 'react';
import Text from 'antd/es/typography/Text';
import { Avatar, List } from 'antd';
import { Flex } from 'antd-mobile';
import router from 'umi/router';
import {stringify} from 'qs'

export default class NetWorkListMeta extends PureComponent {
  test = (item)=>{
    const param={
      id:item.id,
      payeeAccountName:item.payeeMerchantName,
      createTime:item.createTime,
      outAmount:item.outAmount,
      bussType:item.bussType,
      transferStatus:item.transferStatus,
      outMerchantName:item.outMerchantName,
    }
    // router.push(`/wallet/wallet/billsview`)
    router.push({ pathname : '/wallet/wallet/billsview', state :param});

  }
  render() {
    const { data } = this.props;
    return (<List
      itemLayout="horizontal"
      dataSource={data}
      style={{margin: '0 3%'}}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            // avatar={<Avatar src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} />}
            onClick={() => this.test(item)}
            title={<Flex justify='between'>
              <Text strong>
                {item.bussType === 2?'提现':'运费'}
              </Text>
              <Text strong style={{fontSize:16}}>
                {item.bussType === 2 ?'-':'+'}{item.outAmount}元
              </Text>
            </Flex>}
            description={<Flex direction='column' align='start'>
              <Text style={{fontSize:12}}>运单号：{item.id}</Text>
              <Text style={{fontSize:10,marginTop:'1%'}}>{item.createTime}</Text>
            </Flex>}
          />
        </List.Item>
      )}
    />);
  }
}
