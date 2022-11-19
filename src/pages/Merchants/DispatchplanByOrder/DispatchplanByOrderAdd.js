import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form } from 'antd/lib/index';
import func from '@/utils/Func';
import {getAddConf} from '@/components/Matrix/MatrixAddConfig';
import { addSaveCommon } from '../commontable';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import MobileSubEdit from '../../../components/MobileSubEdit';
import {DISPATCHPLANBYORDER_SUBMIT,UPDATESTATE} from '../../../actions/dispatchplan'
import MatrixSearchDataTable from '@/components/Matrix/MatrixSearchDataTable';

@connect(({ dispatchplan, loading }) => ({
  dispatchplan,
  loading: loading.models.dispatchplan,
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class DispatchplanByOrderAdd extends PureComponent {

  state = {
    dataSource : [],
    ziSaveFlag:true,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({tableName:'mer_dispatchplan','modulename':'byOrder',queryType:1}))
  }

  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:flag});
  }

//  提交按钮事件
  handleSubmit = e => {
    const {dataSource,ziSaveFlag} = this.state;
    e.preventDefault();
    const { form ,dispatch,tableExtend:{ data } } = this.props;
    const showColums = data.columList.table_main
    const showSubColums = data.columList.table_sub
    const  params = addSaveCommon('add',form,dataSource,ziSaveFlag,showColums,showSubColums)
    if(func.notEmpty(params)){
      params.isplan = 0
      dispatch(UPDATESTATE({ submitLoading: true }))
      dispatch(DISPATCHPLANBYORDER_SUBMIT(params));
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
      dispatchplan:{submitLoading},
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
    const iteams=getAddConf(showColums,form,methods);
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
          backRouter='/dispatch/dispatchplanByorder'
          onReturnData={this.onReturnData}
          submitLoading={submitLoading}
        />
        {
          columnWithPops.length>0?
            <MatrixSearchDataTable form={form} showColums={showColums} handleOkBefore={this.handleOkBefore} labelKey='billno' searchPath='/api/mer-salebill/salebill/selectpage' onRef={(ref)=>{ this.child = ref}} />
            :undefined
        }
      </div>
    );
  }
}
export default DispatchplanByOrderAdd;

