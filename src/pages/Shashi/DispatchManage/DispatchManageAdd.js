import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form } from 'antd/lib/index';
import func from '@/utils/Func';
import { Toast } from 'antd-mobile';
import { COMMONBUSINESS_SUBMIT, UPDATESTATE } from '../../../actions/commonBusiness';
import { getAddConf } from '@/components/Matrix/MatrixAddConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { addSaveCommon } from '../../Merchants/commontable';
import MatrixSearchDataTable from '@/components/Matrix/MatrixSearchDataTable';
import MobileSubEdit from '../../../components/MobileSubEdit';
import { getCurrentUser } from '@/utils/authority';
import { queryDiscountPrice } from '../../../services/shashiServices';


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
   // dispatch(TABLEEXTEND_COLUMNLIST({'tableName': 'mer_dispatchbill','modulename':'retailInvestors',queryType:1}))
    dispatch(TABLEEXTEND_COLUMNLIST({tableName,modulename,queryType:1}))
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
    const  params = addSaveCommon('add',form,dataSource,ziSaveFlag,showColums,showSubColums,true)
    if(func.notEmpty(params)){
      if(params.ifCertainMaterial === "0"){ // 选择主合同
        const subData = {grosspreamount:params.grosspreamount}
        params.sublist = []
        params.sublist.push(subData)
      }else { // 选择子合同
        params.contractno = params.contractnomain
        params.contractSubno = params.contractSubno
      }
      dispatch(UPDATESTATE({ submitLoading: true }))
      dispatch(COMMONBUSINESS_SUBMIT({tableName,modulename,submitParams:params,btnCode:'add'}))
    }
  };

  // 单价派车添加--散户获取单价
  getMaterialPriceByAdd =(form1)=> {
    const {form,match: {
      params: { tableName,modulename },},} = this.props
    const deptId=form.getFieldValue("deptId");
    const custno=form.getFieldValue("custno");
    const loadtype=form.getFieldValue("loadtype");
    if(typeof form1.getFieldsValue === 'function' && loadtype==="1"){
      if(func.isEmpty(deptId)){
        form1.setFieldsValue({ 'price':0})
        Toast.info('请先选择所属机构')
        return;
      }
      if(modulename==='dispatchManage' && func.isEmpty(custno)){ // 大客户派车
        form1.setFieldsValue({ 'price':0})
        Toast.info('请先选择客户！');
        return;
      }
      const materialno=form1.getFieldValue("materialno");
     // console.log(materialno,form1.getFieldsValue(),'====materialno')
      if(func.isEmpty(materialno)){
        form1.setFieldsValue({ 'price':0})
        return;
      }
      const user = getCurrentUser();
      const params = {'tenantId':user.tenantId,'deptId':deptId,'materialno':materialno,'custno':custno}
      queryDiscountPrice({tableName,modulename,btnCode: 'bringPriceSub',queryParam:params}).then((resp) => {
        let price = 0;
        if(resp.success && resp.data!==null && resp.data!==undefined) {
          const aa = resp.data
          if(Array.isArray(aa.data)){
            price = aa.data[0]?.price || 0
          }else {
            price = aa.data.data
          }
          form1.setFieldsValue({ 'price': price })
        }else{
          form1.setFieldsValue({ 'price': 0 })
        }
      })
    }
  }

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
        if(item.columnName !== 'id'){
          vv[item.columnName] = v[item.columnName]?v[item.columnName]:item.initialvalue
          vv[item.showname] = v[item.showname]
        }
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
  }

  // 修改组织机构和客户重新获取单价
  getMaterialPriceByCustAdd=()=> {
    const { form ,
      match: {
        params: { tableName,modulename },}
    } = this.props;
    const deptId = form.getFieldValue("deptId");
    const custno = form.getFieldValue("custno");
    const loadtype = form.getFieldValue("loadtype");
    const user = getCurrentUser();
    if (loadtype === "1") {
      if(deptId===null || deptId === undefined || deptId.length===0 || custno === null || custno === undefined){
        return;
      }
      const paramstr = {
        deptId, custno, tenantId: user.tenantId
      }
      const params = {
        ...paramstr,
        sublist: this.state.dataSource.map(item => {
          return {
            materialno: item.materialno,
            price: item.price,
            preamount: item.preamount
          }
        })
      }
      queryDiscountPrice({tableName,modulename,btnCode: 'bringPriceMain',queryParam:params}).then((resp) => {
        if (resp.success && resp.data && resp.data.data.length) {
          const aa = resp.data
          const resData = aa.data.map(item => {
            return { ...item, rowKey: Math.random() }
          })
          this.setState({ dataSource: resData });
        }
      })
      /* .catch((resp) => {
        message.warning(resp?.msg || '系统异常');
      }) */
    }
    // 当客户改变时清空
    form.setFieldsValue({ region: undefined });
    form.setFieldsValue({ regionName: undefined });
  }

  // 更新当前最新选择的组织机构
  getDeptInfo= ()=> {
    const {form} = this.props;
    this.getMaterialPriceByCustAdd();
  };

  // 是否确定物资 切换主合同/子合同带回
  ifCertainMaterials=()=>{
    const {form} = this.props
    form.resetFields()
    this.setState({
      dataSource:[]
    })
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
    const methods ={
      deptId:{
        onChange:this.getDeptInfo
      },
      custno:{
        onSelect:this.getMaterialPriceByCustAdd
      },
      ifCertainMaterial:{ // 根据是否能确定物资 决定弹框数据
        onChange:this.ifCertainMaterials
      }
    }
    let showColums = !Array.isArray(data.columList)?data.columList.table_main:[]
    const ifCertainMaterial =form.getFieldValue('ifCertainMaterial')
    let showSubColums = []
    if(ifCertainMaterial === '0'){ // 不确定物资 选择主合同
      showColums = showColums.filter(item => item.columnName !== 'contractSubno')
      showSubColums = []
    }else { // 确定物资 选择子合同
      showColums = showColums.filter(item => item.columnName !== 'contractno')
      showSubColums = !Array.isArray(data.columList)?data.columList.table_sub:[]
    }
    const columnWithPops = showColums.filter(item => item.category === 5)
    if(columnWithPops.length > 0){  // 弹框配置
      const columnWithPop = columnWithPops[0]
      methods[columnWithPop.columnName] = { searchs: this.child ? this.child.showModal : '' }
    }
    const iteams=getAddConf(showColums,form,methods);
    // console.log(form.getFieldsValue())
    const backUrl = `/commonBusiness/commonList/${tableName}/${modulename}`
    const methodsSub = {
      materialno:{
        onSelect:(form1)=>this.getMaterialPriceByAdd(form1)
      },
    }
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
          methodsSub={methodsSub}
          ifSingleSub
          commonIfnotNeedAddBtn={modulename.includes('notAddBtn')} // 不需要子表添加按钮
        />
      </div>
    );
  }
}
export default CommonPageAdd;

