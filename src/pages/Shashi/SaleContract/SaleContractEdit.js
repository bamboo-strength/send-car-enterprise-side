import React, { PureComponent } from 'react';
import { Form, message } from 'antd';
import { connect } from 'dva';
import { cloneDeep } from 'lodash';
import { COMMONBUSINESS_DETAIL, COMMONBUSINESS_SUBMIT,UPDATESTATE } from '../../../actions/commonBusiness';
import MatrixInput from '../../../components/Matrix/MatrixInput';
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import func from '@/utils/Func';
import { getCurrentUser } from '../../../utils/authority';
import {queryDiscountPrice} from '../../../services/shashiServices';
import MobileSubEdit from '../../../components/MobileSubEdit';

@connect(({ commonBusiness, loading }) => ({
  commonBusiness,
  submitting: loading.effects['commonBusiness/submit'],
}))
@connect(({ tableExtend }) => ({
  tableExtend
}))
@Form.create()
class SaleContractEdit extends PureComponent {

  state = {
    dataSource : [],
    showColums: [],
    showSubColums:[],
    totalSubColums: [],
    totalColums:[],
    discountTypeObj: {},
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(COMMONBUSINESS_DETAIL({realId:id,'tableName': 'shashi_dinas_contract','modulename':'byMoney'})).then(()=>{
        const {
          commonBusiness: { detail },
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
      this.getConfig();
      }
    );

  }


  getConfig = () => {
    const { dispatch } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({'tableName': 'shashi_dinas_contract','modulename':'byMoney',queryType:2})).then(() => {
      const {tableExtend:{ data }, commonBusiness: { detail }} = this.props;
      if (data !== undefined) {
        if(func.notEmpty(data.columList)){
          const aa=data.columList;
          const totalColums=aa.table_main;
          const totalSubColums=aa.table_sub;
          let discountTypeObj = {};
          let newSubColums = cloneDeep(totalSubColums) || [];
          let newColums = cloneDeep(totalColums)||[];
          discountTypeObj=detail.discountType;
          const discountTypeValue = detail.discountType;
          const contractTypeSaveValue = detail.contractTypeSave;
          if (contractTypeSaveValue === 0 || contractTypeSaveValue === 4) {
            newColums = totalColums.filter(item => item.columnName !== 'discountType');
            newSubColums =totalSubColums.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice'&& item.columnName !== 'discountNm')
          }
          if (contractTypeSaveValue === 1) {
            if (discountTypeValue === 0) {
              newSubColums = totalSubColums.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice'&& item.columnName !== 'discountNm')
            } else if (discountTypeValue === 1) {
              newSubColums = totalSubColums.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountNm')
            } else if (discountTypeValue === 2) {
              newSubColums = totalSubColums.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice')
            }
          }
          if (contractTypeSaveValue === 2) {
            if (discountTypeValue === 0) {
              newSubColums = totalSubColums.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice'&& item.columnName !== 'discountNm')
            } else if (discountTypeValue === 1) {
              newSubColums = totalSubColums.filter(item => item.columnName !== 'discountPrice' && item.columnName !== 'discountNm')
            } else if (discountTypeValue === 2) {
              newSubColums = totalSubColums.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice')
            }
          }
          this.setState({
            showColums: newColums,
            showSubColums: newSubColums,
            totalSubColums: aa.table_sub,
            totalColums: aa.table_main,
            discountTypeObj,
          })
        }
      }
    })
  }


  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:func.isEmpty(flag)?true:flag});
  }


  getInitSubTable = ()=> { // 选择所属机构和客户时初始化子表
    this.setState({
      dataSource: [{'key': 1, rowKey: Math.random()}]
    })
  }

  handleSubmit = () => {
    const { dispatch } = this.props;
    dispatch(UPDATESTATE({ submitLoading: true }));
    this.submitAction()
  //  this.childEditTable.childMethod(); // 调用子表校验的方法
  };

  submitAction = (checkError) => {
    const {dataSource} = this.state;
    const { dispatch, form } = this.props;
    if (checkError) {
      dispatch(UPDATESTATE({ submitLoading: false }))
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if(dataSource.length<1){
        message.error('子表至少有一条数据');
        dispatch(UPDATESTATE({ submitLoading: false }));
        return
      }
      if (!err) {
        const params = {
          ...values,
          beginValiddate: func.format(values.beginValiddate),
          endValiddate: func.format(values.endValiddate),
        }
        if (values.beginValiddate > values.endValiddate) {
          message.error('有效结束时间不能早于开始时间');
          dispatch(UPDATESTATE({ submitLoading: false }));
          return
        }
        /**
         * 判断合同号是否包括特殊字符
         */
        if(values.contractno.includes("&") || values.contractno.includes("^")){
          message.error('合同号不允许包括&或则^字符');
          dispatch(UPDATESTATE({ submitLoading: false }));
          return
        }
        params.sublist = dataSource
        if (func.notEmpty(params)) {
          dispatch(COMMONBUSINESS_SUBMIT({'tableName': 'shashi_dinas_contract','modulename':'byMoney',submitParams:params,btnCode:'edit'}));
        }else {
          dispatch(UPDATESTATE({ submitLoading: false }))
        }
      }else{
        dispatch(UPDATESTATE({ submitLoading: false }))
      }
    });
  }



  getMainItemValue = (needWarn) => {
    const checkObj = {
      deptId: '所属机构',
      custno: '客户',
      contractTypeSave: '合同类型',
      discountType: '优惠方式',
      beginValiddate: '有效开始日期',
      endValiddate: '有效结束日期',
    };
    const {form} = this.props;
    const deptId=form.getFieldValue("deptId"); // 机构
    if(deptId===null || deptId.length===0 || deptId===""){
      return false;
    }
    const custno=form.getFieldValue("custno");  // 客户
    let contractTypeSave=form.getFieldValue("contractTypeSave");  // 合同类型
    let discountType=form.getFieldValue("discountType");  // 优惠方式
    const beginValiddate=func.format(form.getFieldValue("beginValiddate"));  // 有效开始日期
    const endValiddate=func.format(form.getFieldValue("endValiddate"));  // 有效结束日期
    if(contractTypeSave===undefined|| contractTypeSave==="undefined" || contractTypeSave===""|| contractTypeSave===null){
      contractTypeSave="0";
    }
    if(discountType===undefined|| discountType==="undefined" || discountType===""|| discountType===null){
      discountType="0";
    }
    const resObj = {
      deptId,
      custno,
      contractTypeSave,
      discountType,
      beginValiddate,
      endValiddate
    };
    for (let [k, v] of Object.entries(resObj)) {
      if (!v) {
        needWarn && message.warn(`请先选择${checkObj[k]}`)
        return false;
      }
    }
    return {
      deptId,
      custno,
      contractTypeSave,
      discountType,
      beginValiddate,
      endValiddate
    }
  }

  subTableChange = (form1, currentKey, type) => {
    const { dataSource } = this.state;
    if (type === 'input' && (!currentKey || (currentKey !== 'totalMoney' && currentKey !== 'totalAmount' && currentKey !== 'actualSubMoney'))) {return};
    const mainValueObj = this.getMainItemValue(true);
    if (!mainValueObj) {return};
    if(typeof form1.getFieldsValue === 'function'){
      const materialno=form1.getFieldValue("materialno");
      let totalAmount=form1.getFieldValue("totalAmount");
      let totalMoney=form1.getFieldValue("totalMoney");
      let price =form1.getFieldValue("price");
      let rebatePrice =form1.getFieldValue("rebatePrice");
      let actualSubMoney=form1.getFieldValue("actualSubMoney");
      let discountNm=form1.getFieldValue("discountNm");
      let discountPrice=form1.getFieldValue("discountPrice");
      if(totalAmount===undefined|| totalAmount==="undefined" || totalAmount===""|| totalAmount===null){
        totalAmount=0;
      }
      if(totalMoney===undefined|| totalMoney==="undefined" || totalMoney===""|| totalMoney===null){
        totalMoney=0;
      }
      if(price===undefined|| price==="undefined" || price===""|| price===null){
        price=0;
      }
      if(rebatePrice===undefined|| rebatePrice==="undefined" || rebatePrice===""|| rebatePrice===null){
        rebatePrice=0;
      }
      if(actualSubMoney===undefined|| actualSubMoney==="undefined" || actualSubMoney===""|| actualSubMoney===null){
        actualSubMoney=0;
      }
      if(discountPrice===undefined|| discountPrice==="undefined" || discountPrice===""|| discountPrice===null){
        discountPrice=0;
      }
      const totalNumFlag=this.isContractNumber(totalAmount);
      const moneyNumFlag=this.isContractNumber(totalMoney);
      const priceNumFlag=this.isContractNumber(price);
      const rebatePriceFlag=this.isContractNumber(rebatePrice);
      const actualSubMoneyFlag=this.isContractNumber(actualSubMoney);
      const discountPriceFlag=this.isContractNumber(discountPrice);
      if(materialno===undefined|| materialno==="undefined" || materialno==="" || materialno===null){return} ;
      if(discountNm===undefined|| discountNm==="undefined"){
        discountNm="";
      } ;
      if(!totalNumFlag) {return};
      if(!moneyNumFlag) {return};
      if(!actualSubMoneyFlag) {return};
      if(!priceNumFlag) {price=0;};
      if(!rebatePriceFlag) {rebatePrice=0;};
      if(!discountPriceFlag) {discountPrice=0;};
      const { tenantId } = getCurrentUser();
      const params = {
        tenantId,
        ...mainValueObj,
        sublist: [{
          materialno,
          discountNm,
          totalAmount,
          totalMoney,
          price,
          rebatePrice,
          actualSubMoney,
          discountPrice
        }]
      };
      queryDiscountPrice({'tableName': 'shashi_dinas_contract','modulename':'byMoney',btnCode: 'bringPrice',queryParam:params}).then((resp) => {
        if(resp.success && resp.data && resp.data.data.length) {
          const aa = resp.data
          form1.setFieldsValue({ 'price': aa.data[0]?.price || 0 })
          form1.setFieldsValue({ 'rebatePrice': aa.data[0]?.rebatePrice || 0 })
          form1.setFieldsValue({ 'discountPrice': aa.data[0]?.discountPrice || 0 })

        /*  if (currentKey === 'totalMoney' || currentKey === 'totalAmount' || currentKey === 'actualSubMoney') {
            const newData = cloneDeep(dataSource);
            const idx = dataSource.findIndex(item => item.materialno === materialno)
            newData.splice(idx, 1, {
              ...dataSource[idx],
              price: resp.data[0]?.price || '0',
              rebatePrice: resp.data[0]?.rebatePrice || '0',
              discountPrice: resp.data[0]?.discountPrice || '0'
            });
            this.setState({ dataSource: newData });
          } */
        }else{
          form1.setFieldsValue({ 'price': '0' })
          form1.setFieldsValue({ 'rebatePrice': '0'})
          form1.setFieldsValue({ 'discountPrice': '0'})
        }
      })
        /* .catch((resp) => {
        message.warning(resp?.msg||'系统异常')
      }) */

    }
  }

  mainTableChange = (currentVal)=> {
    const { form } = this.props;
    const { dataSource, totalSubColums = [], totalColums, discountTypeObj } = this.state;
    debugger
    if (currentVal === 'discountType' || currentVal === 'contractTypeSave') {
      let newSubColums = cloneDeep(totalSubColums);
      let newColums = cloneDeep(totalColums);
      const discountTypeValue = form.getFieldValue("discountType") || discountTypeObj.toString();
      const contractTypeSaveValue = form.getFieldValue("contractTypeSave")
      if (contractTypeSaveValue === '0' || form.getFieldValue("contractTypeSave") === '4') {
        newColums = totalColums.filter(item => item.columnName !== 'discountType');
        newSubColums = totalSubColums.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice'&& item.columnName !== 'discountNm')
      }
      if (contractTypeSaveValue === '1') {
        if (discountTypeValue === '0') {
          newSubColums = totalSubColums.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice'&& item.columnName !== 'discountNm')
        } else if (discountTypeValue === '1') {
          newSubColums = totalSubColums.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountNm')
        } else if (discountTypeValue === '2') {
          newSubColums = totalSubColums.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice')
        }
      }
      if (contractTypeSaveValue === '2') {
        if (discountTypeValue === '0') {
          newSubColums = totalSubColums.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice'&& item.columnName !== 'discountNm')
        } else if (discountTypeValue === '1') {
          newSubColums = totalSubColums.filter(item => item.columnName !== 'discountPrice' && item.columnName !== 'discountNm')
        } else if (discountTypeValue === '2') {
          newSubColums = totalSubColums.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice')
        }
      }
      this.setState({ showSubColums: newSubColums, showColums: newColums });
    }
    const mainValueObj = this.getMainItemValue();
    if (!mainValueObj) return;
    if(dataSource.length<1) { return; }
    const params = {
      ...mainValueObj,
      sublist: dataSource.map(item => {
        return {
          'materialno': item.materialno,
          'discountNm':item.discountNm,
          'totalAmount': item.totalAmount,
          'totalMoney': item.totalMoney,
          'actualSubMoney': item.actualSubMoney,
          'price': item.price,
          'rebatePrice': item.rebatePrice,
          'discountPrice':item.discountPrice
        }
      })
    }
    queryDiscountPrice({'tableName': 'shashi_dinas_contract','modulename':'byMoney',btnCode: 'bringPrice',queryParam:params}).then((resp) => {
      if(resp.success && resp.data && resp.data.data.length) {
        const aa = resp.data
        const resData = aa.data.map(item => {
          return { ...item, rowKey: Math.random()}
        })
        this.setState({ dataSource: resData });
      }
    }).catch((resp) => {
      message.warning(resp?.msg||'系统异常')
    })
  }

  isContractNumber = (val)=>{
    const regPos = /^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$/;
    if(regPos.test(val)){
      return true;
    }else {
      return false;
    }
  }

  render() {
    const {
      commonBusiness: { detail,submitLoading},
      loading,
      form,
    } = this.props;

    const {dataSource,showColums,showSubColums} = this.state;
    const methods = {
      deptId:{
        onChange:this.mainTableChange
      },
      custno:{
        onSelect:this.mainTableChange
      },
      contractTypeSave: {
        onSelect:() => this.mainTableChange('contractTypeSave')
      },
      discountType: {
        onSelect:() => this.mainTableChange('discountType')
      },
      beginValiddate: {
        onChange:this.mainTableChange
      },
      endValiddate: {
        onChange:this.mainTableChange
      },
    }
    const methodsSub = {
      totalMoney:{
        onChange:(form1)=>this.subTableChange(form1, 'totalMoney', 'input')
      },
      materialno:{
        onSelect:(form1)=>this.subTableChange(form1, 'materialno', 'autoComplete')
      }
    }
    const iteams=getEditConf(showColums,form,detail,methods,8);
    // const columns = getAddOrEditColumnChanage(showSubColums,{onChange:(form1, currentKey) =>this.subTableChange(form1, currentKey, 'autoComplete'), onBlur:(form1, currentKey) =>this.subTableChange(form1, currentKey, 'input'),onSelect:(form1, currentKey) =>this.subTableChange(form1, currentKey, 'select')})
    const backUrl = '/commonBusiness/commonList/shashi_dinas_contract/byMoney'
    // console.log(showSubColums,dataSource)
    return (

      <div>

        <MobileSubEdit
          NavBarTitle="修改"
          title="子项"
          columns={showColums}
          subcolumns={showSubColums.filter(ii=>ii.updateShowFlag === 1)}
          iteams={iteams}
          dataSource={dataSource}
          form={form}
          subMethod={this.handleSubmit}
          backRouter={backUrl}
          onReturnData={this.onReturnData}
          submitLoading={submitLoading}
          methodsSub={methodsSub}
        />
        <span style={{display:'none'}}>
          <MatrixInput id="id" initialValue={detail.id} form={form} />
        <MatrixInput id="contractSource" initialValue={detail.contractSource} form={form} />
        <MatrixInput id="unit" initialValue={detail.unit} form={form} />
        </span>
      </div>
    );
  }
}

export default SaleContractEdit;
