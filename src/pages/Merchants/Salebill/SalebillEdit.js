import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { Form} from 'antd/lib/index';
import { SALEBILL_DETAIL,SALEBILL_SUBMIT } from '@/actions/salebill';
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import MobileSubEdit from '../../../components/MobileSubEdit';
import { addSaveCommon} from "../commontable";
import { clientId } from '../../../defaultSettings';

@connect(({ salebill, loading }) => ({
  salebill,
  loading: loading.models.salebill,
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
}))
@Form.create()
class SalebillEdit extends PureComponent {

  state = {
    showColums: [],
    showSubColums:[],
    dataSource:[],
    ziSaveFlag:true
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(SALEBILL_DETAIL(id)).then(()=>{
        const {
          salebill: { detail },
        } = this.props;
        const newArr = detail.sublist.map((v,index)=>{    // 添加行号
          return {...v,'key':index+1}
        })
        this.setState({
          dataSource: newArr
        })
      }
    );


    dispatch(TABLEEXTEND_COLUMNLIST({tableName:'mer_salebill','modulename':`salebill_${clientId}`,queryType:2})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(data.columList!==null && data.columList!==undefined){
          const aa=data.columList;
          this.setState({
            showColums: aa.table_main,
            showSubColums: aa.table_sub
          })
        }
      }
    })
  }

//  提交按钮事件
  handleSubmit = e => {
    const {dataSource,ziSaveFlag,showColums,showSubColums} = this.state
    e.preventDefault();
    const { form ,dispatch, salebill: { detail }, } = this.props;
    const  params = addSaveCommon(detail.id,form,dataSource,ziSaveFlag,showColums,showSubColums)
    if(func.notEmpty(params)){
      params.isplan = 0
      params.menuCode='订单'
      params.functionCode='订单修改'
      dispatch(SALEBILL_SUBMIT(params));
    }
  }

  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:func.isEmpty(flag)?true:flag});
  }

  render() {
    const {
      form,
      salebill: { detail },
    } = this.props;

    const {showColums,showSubColums,dataSource} = this.state;

    const iteams=getEditConf(showColums,form,detail);

    return (
      <div>
          <MobileSubEdit
            NavBarTitle="修改订单"
            title="项次信息"
            columns={showColums}
            subcolumns={showSubColums}
            iteams={iteams}
            needAdd
            dataSource={dataSource}
            form={form}
            subMethod={this.handleSubmit}
            backRouter='/salebill/salebill'
            onReturnData={this.onReturnData}
          />
      </div>
    );
  }
}
export default SalebillEdit;
