import React,{ PureComponent } from 'react';
import { Col, Form } from 'antd/lib/index';
import { connect } from 'dva/index';
import { BUSINESSINTOQUERY_LIST,BUSINESSINTOQUERY_INIT} from '../../../actions/businessIntoQuery'
import func from '../../../utils/Func';
import { getTenantId} from "../commontable"
import MatrixListView from '../../../components/Matrix/MatrixListView';
import { List } from 'antd-mobile';
import MatrixAutoComplete from '@/components/Matrix/MatrixAutoComplete';
import MatrixSelect from '@/components/Matrix/MatrixSelect';


@connect(({ businessIntoQuery,loading }) =>({
  businessIntoQuery,
  loading:loading.models.businessIntoQuery,
}))
@Form.create()
class BusinessIntoQuery extends PureComponent{



  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(BUSINESSINTOQUERY_INIT( {
      code: ['telentList',]
    }));
  }


  getData = params =>{
    const { dispatch } = this.props;
    params.customerType=2;
    delete params.customerName;
    params['Blade-DesignatedTenant'] = getTenantId()
    dispatch(BUSINESSINTOQUERY_LIST(func.parseQuery(params)));
  };



// ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const {
      form,
      businessIntoQuery:{
        init: {
          telentList,
        },
      }
    } = this.props;
    const items = []
    telentList.map(value => {
      const aa = {
        key: value.relation_tenant,
        value: value.tenant_name
      }
      items.push(aa)
    })
    return (
      <List style={{fontSize:'15px'}} className='static-list'>
        <Col span={24} className='add-config'>
          <MatrixAutoComplete label='承运商' placeholder='拼音码检索' dataType='carrier' id='carrierId' labelId='carrierName' form={form} style={{width: '100%'}} />
        </Col>
        <Col span={24} className='add-config'>
          <MatrixSelect label="企业名称" placeholder="请选择企业名称" id="tenantId" options={items} style={{width: '100%'}} form={form}  />
        </Col>
        <Col span={24} className='add-config'>
          <MatrixSelect label="审核状态" placeholder='请选择审核状态' id="auditFlag" dictCode="productAuditFlag" style={{width: '100%'}} form={form} />
        </Col>
      </List>
    );
  };


  render(){
    const code='businessIntoQuery';
    const{form,businessIntoQuery:{ data }} = this.props;
    const rows = [
      {
        key: '企业名称',
        value: 'relationTenantName',
      },
      {
        key: '客户名称',
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
      <div className='outBasicStyle'>
        <MatrixListView
          data={data}
          navName='客户入驻企业查询'
          rows={rows}
          form={form}
          code={code}
          renderSearchForm={this.renderSearchForm}
          getDataFromPa={this.getData}
          notAdd
        />
      </div>

    );
  }
}
export  default BusinessIntoQuery;
