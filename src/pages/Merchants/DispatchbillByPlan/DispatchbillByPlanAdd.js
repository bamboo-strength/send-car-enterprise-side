import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd/lib/index';
import func from '@/utils/Func';
import { DISPATCHBILL_SUBMIT,UPDATESTATE } from '@/actions/dispatchbill';
import {getAddConf} from '@/components/Matrix/MatrixAddConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { addSaveCommon} from '../commontable';
import MobileSubEdit from '../../../components/MobileSubEdit';
import MatrixSearchDataTable from '@/components/Matrix/MatrixSearchDataTable';

@connect(({ dispatchbill, loading }) => ({
  dispatchbill,
  loading: loading.models.dispatchbill,
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class DispatchplanAdd extends PureComponent {

  state = {
    dataSource : [],
    ziSaveFlag:true,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({'tableName': 'mer_dispatchbill','modulename':'byPlan',queryType:1})).then(() => {
    })
  }


  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:flag});
  }

//  提交按钮事件
  handleSubmit = e => {
    const {dataSource,ziSaveFlag} = this.state;
    const { form ,dispatch,tableExtend:{ data } } = this.props;
    const showColums = data.columList.table_main
    const showSubColums = data.columList.table_sub
     const billDD = data.columList.table_main.filter(item =>item.columnName === "orderId")
   let billDD2
   if (billDD.length > 0){
     billDD2 = billDD[0].bringData.split('|')
   }else {
     billDD2 =''
   }
    const  params = addSaveCommon('add',form,dataSource,ziSaveFlag,showColums,showSubColums)
    if(func.notEmpty(params)){
      params.form = form
      params.billBringData = billDD2[0] // 再来一车时使用 保留订单相关字段
      params.isplan=1
      dispatch(UPDATESTATE({ submitLoading: true }))
      dispatch(DISPATCHBILL_SUBMIT(params));
    }
  };




  handleOkBefore = (selectedRows) =>{
    const {form,tableExtend:{ data }} = this.props;
    const showSubColums = data.columList.table_sub
    if (func.notEmpty(selectedRows[0].sublist) && showSubColums.length>0) {
      const newArr = selectedRows[0].sublist.map((v, index) => {    // 添加行号
        const vv = { 'key': index + 1 }
        showSubColums.forEach((item) => {
          vv[item.columnName] = v[item.columnName]
          vv[item.showname] = v[item.showname]
        });
        return vv
      })
      this.setState({
        dataSource: newArr
      })
    }
    return form;
  };


  render() {
    const {
      form,
      dispatchbill:{submitLoading},
      tableExtend:{ data }
    } = this.props;
    const {dataSource} = this.state;
    const showColums = !Array.isArray(data.columList)?data.columList.table_main:[]
    const showSubColums = !Array.isArray(data.columList)?data.columList.table_sub:[]
    let tableTitle
    if (data.columList.table_main.length > 0){
      tableTitle=data.columList.table_main[0].tableAlias
    }else {
      tableTitle=''
    }
    const methods = {}
    const columnWithPops = showColums.filter(item => item.category === 5)
    if(columnWithPops.length > 0){  // 弹框配置
      const columnWithPop = columnWithPops[0]
      methods[columnWithPop.columnName] = { searchs: this.child ? this.child.showModal : '' }
    }
    const iteams=getAddConf(showColums,form,methods)
    return (
      <div>
        <MobileSubEdit
          NavBarTitle={`新增${tableTitle}`}
          title="项次"
          columns={showColums}
          subcolumns={showSubColums}
          iteams={iteams}
          dataSource={dataSource}
          form={form}
          subMethod={this.handleSubmit}
          backRouter='/dispatch/dispatchbillbyplan'
          onReturnData={this.onReturnData}
          submitLoading={submitLoading}
        />
        {
          columnWithPops.length>0?
            <MatrixSearchDataTable form={form} showColums={showColums} handleOkBefore={this.handleOkBefore} labelKey='orderId' searchPath='/api/mer-salebill/salebill/selectpage' onRef={(ref)=>{ this.child = ref}} />
            :undefined
        }
      </div>
    );
  }
}
export default DispatchplanAdd;

