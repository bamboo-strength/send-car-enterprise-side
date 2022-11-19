import React, { PureComponent } from 'react';
import { Form, message, Modal } from 'antd/lib/index';
import {Toast } from 'antd-mobile';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { DISPATCHPLAN_LIST } from '@/actions/dispatchplan';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { freeze,changeMount,toaudit,entrust,submitAuditAddMun,updateAuditflag } from '@/services/dispatchplan';
import MatrixAutoComplete from '@/components/Matrix/MatrixAutoComplete';
import { getTenantId,GeneralQuery } from '../commontable';
import MatrixListViewForTable from '../../../components/Matrix/MatrixListViewForTable';
import { getButton } from '../../../utils/authority';


@connect(({ dispatchplan,loading }) =>({
  dispatchplan,
  loading:loading.models.dispatchplan,
}))

@Form.create()
class DispatchplanByOrderList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      params: {},
      visibleAppoint: false,
      visibleMount: false,
      selectRow:{},
      tableTitle:''
    }
    this.conditions = []
  }

  handleSearch = (params,tableCondition) => {
    const { dispatch } = this.props;
    GeneralQuery(func.notEmpty(tableCondition)?tableCondition:this.conditions,params)
    this.conditions = func.notEmpty(tableCondition) && tableCondition.length>0?tableCondition:this.conditions
    const tc=this.conditions.length>0?this.conditions[0].tableAlias:'派车计划'
    this.setState({
      params ,
      tableTitle:tc
    });
    const rparams = params
    rparams.isIncludeBillno =1
    rparams['Blade-DesignatedTenant'] = getTenantId()
    delete rparams.headers
    dispatch(DISPATCHPLAN_LIST(func.parseQuery(rparams)));
  };

  handleFreezeClick = (code, record) => {
    let str = "作废"
    if (code === '1') {
      str = "冻结"
    } else if (code === '2') {
      str = "解冻"
    }
    const { id } = record;
    const { params } = this.state;
    const refresh = this.handleSearch;

    Modal.confirm({
      title: `${str}确认`,
      content: `确定${str}该条记录?`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        freeze({ id, freezeflag: code }).then(resp => {
          if (resp.success) {
            Toast.success(resp.msg);
            refresh(params);
          } else {
          //  Toast.fail(resp.msg || `${str}失败`);
          }
        });
      },
      onCancel() {},
    });
  }

  handleBtnCallBack = param => {
    const { btn, obj } = param;
    const {params} = this.state
    const refresh = this.handleSearch;
    switch (btn.code) {
      case 'appointcarrier':
      {
       if(obj.freezeflag === 1){
          Toast.info('该数据已冻结，不能委派!')
        }else if(obj.status === 0){
          Toast.info('该数据已作废，不能委派!')
        }else if(obj.auditflag !== 3){
         Toast.info('该数据未通过审核，不能委派!');
        }else if(obj.shipflag !== 0){
          Toast.info('该数据已委派，不能重复提交!');
        } else {
          this.setState({
            visibleAppoint: true,
            selectRow:obj
          });
        }
        break;
      }
      case 'freeze':
        this.handleFreezeClick('1', obj)
        break;
      case 'unfreeze':
        this.handleFreezeClick('2', obj)
        break;
      case 'cancel':
        this.handleFreezeClick('3', obj)
        break;
      case 'toaudit':
          toaudit({ ids: obj.id}).then(resp => {
            if (resp.success) {
              Toast.success(resp.msg);
              refresh(params);
            } else {
             // message.error('提交审核失败');
            }
          });
        break;
      case 'changeMount':
       this.handleMountClick(obj)
        break;
      case 'toAuditChangeNum':
        submitAuditAddMun({ ids: obj.id}).then(resp => {
          if (resp.success) {
            Toast.success(resp.msg);
            refresh(params);
          } else {
            // message.error('提交审核失败');
          }
        });
        break;
      case 'YZaudit':
        if(obj.auditflag === 3){
          message.warn(`已经是${obj.auditflagName}状态,不需要重复操作`)
        }else{
          this.handleAuditClick('3', obj)
        }
        break;
      case 'YZcancel':
        if(obj.auditflag === 1){
          message.warn(`已经是${obj.auditflagName}状态,不需要重复操作`)
        }else{
          this.handleAuditClick('1', obj)
        }
        break;
        default:
    }
  }

  handleAuditClick = (code, record) => {
    let str = "作废"
    if (code === '3') { str = "审核通过" }
    else if (code === '1') { str = "未审核" }
    const { id } = record;
    const { params } = this.state;
    const refresh = this.handleSearch;

    Modal.confirm({
      title: `${str}确认`,
      content: `确定${str}该条记录?`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        updateAuditflag({ id, auditflag: code }).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            refresh(params);
          }
        });
      },
      onCancel() {
      },
    });
  }

  handleMountClick = (record) => {
    this.setState({
      visibleMount: true,
      selectRow:record,
    });
  }

  handleMountOk = e =>{
    const { form} = this.props;
    const that = this
    const { params,selectRow } = that.state;
    const refresh = that.handleSearch;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
       // console.log(selectRow,'===========selectRow')
        changeMount({ id:selectRow.id,addamount:values.amount }).then(resp => {
          if (resp.success) {
            Toast.success(resp.msg);
            that.handleCancel()
            refresh(params);
          } else {
           // message.error(resp.msg || `添加/扣减失败`);
          }
        });
      }
    });
  }

  handleAppointOk = e => {
    const { form} = this.props;
    const that = this
    const { params,selectRow } = that.state;
    const refresh = that.handleSearch;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        entrust({ objectId:selectRow.id,carrierId:values.cys,clientId:'kspt',carrType:20 }).then(resp => {
          if (resp.success) {
            Toast.success(resp.msg);
            that.handleCancel()
            refresh(params);
          } else {
           // message.error(resp.msg || `委托失败`);
          }
        });
      }
    });
  };

  handleCancel = e => {
    const { form} = this.props;
    form.resetFields()
    this.setState({
      visibleAppoint: false,
      visibleMount:false
    });
  };

  onRef = (ref) => {
    this.child = ref
  }


  render() {
    const code = 'dispatchplanByorder';
    const { form , dispatchplan:{ data }} = this.props;
    const {tableTitle} = this.state
   // const rows =getColums(showColums,'dispatchplanlist')
   // const subRows =getColums(showSubColums,'')
    const buttons = getButton(code)
    const actionButtons = buttons.filter(button => button.alias === 'add');
    return (
      <div>
        <MatrixListViewForTable
          data={data}
          navName={tableTitle}
          titleName={tableTitle}
        //  rows={rows}
        //  subRows={subRows}
          tableName='mer_dispatchplan'
          modulename='byOrder'
          form={form}
          code={code}
        //  renderSearchForm={this.renderSearchForm}
          getDataFromPa={this.handleSearch}
          btnCallBack={this.handleBtnCallBack}
          notAdd={!actionButtons.length>0}
          addPath='/dispatch/dispatchplanByorder/add'
        />
        <Modal
          title="委派承运商"
          visible={this.state.visibleAppoint}
          onOk={this.handleAppointOk}
          onCancel={this.handleCancel}
        >
          <MatrixAutoComplete
            label='承运商'
            placeholder='请使用拼音码选择承运商'
            dataType='carrier'
            id='cys'
            labelId='cysName'
            required
            form={form}
            style={{width:'100%'}}
          />
        </Modal>
        <Modal
          title="追加扣减数量"
          visible={this.state.visibleMount}
          onOk={this.handleMountOk}
          onCancel={this.handleCancel}
          className="visibleMount"
          width='80%'
        >
          <MatrixInput
            label='数量'
            placeholder='数量不能为空'
            id='amount'
            form={form}
            numberType='isNumber'
            maxLength={6}
            required
          />
        </Modal>

      </div>
    );
  }
}

export default DispatchplanByOrderList;
