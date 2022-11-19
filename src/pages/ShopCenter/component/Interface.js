import { queryCompanyAuthDetail, queryUserAuthDetail } from '@/services/maintenance';
import router from 'umi/router';
import { Toast } from 'antd-mobile';
import Text from 'antd/es/typography/Text';
import { Icon } from 'antd';
import React from 'react';
import { checkReserveStatus } from '@/services/shoppingMall';
import {
  activitycontractManageDraft,
  activitydocumentAddByFile,
  contractManageDraft,
  documentAddByFile,
  pageurl,
} from '@/services/contract';
import { getUserType } from '@/utils/authority';

// 请求企业认证结果和个人认证结果
export const certificationResults = () => {
  return Promise.all([queryCompanyAuthDetail(),queryUserAuthDetail()]).then((resp) => {
    const items = []
    resp.forEach(i=> items.push(i.data))
    return items
  })
}

// 秒杀专区调用企业认证和个人认证接口，进行判断
export function QueryAuthentication() {
  certificationResults().then(item => {
    // item[0] 企业认证数据 item[1] 个人认证数据
    if (item[0].authStatus === 2 && item[1].authStatus === 1) {
      router.push('/shopcenter/secondskill');
    } else if (item[0].authStatus !== 2) {
      Toast.fail('请先去信息维护，进行企业认证！');
    } else if (item[1].authStatus !== 1) {
      Toast.fail('请先去信息维护，进行个人认证！');
    } else {
      Toast.fail('请先去信息维护，进行企业认证和个人认证');
    }
  });
}

// 竞价专区调用企业认证和个人认证接口，进行判断
export function QueryAuthenticationForTheZone() {
  const {custTypeFlag} = getUserType()!==null&&getUserType()
  if(custTypeFlag!==undefined&&custTypeFlag=== 0){
    certificationResults().then(item => {
      // item[0] 企业认证数据 item[1] 个人认证数据
      if (item[0].authStatus === 2 && item[1].authStatus === 1) {
        router.push('/shopcenter/forthezone');
      } else if (item[0].authStatus !== 2) {
        Toast.fail('请先去信息维护，进行企业认证！');
      } else if (item[1].authStatus !== 1) {
        Toast.fail('请先去信息维护，进行个人认证！');
      } else {
        Toast.fail('请先去信息维护，进行企业认证和个人认证');
      }
    });
  }else{
    certificationResults().then(item => {
      // item[0] 企业认证数据 item[1] 个人认证数据
      if (item[1].authStatus === 1) {
        router.push('/shopcenter/forthezone');
      }else if (item[1].authStatus !== 1) {
        Toast.fail('请先去信息维护，进行个人认证！');
      } else {
        Toast.fail('请先去信息维护，进行个人认证');
      }
    });
  }

}

/* 判断确认订单从哪个页面进入 */
export const PageJudgment = (state, props) => {
  if (state) {
    const { location: { state: { data, number, type, list } } } = props;
    return { data, number, type, list };
  }
  return JSON.parse(localStorage.getItem('settlementData'));
};

// 修改购买数量
export const numbers = (num, item,onClick) => (
  <Text strong>{num}吨
    {onClick !== undefined && <Icon
      type="edit"
      theme="twoTone"
      style={{ marginLeft: 6 }}
      onClick={()=>onClick(item)}
    />}
  </Text>
)

// 标题处理
export const shopTitle =  (name, units) => (
  <div className='listTie detailTie'>
    <Text strong>{name}</Text>
    <Text type="danger">{units}</Text>
  </div>
);

// 检验是否已经预约活动
export const checkReserve = (id) => {
  return new Promise(resolve => {
    checkReserveStatus({spikeActivityId:id}).then(item =>{
      if (item.success){
        resolve(item.data)
        return item.data
      }
    })
  })
}

// 创建合同草稿
export function contractManageDrafts(data) {
  return new Promise((resolve,reject) => {
    contractManageDraft({ contactId: data }).then(item=>{
      if (item.success) {
        Toast.loading('正在创建合同，请不要退出');
        resolve(data);
      }
      if (!item.success) reject(new Error('Error'))
    })
  })
}

// 创建活动合同草稿
export function activitycontractManageDrafts(data) {
  return new Promise((resolve,reject) => {
    activitycontractManageDraft({ contactId: data }).then(item=>{
      if (item.success) {
        Toast.loading('正在创建合同，请不要退出');
        resolve(data);
      }
      if (!item.success) reject(new Error('Error'))
    })
  })
}

// ⽤模板添加合同⽂档
export function documentAddByFiles(data) {
  return new Promise((resolve,reject) => {
    if (data !== 'Error'){
      documentAddByFile({ bizId: data }).then(item=>{
        if (item.success) {
          Toast.loading('正在跳转签署页面，请不要退出');
          resolve(item.data);
        }
        if (!item.success) reject(new Error('Error'))
      })
    }else {
      reject(data)
    }
  })
}

// 活动--⽤模板添加合同⽂档
export function activitydocumentAddByFiles(data) {
  return new Promise((resolve,reject) => {
    if (data !== 'Error'){
      activitydocumentAddByFile({ bizId: data }).then(item=>{
        if (item.success) {
          Toast.loading('正在跳转签署页面，请不要退出');
          resolve(item.data);
        }
        if (!item.success) reject(new Error('Error'))
      })
    }else {
      reject(data)
    }
  })
}
// ⽤模板添加合同⽂档
export function pageurls(data) {
  return new Promise((resolve,reject) => {
    if (data !== 'Error'){
      pageurl({ contractId: data.contractId, pageType: 'DIRECT_SIGN' }).then(item=>{
        if (item.success) resolve({ ...data, ...item.data })
        if (!item.success) reject(new Error('Error'))
      })
    }else {
      reject(data)
    }
  })
}
