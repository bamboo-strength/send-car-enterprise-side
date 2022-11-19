import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { Form} from 'antd/lib/index';
import { COMMONBUSINESS_DETAIL,COMMONBUSINESS_SUBMIT, UPDATESTATE } from '@/actions/commonBusiness';
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import { addSaveCommon } from '../commontable';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import MatrixSearchDataTable from '@/components/Matrix/MatrixSearchDataTable';
import MobileSubEdit from '../../../components/MobileSubEdit';

@connect(({ commonBusiness,tableExtend, loading }) => ({
  commonBusiness,
  tableExtend,
  loading: loading.models.commonBusiness,
}))

@Form.create()
class CommonPageEdit extends PureComponent {

  state = {
    dataSource : [],
  //  showColums: [],
  //  showSubColums:[],
    ziSaveFlag:true,
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id,tableName,modulename },
      },
    } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({tableName,modulename,queryType:1}))
    dispatch(COMMONBUSINESS_DETAIL({realId:id, tableName,modulename})).then(()=>{
        const {
          commonBusiness: { detail },
        } = this.props;
        let newArr =[]
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

  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(UPDATESTATE({
      detail: {}
    }))
  }


  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:func.isEmpty(flag)?true:flag});
  }

//  提交按钮事件
  handleSubmit = e => {
    const {dataSource,ziSaveFlag} = this.state;
    e.preventDefault();
    const { form ,dispatch,commonBusiness:{detail},match: {
      params: { tableName,modulename }
    },location,
      tableExtend:{ data }} = this.props;
    const showColums = data.columList.table_main
    const showSubColums = data.columList.table_sub
/*    // 循环给子表id 防止id被弹框带出数据覆盖赋值
    if(detail.sublist && detail.sublist.length>0 && dataSource.length>0){
      detail.sublist.forEach((item,index) => {
        dataSource.forEach(key => {
          dataSource[index].id = item.id
        });
      });
    } */
    const  params = addSaveCommon(detail.id,form,dataSource,ziSaveFlag,showColums,showSubColums)
    const realId = params.id

    if(func.notEmpty(params)){
      delete params.id
      params.realId = realId
      dispatch(COMMONBUSINESS_SUBMIT({tableName,modulename,submitParams:params,btnCode:location && location.state?location.state.btnCode:'edit'}));
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
          if(item.columnName !== 'id'){
            vv[item.columnName] = v[item.columnName]
            vv[item.showname] = v[item.showname]
          }
        });
        return vv
      })
      this.setState({
        dataSource:newArr
      })
    }
    return form;
  };


  render() {
    const {
      form,
      match: {
        params: { tableName,modulename, },
      },
      commonBusiness: { detail },
      location,
      tableExtend:{ data }
    } = this.props;
    const showColums = !Array.isArray(data.columList)?data.columList.table_main:[]
    const showSubColums = !Array.isArray(data.columList)?data.columList.table_sub:[]

    const {dataSource} = this.state;
    const columnWithPops = showColums.filter(item => item.category === 5)
    const methods ={}
    if(columnWithPops.length > 0){
      const columnWithPop = columnWithPops[0]
      methods[columnWithPop.columnName] = { searchs: this.child ? this.child.showModal : '' }
    }
    const iteams=getEditConf(showColums,form,detail,methods);
    const backUrl = `/commonBusiness/commonList/${tableName}/${modulename}`
    return (
      <div>
        <MobileSubEdit
          NavBarTitle={location.state?location.state.topBarName:"修改"}
          title="子项"
          columns={showColums}
          subcolumns={showSubColums.filter(ii=>ii.updateShowFlag === 1 || ii.columnName === 'id')}
          iteams={iteams}
          dataSource={dataSource}
          form={form}
          subMethod={this.handleSubmit}
          backRouter={backUrl}
          onReturnData={this.onReturnData}
          commonIfnotNeedAddBtn={modulename.includes('notAddBtn')} // 不需要子表添加按钮
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
export default CommonPageEdit;

