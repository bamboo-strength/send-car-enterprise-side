import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { Form, message } from 'antd/lib/index';
import { COMMONBUSINESS_DETAIL,COMMONBUSINESS_SUBMIT } from '@/actions/commonBusiness';
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import router from 'umi/router';
import { addSaveCommon, getBaseUrl } from '../../Merchants/commontable';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import MobileSubEdit from '../../../components/MobileSubEdit';
import { getToken } from '@/utils/authority';

@connect(({ commonBusiness,tableExtend,customer,loading }) => ({
  commonBusiness,
  tableExtend,
  customer,
  loading: loading.models.commonBusiness,
}))
//  秒杀信息下单
@Form.create()
class SecondKillOrder extends PureComponent {

  state = {
    selectedRows: [],
    dataSource : [],
    showColums: [],
    showSubColums:[],
    ziSaveFlag:true,
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id,tableName,modulename },
      },
    } = this.props;

    dispatch(COMMONBUSINESS_DETAIL({realId:id, tableName,modulename}))

    dispatch(TABLEEXTEND_COLUMNLIST({tableName,modulename,queryType:1})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(func.notEmpty(data.columList)){
          const aa=data.columList;
          this.setState({
            showColums: aa.table_main,
            showSubColums: aa.table_sub,
          })
        }
      }
    })
  }

  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:func.isEmpty(flag)?true:flag});
  }

  onSelectRow = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSubmit = e => {
    const {dataSource,ziSaveFlag,showColums,showSubColums} = this.state;
    e.preventDefault();
    const { form ,dispatch,
      match: {
        params: {id, tableName,modulename, },
      },
      commonBusiness: { detail },
      customer:{
        RegistedInfo,
      },
     } = this.props;
    console.log("detail",detail);
    console.log("RegistedInfo",RegistedInfo);
    /*
    const jsonData={
      "${contractno1}":'',
      "${address1}":"网签合同",
      "${name1}":"山东矩阵软件股份有限公司",
      "${name2}": RegistedInfo.realName,
      "${timeStamp1}":"",
      "${timeStamp2}":""
    }
    const a1={
      "realName": RegistedInfo.realName,
      "cardId":RegistedInfo.cardId,
      "legalPerson":RegistedInfo.legalPerson,
      "certType":"0",
      "phoneNo":RegistedInfo.phoneNo,
      "templateId":'TEM1025026',
      "flag":"ture",
      "contractData":jsonData,

      // "signerId": "10923668"
    }
    */
    const jsonData={
      "${contractno1}":'',
      "${address1}":"网签合同",
      "${name1}":"山东矩阵软件股份有限公司",
      "${name2}": "李景鑫",
      "${timeStamp1}":"",
      "${timeStamp2}":""
    }
    const a1={
      "realName": "李景鑫",
      "cardId":"371312199802036716",
      "legalPerson":"王",
      "certType":"0",
      "phoneNo":"17853318821",
      "templateId":'TEM1025026',
      "flag":"ture",
      "contractData":jsonData,

      // "signerId": "10923668"
    }
    console.log("a1",a1);
    const address = `${getBaseUrl()}/contract-sign/${getToken()}/${JSON.stringify(a1)}`
    // window.location.open=`${address}`
    // window.location.href=address
    /* const  params = addSaveCommon('add',form,dataSource,ziSaveFlag,showColums,showSubColums)
    if(func.notEmpty(params)){
      dispatch(COMMONBUSINESS_SUBMIT({tableName:'shashi_dinas_contract',modulename:'dinasContract',submitParams:params,btnCode:'add'}));
    } */
    message.success('提交成功');

    form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
      };
      router.push({
        pathname: `/commonBusiness/commonPay/${tableName}/${modulename}/withoutID`,
        state: {
          backUrl:`/shashi/secondKillOrder/${tableName}/${modulename}/${id}`,
          payName:'支付保证金',
          detail:values,
          type:'toContract'
        },
      });
    });

  };


  handleOkBefore = (selectedRows) =>{
    const {form} = this.props; const {showSubColums} = this.state
    if(func.notEmpty(selectedRows[0].sublist)) {
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
      match: {
        params: { tableName,modulename, },
      },
      commonBusiness: { detail },
    } = this.props;


    const {dataSource,showColums,showSubColums} = this.state;

    const iteams=getEditConf(showColums,form,detail,{});
    const backUrl = `/commonBusiness/commonList/${tableName}/${modulename}`
    // const column = showColums.filter(item => item.category === 5)
    return (
      <div>
        <MobileSubEdit
          NavBarTitle="秒杀下单"
          title=""
          columns={showColums}
          subcolumns={showSubColums}
          iteams={iteams}
          dataSource={dataSource}
          form={form}
          subMethod={this.handleSubmit}
          backRouter={backUrl}
          onReturnData={this.onReturnData}
        />
      </div>
    );
  }
}
export default SecondKillOrder;

