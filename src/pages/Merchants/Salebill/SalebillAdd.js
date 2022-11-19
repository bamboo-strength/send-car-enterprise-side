import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form } from 'antd/lib/index';
import func from '@/utils/Func';
import { SALEBILL_SUBMIT,UPDATESTATE } from '@/actions/salebill';
import {getAddConf} from '@/components/Matrix/MatrixAddConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import MobileSubEdit from '../../../components/MobileSubEdit';
import { addSaveCommon } from "../commontable";


@connect(({ salebill, loading }) => ({
  salebill,
  loading: loading.models.salebill,
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class SalebillAdd extends PureComponent {

  state = {
    showColums: [],
    showSubColums:[],
    dataSource:[],
    ziSaveFlag:true
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({tableName:'mer_salebill','modulename':'salebill_kspt',queryType:1})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(data.columList!==null && data.columList!==undefined){
          const aa=data.columList;
          this.setState({
            showColums: aa.table_main,
            showSubColums: aa.table_sub
          })
        }
      }
    })
  }

//  提交按钮事件
  handleSubmit = e => {
    const {dataSource,ziSaveFlag,showColums,showSubColums} = this.state
    e.preventDefault();
    const { form ,dispatch } = this.props;
    const  params = addSaveCommon('add',form,dataSource,ziSaveFlag,showColums,showSubColums)
    params.controltype=0
    if(func.notEmpty(params)){
      params.isplan = 0
      dispatch(UPDATESTATE({ submitLoading: true }))
      dispatch(SALEBILL_SUBMIT(params));
    }
  };

  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:flag});
  }


  render() {
    const {
      form,
      salebill:{submitLoading}
    } = this.props;

    const {showColums,showSubColums,dataSource} = this.state;
    const iteams=getAddConf(showColums,form);

    return (
      <div>
        <MobileSubEdit
          NavBarTitle="新增订单"
          title="项次信息"
          columns={showColums}
          subcolumns={showSubColums}
          iteams={iteams}
          needAdd
          dataSource={dataSource}
          form={form}
          subMethod={this.handleSubmit}
          backRouter='/salebill/salebill'
          onReturnData={this.onReturnData}
          submitLoading={submitLoading}
        />
      </div>
    );
  }
}
export default SalebillAdd;

