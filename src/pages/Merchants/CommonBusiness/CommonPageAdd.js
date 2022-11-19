import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form, } from 'antd/lib/index';
import func from '@/utils/Func';
import { COMMONBUSINESS_SUBMIT,UPDATESTATE } from '../../../actions/commonBusiness';
import {getAddConf} from '@/components/Matrix/MatrixAddConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { addSaveCommon } from '../commontable';
import MatrixSearchDataTable from '@/components/Matrix/MatrixSearchDataTable';
import MobileSubEdit from '../../../components/MobileSubEdit';

@connect(({ commonBusiness, tableExtend,loading }) => ({
  commonBusiness,
  tableExtend,
  loading: loading.models.commonBusiness,
}))

@Form.create()
class CommonPageAdd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      dataSource : [],
     // showColums: [],
     // showSubColums:[],
      ziSaveFlag:true,
    };
  }

  componentWillMount() {
    const {
      dispatch,form,
      match: {
        params: { tableName,modulename },
      }, } = this.props;
    form.resetFields()
    dispatch(TABLEEXTEND_COLUMNLIST({'tableName': tableName,'modulename':modulename,queryType:1}))
  }

  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:flag});
  }


//  提交按钮事件
  handleSubmit = e => {
    const {dataSource,ziSaveFlag} = this.state;
     e.preventDefault();
     const { form ,dispatch,
       match: {
       params: { tableName,modulename },},
       tableExtend:{ data }
     } = this.props;
    const showColums = data.columList.table_main
    const showSubColums = data.columList.table_sub
    const  params = addSaveCommon('add',form,dataSource,ziSaveFlag,showColums,showSubColums)
    if(func.notEmpty(params)){
      dispatch(UPDATESTATE({ submitLoading: true }))
      dispatch(COMMONBUSINESS_SUBMIT({tableName,modulename,submitParams:params,btnCode:'add'}))
    }
  };

  handleOkBefore = (selectedRows,fromSubData) =>{
    const { form ,
      tableExtend:{ data }
    } = this.props;
    const showSubColums = data.columList.table_sub
    if(fromSubData){ // 弹框显示子表数据 子表数据由此带出
      const newArr = []
      const vv ={}
      const  v = selectedRows[0]
      showSubColums.forEach((item)=>{
        vv[item.columnName] = v[item.columnName]?v[item.columnName]:item.initialvalue
        vv[item.showname] = v[item.showname]
      });
      newArr.push(vv);
      this.setState({
        dataSource:newArr
      })
    }else if(func.notEmpty(selectedRows[0].sublist) && showSubColums.length>0){
        const newArr = selectedRows[0].sublist.map((v,index)=>{    // 添加行号
          const vv ={'key':index+1}
          showSubColums.forEach((item)=>{
            vv[item.columnName] = v[item.columnName]
            vv[item.showname] = v[item.showname]
          });
          return vv
        })
        this.setState({
          dataSource:newArr
        })
      }
    return form;
  }

  render() {
    const {
      form,
      match: {
        params: { tableName,modulename },
      },
      commonBusiness: { submitLoading },
      tableExtend:{ data }
    } = this.props;
    const {dataSource} = this.state;
    const methods ={}
    const showColums = !Array.isArray(data.columList)?data.columList.table_main:[]
    const showSubColums = !Array.isArray(data.columList)?data.columList.table_sub:[]
    const columnWithPops = showColums.filter(item => item.category === 5)
    if(columnWithPops.length > 0){  // 弹框配置
      const columnWithPop = columnWithPops[0]
      methods[columnWithPop.columnName] = { searchs: this.child ? this.child.showModal : '' }
    }
    const iteams=getAddConf(showColums,form,methods);
    const backUrl = `/commonBusiness/commonList/${tableName}/${modulename}`

    return (
      <div>
        {
          columnWithPops.length>0?
            <MatrixSearchDataTable form={form} showColums={showColums} handleOkBefore={this.handleOkBefore} labelKey='billno' searchPath='/api/mer-salebill/salebill/selectpage' onRef={(ref)=>{ this.child = ref}} />
        :undefined
        }
        <MobileSubEdit
          NavBarTitle="新增"
          title="子项"
          columns={showColums}
          subcolumns={showSubColums.filter(ii=>ii.addShowFlag === 1)}
          iteams={iteams}
          dataSource={dataSource}
          form={form}
          subMethod={this.handleSubmit}
          backRouter={backUrl}
          onReturnData={this.onReturnData}
          submitLoading={submitLoading}
          commonIfnotNeedAddBtn={modulename.includes('notAddBtn')} // 不需要子表添加按钮
        />
      </div>
    );
  }
}
export default CommonPageAdd;

