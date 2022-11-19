import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { Form } from 'antd/lib/index';
import { DISPATCHPLAN_DETAIL,DISPATCHPLAN_SUBMIT } from '@/actions/dispatchplan';
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import MobileSubEdit from '../../../components/MobileSubEdit';
import { addSaveCommon } from '../commontable';

@connect(({ dispatchplan, loading }) => ({
  dispatchplan,
  loading: loading.models.dispatchplan,
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
 /* loading: loading.models.tableExtend,*/
}))
@Form.create()
class DispatchplanEdit extends PureComponent {

  state = {
    showColums: [],
    showSubColums:[],
    dataSource:[],
    ziSaveFlag:true,
    tableTitle:''
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
        const newArr = detail.sublist.map((v,index)=>{    // 添加行号
          return {...v,'key':index+1}
        })
        this.setState({
          dataSource: newArr
        })
      }
    );


    dispatch(TABLEEXTEND_COLUMNLIST({tableName:'mer_dispatchplan','modulename':'dispatchplan',queryType:2})).then(() => {
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
    const { form ,dispatch, dispatchplan: { detail }, } = this.props;
    const  params = addSaveCommon(detail.id,form,dataSource,ziSaveFlag,showColums,showSubColums)
    if(func.notEmpty(params)){
      params.isplan=1
      params.menuCode='派车计划'
      params.functionCode='派车计划修改'
      dispatch(DISPATCHPLAN_SUBMIT(params));
    }
/*      const {
      form,
      dispatch,
      match:{
        params:{id},
      },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(dataSource.length<1){
        message.error('至少有一条物料数据');
        return
      }
      if (!err) {
        const params = {
          id,
          ...values,
          begintime: func.format(values.begintime),
          endtime: func.format(values.endtime),
        }
        if(values.begintime>values.endtime){
          message.error('结束日期不能早于开始日期');
        }else {
          params.sublist = dataSource
          console.log("修改数据",params)
          dispatch(DISPATCHPLAN_SUBMIT(params));
        }
      }
    });  */
  }

  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:func.isEmpty(flag)?true:flag});
  }

  render() {
    const {
      form,
      dispatchplan: { detail },
    } = this.props;

    const {showColums,showSubColums,dataSource,tableTitle} = this.state;

    const methods = {
      billno:{
        searchs:this.showModal
      }
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
          needAdd
          dataSource={dataSource}
          form={form}
          subMethod={this.handleSubmit}
          backRouter='/dispatch/dispatchplan'
          onReturnData={this.onReturnData}
        />
      </div>
    );
  }
}
export default DispatchplanEdit;
