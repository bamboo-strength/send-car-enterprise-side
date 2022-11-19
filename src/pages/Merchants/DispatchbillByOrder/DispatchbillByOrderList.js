import React, {  PureComponent } from 'react';
import { Button, Col, Form, message, Modal, Row } from 'antd/lib/index';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { DISPATCHBILL_LIST } from '@/actions/dispatchbill';
import {toaudit,freeze,updateAuditflag} from '@/services/dispatchbill';
import {getQueryConf} from '@/components/Matrix/MatrixQueryConfig';
import { getTenantId,GeneralQuery } from '../commontable';
import MatrixListViewForTable from '../../../components/Matrix/MatrixListViewForTable';
import { getButton } from '../../../utils/authority';
import QRCode from 'qrcode.react';
import router from 'umi/router';

@connect(({ dispatchbill,loading }) =>({
  dispatchbill,
  loading:loading.models.dispatchbill,
}))

@Form.create()
class DispatchbillByOrder extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      params: {},
      tableTitle:'',
      showQRCode:false,
      qrCodeValue:'',
    }
    this.conditions = []
  }




  handleSearch = (params,tableCondition) => {
    const { dispatch } = this.props;
    GeneralQuery(func.notEmpty(tableCondition)?tableCondition:this.conditions,params)
    this.conditions = func.notEmpty(tableCondition) && tableCondition.length>0?tableCondition:this.conditions
    const tc=this.conditions.length>0?this.conditions[0].tableAlias:'派车单'
    this.setState({
      params,
      tableTitle:tc
    });
      const rparams = params
      rparams.isplan=0
      rparams['Blade-DesignatedTenant'] = getTenantId()
      delete rparams.headers
      dispatch(DISPATCHBILL_LIST(func.parseQuery(rparams)))
    }

  handleFreezeClick = (code, record) => {
    let str = "作废"
    if (code === '1') {str = "冻结"}
    else if (code === '2') { str = "解冻"}
    else if (code === '7') {
      str = "确认派车"
    } else if (code === '8') {
      str = "取消派车"
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
            message.success(resp.msg);
            refresh(params);
          } else {
          //  message.error(resp.msg || `${str}失败`);
          }
        });
      },
      onCancel() {
      },
    });
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

  handleBtnCallBack = param => {
    const { btn, obj } = param;
    const { params,showQRCode,qrCodeValue } = this.state;
    const refresh = this.handleSearch;
    switch (btn.code) {
      case 'freeze':
        this.handleFreezeClick('1', obj)
        break;
      case 'unfreeze':
        this.handleFreezeClick('2', obj)
        break;
      case 'cancel':
        this.handleFreezeClick('3', obj)
        break;
      case 'confirmDispatch':
        this.handleFreezeClick('7', obj)
        break;
      case 'cancelDispatch':
        this.handleFreezeClick('8', obj)
        break;
      case 'toaudit':
          toaudit({ ids:obj.id}).then(resp => {
            if (resp.success) {
              message.success(resp.msg);
              refresh(params);
            } else {
             // message.error('提交审核失败');
            }
          });
        break;
      case 'YZaudit':
        if(obj.auditflag === 3){
          message.warn(`已经是${obj.auditflagName}状态,不需要重复操作`)
        }else {
          this.handleAuditClick('3', obj)
        }
        break;
      case 'YZcancel':
        if(obj.auditflag === 1){
          message.warn(`已经是${obj.auditflagName}状态,不需要重复操作!`)
        }else{
          this.handleAuditClick('1', obj)
        }
        break;
      case 'qrCode':
        this.setState({
          showQRCode:true,
          qrCodeValue:obj.id,
        })
        break;
        case 'UploadImage':
        router.push({
          pathname:`/weiJiao/wjDispatchOrderByPurchase/add`,
          state:{
            id:obj.id
          }},
        )
        break;
      default:
    }
  }

  handleCancel = e => {
    const { form} = this.props;
    form.resetFields()
    this.setState({
      showQRCode:false,
    });
  };

  renderSearchForm = () => {
    const { form } = this.props;
    const {tableCondition} = this.state
    const queryItem = getQueryConf(tableCondition,form,{})
    return (
      <div>
        {queryItem}
      </div>
     /* <List style={{fontSize:'15px'}}>
        <MatrixInput label="派车编号" placeholder="派车编号" id="id" form={form}  />
        <MatrixInput label="订单号" placeholder="订单号" id="orderId" form={form}  />
        <MatrixAutoComplete label='客户' placeholder='拼音码' dataType='customer' id='custno' labelId='custName' form={form} style={{width:'100%'}} />
        <MatrixAutoComplete label='物资' placeholder='拼音码' dataType='goods' id='materialnos' labelId='materialnosName' form={form} style={{width:'100%'}} />
        <MatrixInput label="车号" placeholder="车号" id="vehicleno" form={form}  />
        <MatrixSelect label="审核状态" placeholder='审核状态' id="auditflag" form={form} dictCode='dispatchaudit' style={{width:'150px'}} />
        <MatrixSelect label="过车类型" placeholder='过车类型' id="singleflag" form={form} dictCode='singleflag' style={{width:'150px'}} />
        <MatrixSelect label="装卸类型" id="loadtype" placeholder='装卸类型' form={form} dictCode='loadtype' style={{width:'150px'}} />
      </List> */
    );
  }

  render() {
    const code = 'dispatchbillbyorder';
    const { form , dispatchbill:{ data }} = this.props;
    const {tableTitle,showQRCode,qrCodeValue} = this.state
    const buttons = getButton(code)
    const actionButtons = buttons.filter(button => button.alias === 'add');
    return (
      <div>
      <MatrixListViewForTable
        data={data}
        navName={tableTitle}
        titleName={tableTitle}
        tableName='mer_dispatchbill'
        modulename='byOrder'
        form={form}
        code={code}
        getDataFromPa={this.handleSearch}
        btnCallBack={this.handleBtnCallBack}
        notAdd={!actionButtons.length>0}
        addPath='/dispatch/dispatchbillbyorder/add'
      />
        <Modal
          visible={showQRCode}
          transparent
          maskClosable
          animationType='fade'
          platform='android'
          onCancel={this.handleCancel}
          footer={null}
          className='csModel'
        >
          <QRCode
            value={qrCodeValue}// 生成二维码的内容
            size={152} // 二维码的大小
            fgColor="#000000" // 二维码的颜色
          />
        </Modal>
      </div>
    );
  }
}

export default DispatchbillByOrder;
