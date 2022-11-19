import React, { PureComponent } from 'react';
import { Form,Card, Button, message } from 'antd';
import { connect } from 'dva';
import { cloneDeep } from 'lodash';
import { COMMONBUSINESS_SUBMIT, UPDATESTATE } from '../../../actions/commonBusiness';
import {getAddConf} from '@/components/Matrix/MatrixAddConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import {queryDiscountPrice} from '../../../services/shashiServices';
import func from '@/utils/Func';
import { getCurrentUser } from '../../../utils/authority';
import MatrixInput from '../../../components/Matrix/MatrixInput';
import MobileSubEdit from '../../../components/MobileSubEdit';

@connect(({ commonBusiness, loading }) => ({
  commonBusiness,
  submitting: loading.effects['commonBusiness/submit'],
}))
@connect(({ tableExtend }) => ({
  tableExtend
}))


@Form.create()

class SaleContractAdd extends PureComponent {

  state = {
    dataSource : [],
    showColums: [],
    totalColums: [],
    showSubColums:[],
    totalSubColums: [],
    discountTypeObj: {},
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({'tableName': 'shashi_dinas_contract','modulename':'byMoney',queryType:1})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(func.notEmpty(data.columList)){
          const aa=data.columList;
          let contractTypeSaveObj = {};
          let discountTypeObj = {};
          let newSubColums = cloneDeep(aa.table_sub);
          let newColums = cloneDeep(aa.table_main);
          aa.table_main.forEach(item => {
            if (item.columnName === 'contractTypeSave') {
              contractTypeSaveObj = {initialvalue: item.initialvalue}
            }
            if (item.columnName === 'discountType') {
              discountTypeObj = {initialvalue: item.initialvalue}
            }
          });
          if (contractTypeSaveObj.initialvalue === '0' || contractTypeSaveObj.initialvalue === '4') {
            newColums = aa.table_main.filter(item => item.columnName !== 'discountType');
            newSubColums = aa.table_sub.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice'&& item.columnName !== 'discountNm')
          }
          if (contractTypeSaveObj.initialvalue === '1') {
            if (discountTypeObj.initialvalue === '0') {
              newSubColums = aa.table_sub.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice'&& item.columnName !== 'discountNm')
            } else if (discountTypeObj.initialvalue === '1') {
              newSubColums = aa.table_sub.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountNm')
            } else if (discountTypeObj.initialvalue === '2') {
              newSubColums = aa.table_sub.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice')
            }
          }
          if (contractTypeSaveObj.initialvalue === '2') {
            if (discountTypeObj.initialvalue === '0') {
              newSubColums = aa.table_sub.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice'&& item.columnName !== 'discountNm')
            } else if (discountTypeObj.initialvalue === '1') {
              newSubColums = aa.table_sub.filter(item => item.columnName !== 'discountPrice' && item.columnName !== 'discountNm')
            } else if (discountTypeObj.initialvalue === '2') {
              newSubColums = aa.table_sub.filter(item => item.columnName !== 'rebatePrice' && item.columnName !== 'discountPrice')
            }
          }
          this.setState({
            showColums: newColums,
            totalColums: aa.table_main,
            showSubColums: newSubColums,
            totalSubColums: aa.table_sub,
            discountTypeObj,

          })
        }
      }
    })
  }

  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:flag});
  }

  handleSubmit = () => {
    const { dispatch } = this.props;
    dispatch(UPDATESTATE({ submitLoading: true }))
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
      // if(dataSource.length<1){
      //   message.error('子表至少有一条数据');
      //   dispatch(UPDATESTATE({ submitLoading: false }))
      //   return
      // }
      if (!err) {

        const params = {
          ...values,
          beginValiddate: func.format(values.beginValiddate),
          endValiddate: func.format(values.endValiddate),
        }
        if (params.list < 1){
          message.error('子表至少有一条数据');
          dispatch(UPDATESTATE({ submitLoading: false }))
          return
        }
        if (values.beginValiddate > values.endValiddate) {
          message.error('有效结束时间不能早于开始时间');
          dispatch(UPDATESTATE({ submitLoading: false }))
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
        params.sublist = values.list;
        delete params.list
        delete params.data
        if (func.notEmpty(params)) {
          dispatch(COMMONBUSINESS_SUBMIT({'tableName': 'shashi_dinas_contract','modulename':'byMoney',submitParams:params,btnCode:'add'}))
        }else{
          dispatch(UPDATESTATE({ submitLoading: false }));
        }
      } else {
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
    if(deptId===undefined ||deptId===null || deptId.length===0 || deptId===""){
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
    for (const [k, v] of Object.entries(resObj)) {
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

  subTableChange = (form1, currentKey, type,index) => {
    if (type === 'input' && (!currentKey || (currentKey !== 'totalMoney' && currentKey !== 'totalAmount' && currentKey !== 'actualSubMoney'))) {return};
    const mainValueObj = this.getMainItemValue(true);
    if (!mainValueObj) {return}
    if(typeof form1.getFieldsValue === 'function'){
      const {list} = form1.getFieldsValue()
      const {materialno} = list[index];
      // const materialno=form1.getFieldsValue('list');
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
      if(materialno===undefined|| materialno==="undefined" || materialno==="" || materialno===null){return}
      if(discountNm===undefined|| discountNm==="undefined"){
        discountNm="";
      }
      if(!totalNumFlag) {return}
      if(!moneyNumFlag) {return}
      if(!actualSubMoneyFlag) {return}
      if(!priceNumFlag) {price=0;}
      if(!rebatePriceFlag) {rebatePrice=0;}
      if(!discountPriceFlag) {discountPrice=0;}
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
        if (resp.success && resp.data && resp.data.data.length) {
          const aa = resp.data;
          form1.setFieldsValue({ 'price': aa.data[0]?.price || 0 });
          form1.setFieldsValue({ 'rebatePrice': aa.data[0]?.rebatePrice || 0 });
          form1.setFieldsValue({ 'discountPrice': aa.data[0]?.discountPrice || 0 });
          if (currentKey === 'totalMoney' || currentKey === 'totalAmount' || currentKey === 'actualSubMoney') {
            //
          }
        } else {
          form1.setFieldsValue({ 'price': '0' });
          form1.setFieldsValue({ 'rebatePrice': '0' });
          form1.setFieldsValue({ 'discountPrice': '0' });
        }
      }).catch((resp) => {
        message.warning(resp?.msg||'系统异常');
      })

    }
  }

  mainTableChange = (currentVal)=> {
    const { form } = this.props;
    const { dataSource, totalSubColums = [], totalColums, discountTypeObj } = this.state;
    if (currentVal === 'discountType' || currentVal === 'contractTypeSave') {
      let newSubColums = cloneDeep(totalSubColums);
      let newColums = cloneDeep(totalColums);
      const discountTypeValue = form.getFieldValue("discountType") || discountTypeObj.initialvalue;
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
    if (!mainValueObj) { return; }
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
    })
      /* .catch((resp) => {
      message.warning(resp?.msg||'系统异常')
    }) */
  }

  isContractNumber = (val)=>{
    const regPos = /^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$/;
    if(regPos.test(val)){
      return true;
    }
      return false;

  }

  onUpdataData = (dataSource,flag, index, currentKey) => {
    if (currentKey === 'materialno') {
      this.setState({ dataSource });
    }
  }

  render() {
    const {
      form,
      commonBusiness: { submitLoading }
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
        // onChange:(form1)=>this.subTableChange(form1, 'totalMoney', 'autoComplete')

        onChange:(form1,e,index)=>this.subTableChange(form1, 'totalMoney', 'autoComplete',index)
      },
      materialno:{
        // onSelect:(form1)=>this.subTableChange(form1, 'materialno', 'autoComplete')

        onSelect:(form1,e,o,data,index)=>this.subTableChange(form1, 'materialno', 'autoComplete',index)
      }
    }
    const iteams=getAddConf(showColums,form,methods,8);
  //  const columns = getAddOrEditColumnChanage(showSubColums,{onChange:(form1, currentKey) =>this.subTableChange(form1, currentKey, 'autoComplete'), onBlur:(form1, currentKey) =>this.subTableChange(form1, currentKey, 'input'),onSelect:(form1, currentKey) =>this.subTableChange(form1, currentKey, 'select')})
    const backUrl = '/commonBusiness/commonList/shashi_dinas_contract/byMoney'
    return (
      <div>
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
        />
        <span style={{display:'none'}}>
          <MatrixInput id="contractSource" initialValue={0} form={form}  />
          <MatrixInput id="unit" initialValue={0} form={form}  />
        </span>
      </div>
    );
  }
}

export default SaleContractAdd;
