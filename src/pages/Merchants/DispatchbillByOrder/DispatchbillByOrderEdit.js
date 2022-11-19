import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { Form } from 'antd/lib/index';
import { DISPATCHBILL_DETAIL,DISPATCHBILL_UPDATE } from '@/actions/dispatchbill';
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import MobileSubEdit from '../../../components/MobileSubEdit';
import { addSaveCommon} from '../commontable';
import MatrixSearchDataTable from '@/components/Matrix/MatrixSearchDataTable';

@connect(({ dispatchbill, loading,tableExtend }) => ({
  dispatchbill,
  tableExtend,
  loading: loading.models.dispatchbill,
}))

@Form.create()
class DispatchplanAdd extends PureComponent {

  state = {
    dataSource:[],
    ziSaveFlag:true,
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(DISPATCHBILL_DETAIL(id)).then(()=>{
        const {
          dispatchbill: { detail },
        } = this.props;
      let newArr ={}
      if(func.notEmpty(detail.sublist)){
        newArr = detail.sublist.map((v,index)=>{    // 添加行号
          return {...v,'key':index+1}
        })
      }
      this.setState({
        dataSource: newArr
      })
      }
    );
    dispatch(TABLEEXTEND_COLUMNLIST({'tableName': 'mer_dispatchbill','modulename':'byOrder',queryType:2}))
  }

//  提交按钮事件
  handleSubmit = e => {
    const {dataSource,ziSaveFlag} = this.state
    e.preventDefault();
    const { form ,dispatch,dispatchbill: { detail }, tableExtend:{ data } } = this.props;
    const showColums = data.columList.table_main
    const showSubColums = data.columList.table_sub
    /* const billDD = data.columList.table_main.filter(item =>item.columnName === "orderId")
     let billDD2
     if (billDD.length > 0){
       billDD2 = billDD[0].bringData.split('|')
     }else {
       billDD2 =''
     } */
    const  params = addSaveCommon(detail.id,form,dataSource,ziSaveFlag,showColums,showSubColums)
    const realId = params.id
    if(func.notEmpty(params)){
      delete params.id
      params.realId = realId
  //    params.billBringData = billBringData
      params.isplan = 0
      params.menuCode='派车单按订单'
      params.functionCode='派车单按订单修改'
      dispatch(DISPATCHBILL_UPDATE(params));
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


  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:func.isEmpty(flag)?true:flag});
  }

  render() {
    const {
      form,
      dispatchbill: { detail },
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
    const methods={}
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
          backRouter='/dispatch/dispatchbillbyorder'
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
export default DispatchplanAdd;

