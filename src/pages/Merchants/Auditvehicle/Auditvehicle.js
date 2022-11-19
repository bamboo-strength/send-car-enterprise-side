import React,{ PureComponent } from 'react';
import { Col, Form, message } from 'antd/lib/index';
import { connect } from 'dva/index';
import router from 'umi/router';
import { List } from 'antd-mobile';
import { AUDITVEHICLE_LIST,AUDITVEHICLE_INIT} from '../../../actions/auditvehicle'
import { disagree } from '@/services/auditvehicle';
import MatrixInput from '../../../components/Matrix/MatrixInput';
import MatrixSelect from '../../../components/Matrix/MatrixSelect';
import MatrixListView from '../../../components/Matrix/MatrixListView';
import { getTenantId} from "../commontable"

@connect(({ auditvehicle,loading }) =>({
  auditvehicle,
  loading:loading.models.auditvehicle,
}))
@Form.create()
class Auditvehicle extends PureComponent{


  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(AUDITVEHICLE_INIT( {
      code: ['relationTelentList',]
    }));
  }

  getData = params =>{
    const { dispatch } = this.props;
    params['relationTenantId'] = getTenantId()
    dispatch(AUDITVEHICLE_LIST(params));
  };


// ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const {
      form,
      auditvehicle:{
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
          <MatrixInput label="车号" placeholder="请输入车号" id="truckno" form={form}  />
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
    if (btn.code === 'auditvehicle') {
      if(obj.auditFlag !== 0 ){
        message.warn('该车辆信息已审核!');
        return
      }
        router.push(`/businessInto/auditvehicle/edit/${obj.id}`);
    }
    else if(btn.code === 'disagree'){
      if(obj.auditFlag !== 0 ){
        message.warn('该车辆信息不是未审核状态!');
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
    const code='auditvehicle';
    const{form,auditvehicle:{ data }} = this.props;

    const rows = [
      {
        key: '企业名称',
        value: 'tenantName',
      },
      {
        key: '车号',
        value: 'truckno',
      },
      {
        key: '车辆类型',
        value: 'trucktypeName',
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
    ];

    return (
      <MatrixListView
        data={data}
        navName='审核入驻车辆'
        rows={rows}
        form={form}
        code={code}
        renderSearchForm={this.renderSearchForm}
        getDataFromPa={this.getData}
        notAdd
        btnCallBack={this.handleBtnCallBack}
      />
    );
  }
}
export  default Auditvehicle;
