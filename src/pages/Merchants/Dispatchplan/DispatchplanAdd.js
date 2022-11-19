import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form, Card, Button, message } from 'antd/lib/index';
import func from '@/utils/Func';
import { DISPATCHPLAN_SUBMIT,UPDATESTATE } from '@/actions/dispatchplan';
import {getAddConf} from '@/components/Matrix/MatrixAddConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import MobileSubEdit from '../../../components/MobileSubEdit';
import { addSaveCommon } from '../commontable';


@connect(({ dispatchplan, loading }) => ({
  dispatchplan,
  loading: loading.models.dispatchplan,
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class DispatchplanAdd extends PureComponent {

  state = {
    showColums: [],
    showSubColums:[],
    dataSource:[],
    ziSaveFlag:true,
    tableTitle:''
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({tableName:'mer_dispatchplan','modulename':'dispatchplan',queryType:1})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(data.columList!==null && data.columList!==undefined){
          const aa=data.columList;
          const tc=aa.table_main[0].tableAlias
          this.setState({
            showColums: aa.table_main,
            showSubColums: aa.table_sub,
            tableTitle:tc
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
    if(func.notEmpty(params)){
      params.isplan = 1
      dispatch(UPDATESTATE({ submitLoading: true }))
      dispatch(DISPATCHPLAN_SUBMIT(params));
    }
  };

  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:flag});
  }


  render() {
    const {
      form,
      dispatchplan:{submitLoading}
    } = this.props;

    const {showColums,showSubColums,dataSource,tableTitle} = this.state;
    const iteams=getAddConf(showColums,form);

    return (
      <div>
        <MobileSubEdit
          NavBarTitle={`新增${tableTitle}`}
          title={tableTitle}
          columns={showColums}
          subcolumns={showSubColums}
          iteams={iteams}
          needAdd
          dataSource={dataSource}
          form={form}
          subMethod={this.handleSubmit}
          backRouter='/dispatch/dispatchplan'
          onReturnData={this.onReturnData}
          submitLoading={submitLoading}
          />
      </div>
    );
  }
}
export default DispatchplanAdd;

