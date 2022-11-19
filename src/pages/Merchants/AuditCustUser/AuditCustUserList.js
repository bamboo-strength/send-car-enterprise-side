import React, {  PureComponent } from 'react';
import {Form, message, Modal} from 'antd/lib/index';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { freeze } from '@/services/dispatchplan';
import {getTenantId,GeneralQuery } from '@/pages/Merchants/commontable';
import router from 'umi/router';
import { getUserRalation,auditData } from '../../../services/commonBusiness';
import MatrixListViewForTable from '@/components/Matrix/MatrixListViewForTable';


@connect(({ tableExtend }) => ({
  tableExtend,
}))
@Form.create()
class AuditCustUserList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      params: {},
      queryData:[]
    }
    this.conditions = []
  }



  handleSearch = (params,tableCondition) => {
    GeneralQuery(func.notEmpty(tableCondition)?tableCondition:this.conditions,params)
    this.conditions = func.notEmpty(tableCondition) && tableCondition.length>0?tableCondition:this.conditions
    this.setState({
      params,
    });

    const rparams = params
    rparams['Blade-DesignatedTenant'] = getTenantId()
    delete rparams.headers
    rparams.userType=20
    getUserRalation(func.parseQuery(rparams)).then(resp => {
      const retutnData =resp.data
      const aa = retutnData
      aa.list = retutnData.records
      this.setState({
        queryData:aa,
      });
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
          } else {
          //  message.error(resp.msg || `${str}失败`);
          }
        });
      },
      onCancel() {},
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
          } else {
            //  message.error(resp.msg || `${str}失败`);
          }
        });
      },
      onCancel() {},
    });
  }

  handleBtnCallBack = param => {
    const { btn, obj } = param;
    switch (btn.code) {
      case 'audit':
        if(obj.auditStatus ===1 ){
          message.warn(`该信息已${obj.auditStatusName}!`);
        }else {
          router.push(`${btn.path}/${obj.id}`);
        }
        break;
      case 'auditcancel':
        if(obj.auditStatus ===2 ){
          message.warn(`该信息已${obj.auditStatusName}!`);
        }else{
          router.push(`${btn.path}/${obj.id}`);
        }
        break;
      case 'enable':
        this.handleEnableClick('1',obj)
        break;
      case 'Disable':
        this.handleEnableClick('0', obj)
        break;
        default:
    }
  }



  render() {
    const { form } = this.props;
    const {queryData} = this.state
    return (
      <div>
        <MatrixListViewForTable
          data={queryData}
          navName='客户用户审核'
          titleName='客户用户审核'
          tableName='user_company_relation'
          modulename='audtit'
          form={form}
          code='customerUserRelation'
          getDataFromPa={this.handleSearch}
          btnCallBack={this.handleBtnCallBack}
          notAdd
          xs={9}
        />
      </div>
    );
  }
}

export default AuditCustUserList;
