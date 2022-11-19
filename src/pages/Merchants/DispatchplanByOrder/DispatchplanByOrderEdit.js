import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { Form } from 'antd/lib/index';
import { DISPATCHPLAN_DETAIL,DISPATCHPLANBYORDER_SUBMIT } from '@/actions/dispatchplan';
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import { addSaveCommon } from '../commontable';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import MobileSubEdit from '../../../components/MobileSubEdit';
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
class DispatchplanByOrderEdit extends PureComponent {

  state = {
    dataSource : [],
    ziSaveFlag:true,
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(DISPATCHPLAN_DETAIL(id)).then(()=>{
        const {
          dispatchplan: { detail },
        } = this.props;
      let newArr ={}
      if(func.notEmpty(detail.sublist)) {
         newArr = detail.sublist.map((v, index) => {    // 添加行号
          return { ...v, 'key': index + 1 }
        })
      }
        this.setState({
          dataSource: newArr
        })
      }
    );
    dispatch(TABLEEXTEND_COLUMNLIST({tableName:'mer_dispatchplan','modulename':'byOrder',queryType:2}))
  }

  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:func.isEmpty(flag)?true:flag});
  }



//  提交按钮事件
  handleSubmit = e => {
    const {dataSource,ziSaveFlag} = this.state;
    e.preventDefault();
    const { form ,dispatch, dispatchplan: { detail },tableExtend:{ data } } = this.props;
    const showColums = data.columList.table_main
    const showSubColums = data.columList.table_sub
    const  params = addSaveCommon(detail.id,form,dataSource,ziSaveFlag,showColums,showSubColums)
    if(func.notEmpty(params)){
      params.isplan = 0
      params.menuCode='派车计划按订单'
      params.functionCode='派车计划按订单修改'
      dispatch(DISPATCHPLANBYORDER_SUBMIT(params));
    }
  };


  handleOkBefore = (selectedRows) =>{
    const {form,tableExtend:{ data }} = this.props;
    const showSubColums = data.columList.table_sub
    if(func.notEmpty(selectedRows[0].sublist) && showSubColums.length>0) {
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
      dispatchplan: { detail },
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
    if(columnWithPops.length > 0){
      const columnWithPop = columnWithPops[0]
      methods[columnWithPop.columnName] = { searchs: this.child ? this.child.showModal : '' }
    }
    const iteams=getEditConf(showColums,form,detail,methods);
    return (
      <div>
        <MobileSubEdit
          NavBarTitle={`修改${tableTitle}`}
          title="项次"
          columns={showColums}
          subcolumns={showSubColums}
          iteams={iteams}
          dataSource={dataSource}
          form={form}
          subMethod={this.handleSubmit}
          backRouter='/dispatch/dispatchplanByorder'
          onReturnData={this.onReturnData}
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
export default DispatchplanByOrderEdit;

