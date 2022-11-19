import React, { PureComponent } from 'react';
import { Form, message, Modal } from 'antd/lib/index';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { SALEBILL_LIST } from '@/actions/salebill';
import { appointcarrier,page} from '@/services/salebill';
import MatrixAutoComplete from '@/components/Matrix/MatrixAutoComplete';
import router from 'umi/router';
import { getTenantId ,GeneralQuery} from "../commontable";
import MatrixListViewForTable from '../../../components/Matrix/MatrixListViewForTable';
import { clientId } from '../../../defaultSettings';


@connect(({ salebill,loading }) =>({
  salebill,
  loading:loading.models.salebill,
}))
@Form.create()
class Salebill extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visibleAppoint: false,
      selectRow:'',
      params:{}
    }
  }


  handleSearch = (params,tableCondition) => {
    const { dispatch } = this.props;
     GeneralQuery(tableCondition,params)
    this.setState({ params });
    const rparams = params
    rparams['Blade-DesignatedTenant'] = getTenantId()
    delete rparams.headers
    dispatch(SALEBILL_LIST(func.parseQuery(rparams)));
  };

  handleBtnCallBack = param => {
    const { btn, obj } = param;
    switch (btn.code) {
      case 'appointcarrier':
      {
        if(obj.shipflag !== 0){
          message.warn('该订单已委托!')
        }else {
          this.setState({
            visibleAppoint: true,
            selectRow:obj
          });
        }
        break;
      }
      case 'onlineshipping':
      {
        const params = {billno:obj.billno}
        page(params).then((res)=>{
          if(res.data.id =="-1")
          {
            router.push({
              pathname:`/salebill/salebill/os/${obj.id}`,
              state:{data:obj}})
          }else
          {
            router.push({
              pathname:`/salebill/salebill/osview/${obj.billno}`,
              state:{data:obj}})
          }
        })
        break;
      }
      case 'releaseSource':
        router.push({
          pathname:`/salebill/salebill/rs/${obj.id}`,
          state:{data:obj}})
        break;
      default:
    }
  }


  handleAppointOk = e => {    // 委派承运商
    const { form} = this.props;
    const that = this
    const { params,selectRow } = that.state;
    const refresh = that.handleSearch;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        appointcarrier({id:selectRow.id,objectId:selectRow.billno,carrierId:values.cys,clientId:'kspt',carrType:10 }).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
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
    });
  };

  render() {
    const code = 'salebill';
    const { form , salebill:{ data }} = this.props;
    const {visibleAppoint} = this.state
     return (
        <div>
          <MatrixListViewForTable
            data={data}
            navName='订单管理'
            titleName='订单'
            tableName='mer_salebill'
            modulename={`salebill_${clientId}`}
            form={form}
            code={code}
            getDataFromPa={this.handleSearch}
            btnCallBack={this.handleBtnCallBack}
            // addPath='/salebill/salebill/add'
            notAdd
          />
          <Modal
            title="委派承运商"
            visible={visibleAppoint}
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
    </div>
    );
  }
}

export default Salebill;
