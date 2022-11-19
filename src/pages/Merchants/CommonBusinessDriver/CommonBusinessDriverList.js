import React, {  PureComponent } from 'react';
import {Form, message, Modal} from 'antd/lib/index';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { freeze } from '@/services/dispatchplan';
import {getTenantId,GeneralQuery } from '@/pages/Merchants/commontable';
import { getDriverList,auditData } from '@/services/commonBusiness';
import MatrixListViewForTable from '@/components/Matrix/MatrixListViewForTable';
import router from 'umi/router';

@connect(({ tableExtend }) => ({
  tableExtend,
}))
@Form.create()
class CommonBusinessDriverList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      params: {},
      tableTitle:'',
      queryData:[]
    }
    this.conditions = []
  }

  handleSearch = (params,tableCondition) => {
    GeneralQuery(func.notEmpty(tableCondition)?tableCondition:this.conditions,params)
    this.conditions = func.notEmpty(tableCondition) && tableCondition.length>0?tableCondition:this.conditions
    const tc=this.conditions[0].tableAlias
    let codeName=''
    if (func.notEmpty(tc)){
      codeName=tc
    }
    this.setState({
      params,
      tableTitle:codeName
    });
    const rparams = params
    rparams['Blade-DesignatedTenant'] = getTenantId()
    delete rparams.headers
    getDriverList(func.parseQuery(rparams)).then(resp => {
      const retutnData =resp.data
      const aa = retutnData
      aa.list = retutnData.records
      this.setState({
        queryData:aa,
      });
      this.child && this.child.onClose()
    })
  };


  handleAuditClick = (code, record) => {
    let str = ""
    if (code === '1') {
      str = "审核"
    } else if (code === '2') {
      str = "取消审核"
    }
    const {id}=record
    const { params } = this.state;
    params.current =1
    const refresh = this.handleSearch;
    Modal.confirm({
      title: `${str}确认`,
      content: `确定${str}该条记录?`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        auditData({ ids:id ,auditStatus: code }).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            refresh(params);
          }
        });
      },
    });
  }


  handleEnableClick = (code, record) => {
    let str = ""
    if (code === '1') {
      str = "启用"
    } else if (code === '0') {
      str = "禁用"
    }
    const {id}=record
    const { params } = this.state;
    params.current =1
    const refresh = this.handleSearch;
    Modal.confirm({
      title: `${str}确认`,
      content: `确定${str}该条记录?`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        freeze({ ids:id, status: code }).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            refresh(params);
          }
        });
      },
    });
  }

  handleBtnCallBack = param => {
    const { btn, obj } = param;
    switch (btn.code) {
      case 'audit':
          router.push(`/commonDriverAudit/commonDriverAudit/audit/${obj.id}`);
        break;
      default:
    }
  }

  render() {
    const { form } = this.props;
    const {tableTitle,queryData} = this.state
    return (
      <div>
        <MatrixListViewForTable
          data={queryData}
          navName={tableTitle}
          titleName={tableTitle}
          tableName='mer_driver'
          modulename='manualAudit'
          form={form}
          code='mer_driver_manualAudit'
          getDataFromPa={this.handleSearch}
          btnCallBack={this.handleBtnCallBack}
          // buttonsNone
          notAdd
          xs={9}
          backgroundStyle='rowData.auditStatus===2?"rgb(236 216 216)":"white"'
          //  addPath='/commonBusinessVehicle/commonBusinessVehicle/add'
          onRef={(ref)=>this.child = ref}
        />
      </div>
    );
  }
}

export default CommonBusinessDriverList;
