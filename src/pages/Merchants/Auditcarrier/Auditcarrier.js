import React,{ PureComponent } from 'react';
import { Col, Form, message } from 'antd/lib/index';
import { connect } from 'dva/index';
import router from 'umi/router';
import { List } from 'antd-mobile';
import { AUDITCARRIER_LIST,AUDITCARRIER_INIT} from '../../../actions/auditcarrier'
import func from '../../../utils/Func';
import MatrixAutoComplete from '../../../components/Matrix/MatrixAutoComplete';
import MatrixSelect from '../../../components/Matrix/MatrixSelect';
import MatrixListView from '../../../components/Matrix/MatrixListView';
import { getTenantId} from "../commontable"

@connect(({ auditcarrier,loading }) =>({
  auditcarrier,
  loading:loading.models.auditcarrier,
}))
@Form.create()
class Auditcarrier extends PureComponent{


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(AUDITCARRIER_INIT( {
      code: ['relationTelentList',]
    }));
  }

  getData = params =>{
    const { dispatch } = this.props;
    params.carrierType=2;
    delete params.carrierName;
    params['Blade-DesignatedTenant'] = getTenantId()
    dispatch(AUDITCARRIER_LIST(func.parseQuery(params)));
  };


// ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const {
      form,
      auditcarrier:{
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
          <MatrixSelect label="企业名称" placeholder="请选择企业名称" id="tenantId" options={items} style={{width: '100%'}} form={form} />
        </Col>
        <Col span={24} className='add-config'>
          <MatrixAutoComplete label='承运商' placeholder='拼音码检索' dataType='carrier' id='carrierId' labelId='carrierName' form={form} style={{width: '100%'}}/>
        </Col>
        <Col span={24} className='add-config'>
          <MatrixSelect label="审核状态" placeholder='请选择审核状态' id="auditFlag" dictCode="residentAuditFlag" style={{width: '100%'}} form={form} />
        </Col>
      </List>
    );
  };

  handleBtnCallBack = params => {
    const { btn, obj } = params;
    if (btn.code === 'auditcarrier') {
      if(obj.auditFlag !== 0 ){
        message.warn('该承运商信息已审核!');
        return
      }
        router.push(`/businessInto/auditcarrier/edit/${obj.id}`);
    }
  }

  render(){
    const code='auditcarrier';
    const{form,auditcarrier:{ data }, } = this.props;

    const rows = [
      {
        key: '企业名称',
        value: 'relationTenantName',
      },
      {
        key: '承运商名称',
        value: 'carrierName',
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
        navName='审核入驻承运商'
        rows={rows}
        form={form}
        code={code}
        renderSearchForm={this.renderSearchForm}
        getDataFromPa={this.getData}
        addPath="/businessInto/auditcarrier/add"
        btnCallBack={this.handleBtnCallBack}
      />
    );
  }
}
export  default Auditcarrier;
