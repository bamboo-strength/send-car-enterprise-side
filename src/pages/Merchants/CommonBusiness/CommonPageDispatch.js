import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form, } from 'antd/lib/index';
import func from '@/utils/Func';
import { COMMONBUSINESS_SUBMITFORDISPATCH,UPDATESTATE } from '../../../actions/commonBusiness';
import {getAddConf} from '@/components/Matrix/MatrixAddConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { addSaveCommon, getTenantId } from '../commontable';
import MobileSubEdit from '../../../components/MobileSubEdit';
import router from 'umi/router';
import MatrixSearchDataTable from '@/components/Matrix/MatrixSearchDataTable';

// 公用派车新增功能
@connect(({ commonBusiness, tableExtend,loading }) => ({
  commonBusiness,
  tableExtend,
  loading: loading.models.commonBusiness,
}))

@Form.create()
class CommonPageDispatch extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      dataSource : [],
     // showColums: [],
    //  showSubColums:[],
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
        params: { tableName,modulename }, },
       tableExtend:{ data }
     } = this.props;
    const showColums = data.columList.table_main
    const showSubColums = data.columList.table_sub
    const  params = addSaveCommon('add',form,dataSource,ziSaveFlag,showColums,showSubColums)
    if(func.notEmpty(params)){
      dispatch(UPDATESTATE({ submitLoading: true }))
      dispatch(COMMONBUSINESS_SUBMITFORDISPATCH({tableName,modulename,submitParams:params,btnCode:'add'})).then(()=>{
        const {commonBusiness} =this.props
        if(commonBusiness.responseData.success){
        const param = { 'paramKey': 'dispatch.ifDispatchRepeat' };
        param.tenantId = getTenantId();
   //     getSystemParamByParamKey(param).then(resp => {
    //      if (resp.success && func.notEmpty(resp.data) && JSON.stringify(resp.data) !== '{}' ) {
            alert('提交成功', '再来一车？', [
              { text: '取消', onPress: () => router.push(`/commonBusiness/commonList/${tableName}/${modulename}`) },
              {
                text: '好的',
                onPress: () =>{
                  form.resetFields() // 清空车号或车辆相关信息
                }
              },
            ])
          }else {
          }
     //   });
      //  }
      })
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
        vv[item.columnName] = v[item.columnName]
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
    const showColums = !Array.isArray(data.columList)?data.columList.table_main:[]
    const showSubColums = !Array.isArray(data.columList)?data.columList.table_sub:[]
    const methods ={}
    const columnWithPops = showColums.filter(item => item.category === 5)
    if(columnWithPops.length > 0){  // 弹框配置
      const columnWithPop = columnWithPops[0]
      methods[columnWithPop.columnName] = { searchs: this.child ? this.child.showModal : '' }
    }
    const iteams=getAddConf(showColums,form,methods);
    const backUrl = `/commonBusiness/commonList/${tableName}/${modulename}`

    return (
      <div>
       {/* {ifPop} */}
        <MobileSubEdit
          NavBarTitle="新增"
          title="子项"
          columns={showColums}
          subcolumns={showSubColums}
          iteams={iteams}
          dataSource={dataSource}
          form={form}
          subMethod={this.handleSubmit}
          backRouter={backUrl}
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
export default CommonPageDispatch;

