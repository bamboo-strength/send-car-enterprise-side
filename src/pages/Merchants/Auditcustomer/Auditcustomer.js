import React,{ PureComponent } from 'react';
import { Col, Form, message } from 'antd/lib/index';
import { connect } from 'dva/index';
import router from 'umi/router';
import { List } from 'antd-mobile';
import { AUDITCUSTOMER_LIST,AUDITCUSTOMER_INIT} from '../../../actions/auditcustomer'
import { disagree } from '@/services/auditcustomer';
import func from '../../../utils/Func';
import MatrixAutoComplete from '../../../components/Matrix/MatrixAutoComplete';
import MatrixSelect from '../../../components/Matrix/MatrixSelect';
import MatrixListView from '../../../components/Matrix/MatrixListView';
import { getTenantId} from "../commontable"
import MatrixInput from '../../../components/Matrix/MatrixInput';

@connect(({ auditcustomer,loading }) =>({
  auditcustomer,
  loading:loading.models.auditcustomer,
}))
@Form.create()
class Auditcustomer extends PureComponent{


  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(AUDITCUSTOMER_INIT( {
      code: ['relationTelentList',]
    }));
  }

  getData = params =>{
    const { dispatch } = this.props;
    params.customerType=2;
    delete params.customerName;
    params['Blade-DesignatedTenant'] = getTenantId()
    dispatch(AUDITCUSTOMER_LIST(func.parseQuery(params)));
  };


// ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const {
      form,
      auditcustomer:{
        init: {
          relationTelentList,
        },
      }
    } = this.props;
    const items = []
    relationTelentList.map(value => {
      const aa = {
        key: value.tenant_id,
        value: value.tenant_name
      }
      items.push(aa)
    })
    return (
      <List style={{fontSize:'15px'}} className='static-list'>
        <Col span={24} className='add-config'>
          <MatrixSelect label="企业名称" placeholder="请选择企业名称" id="tenantId" options={items} style={{width: '100%'}} form={form}  />
        </Col>
        <Col span={24} className='add-config'>
          <MatrixAutoComplete label='客户' placeholder='拼音码检索' dataType='customer' id='customerId' labelId='customerName' form={form} style={{width: '100%'}} />
        </Col>
        <Col span={24} className='add-config'>
          <MatrixSelect label="审核状态" placeholder='请选择审核状态' id="auditFlag" dictCode="residentAuditFlag" style={{width: '100%'}} form={form} />
        </Col>
      </List>
    );
  };


  handleBtnCallBack = params => {
    const { btn, obj } = params;
    const refresh = this.handleSearch;
    if (btn.code === 'auditcustomer') {
      if(obj.auditFlag !== 0 ){
        message.warn('该客户信息已审核!');
        return
      }
        router.push(`/businessInto/auditcustomer/edit/${obj.id}`);
    }
    else if(btn.code === 'disagree'){
      if(obj.auditFlag !== 0 ){
        message.warn('该客户信息不是未审核状态!');
        return
      }
        disagree({
          ids: obj.id,
          auditFlag:0,
        }).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            refresh(params);
          } else {
            message.error('驳回失败');
          }
        });
      }
  }

  render(){
    const code='auditcustomer';
    const{form,auditcustomer:{ data }} = this.props;

    const rows = [
      {
        key: '企业名称',
        value: 'relationTenantName',
      },
      {
        key: '客户',
        value: 'customerName',
      },
      {
        key: '统一社会信用代码',
        value: 'cods',
      },
      {
        key: '联系人',
        value: 'linkman',
      },
      {
        key: '联系电话',
        value: 'contactNumber',
      },
      {
        key: '审核状态',
        value: 'auditFlagName',
      },
      {
        key: '审核人',
        value: 'auditUserName',

      },
      {
        key: '审核时间',
        value: 'auditTime',
      },
    ];

    return (
      <MatrixListView
        data={data}
        navName='审核入驻客户'
        rows={rows}
        form={form}
        code={code}
        renderSearchForm={this.renderSearchForm}
        getDataFromPa={this.getData}
        addPath="/businessInto/auditcustomer/add"
        btnCallBack={this.handleBtnCallBack}
      />
    );
  }
}
export  default Auditcustomer;
