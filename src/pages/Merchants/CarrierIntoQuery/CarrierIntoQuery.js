import React,{ PureComponent } from 'react';
import { Form} from 'antd/lib/index';
import { connect } from 'dva/index';
import { CARRIERINTOQUERY_LIST} from '../../../actions/carrierIntoQuery'
import func from '../../../utils/Func';
import { getTenantId} from "../commontable"
import MatrixListView from '../../../components/Matrix/MatrixListView';
import { List } from 'antd-mobile';
import MatrixAutoComplete from '@/components/Matrix/MatrixAutoComplete';
import MatrixSelect from '@/components/Matrix/MatrixSelect';

const  FormItem = Form.Item;

@connect(({ carrierIntoQuery,loading }) =>({
  carrierIntoQuery,
  loading:loading.models.carrierIntoQuery,
}))
@Form.create()
class CarrierIntoQuery extends PureComponent{

  getData = params =>{
    const { dispatch } = this.props;
    params.carrierType=2;
    delete params.carrierName;
    params['Blade-DesignatedTenant'] = getTenantId()
    dispatch(CARRIERINTOQUERY_LIST(func.parseQuery(params)));
  };

// ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const {
      form,
      carrierIntoQuery:{
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
      <List style={{fontSize:'15px'}}>
        <MatrixAutoComplete label='客户名称' placeholder='拼音码检索' dataType='customer' id='customerId' labelId='customerName' form={form} style={{width: '100%'}} />
        <MatrixSelect label="企业名称" placeholder="请选择企业名称" id="tenantId" options={items} style={{width: '100%'}} form={form} />
        <MatrixSelect label="审核状态" placeholder='请选择审核状态' id="auditFlag" dictCode="productAuditFlag" style={{width: '100%'}} form={form} />
      </List>
    );
  };


  render(){
    const code='carrierIntoQuery';
    const{form,carrierIntoQuery:{ data }} = this.props;
    const rows = [
      {
        key: '企业名称',
        value: 'relationTenantName',
      },
      {
        key: '承运商',
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
      {
        key: '创建人',
        value: 'createUserName',
      },
      {
        key: '创建时间',
        value: 'createTime',
      },
    ]

    return (
      <MatrixListView
        data={data}
        navName='承运商入驻企业查询'
        rows={rows}
        form={form}
        code={code}
        renderSearchForm={this.renderSearchForm}
        getDataFromPa={this.getData}
      />
    );
  }
}
export  default CarrierIntoQuery;
