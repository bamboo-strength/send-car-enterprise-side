import React, { PureComponent } from 'react';
import {Form,} from 'antd';
import '../Epidemic.less'
import { getCurrentDriver } from '@/utils/authority';
import { pageImmunization } from '@/services/epidemic';
import CommonListView from '@/components/MatrixMobile/CommonListView'
import { Button, } from 'antd-mobile';

@Form.create()
class VaccineRecords extends PureComponent {

  customBtn=(rowData)=>{
    return <Button type="primary" size='small' inline >修改 </Button>
  }

  render() {
    const rows = [{key:'',value:'reservtionQueueTime'},{key:'姓名',value:'driverName',obj:'antiepidemicQueueVO'}
      ,{key:'当前体温',value:'driverTemp',obj:'antiepidemicQueueVO'},{key:'返回地',value:'placeOfReturn',obj:'antiepidemicQueueVO'},{key:'驳回原因',value:'finalOpinion'}]
    const tableCondition = [
      {
        columnAlias:'姓名',
        columnName:'driverName',
        category:0,
      }
    ]
    return (
      <div>
        <CommonListView
          functionName='防疫记录'
          rows={rows}
          path={pageImmunization}
          originParam={{driverId:getCurrentDriver().id}}
          extra='applyStatusName'
          // viewPath='/epidemic/epidemicEdit'
          tableCondition={tableCondition}
          // customBtn={this.customBtn}
        />
      </div>
    );
  }
}


export default VaccineRecords;
