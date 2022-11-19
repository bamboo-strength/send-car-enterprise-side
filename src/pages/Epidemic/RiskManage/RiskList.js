import React, { PureComponent } from 'react';
import { NavBar } from 'antd-mobile';
import { Card, Icon } from 'antd';
import { router } from 'umi';
import { getCurrentUser } from '@/utils/authority';
import { riskList } from '@/services/epidemic';
import { page } from '@/services/KsWallet/AccountSerivce';
import MatrixListView from '@/components/MatrixMobile/MatrixListView';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';

class RiskList extends PureComponent {

  onClick = (type,id) => {
    if (type === 'list') router.push('/dashboard/function') // 返回
    if (type === 'add' ) router.push('/epidemic/riskmanage/add') // 新增
    if (type === 'edit') router.push(`/epidemic/riskmanage/edit/${id}`) // 修改
    if (type === 'view') router.push(`/epidemic/riskmanage/view/${id}`) // 查看
  }

  render() {
    const row = (rowData, sectionID, rowID)=>{
      const {deptName,riskAreaProvincial,riskAreaCity,createTime} = rowData
      const style = {color:'#1890ff'}
      const actions = [
        <div style={style} onClick={()=>this.onClick('view',rowData.id)}>查看</div>,
        <div style={style} onClick={()=>this.onClick('edit',rowData.id)}>修改</div>,
      ]
      return (
        <Card title={`厂区：${deptName}`} bordered={false} key={rowID} actions={actions}>
          <MatrixListItem label="风险地(省)" title={riskAreaProvincial} />
          <MatrixListItem label="风险地(市)" title={riskAreaCity} />
          <MatrixListItem label="创建时间" title={createTime} />
        </Card>
      )
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.onClick('list')}
          rightContent={[<Icon type="plus" onClick={()=>this.onClick('add')} />]}
        >中高风险管理
        </NavBar>
        <div className="am-list">
          <MatrixListView interfaceUrl={riskList} row={row} round param={{deptId:getCurrentUser().deptId}} />
        </div>
      </div>
    );
  }
}

export default RiskList;
