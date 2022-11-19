import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { Form} from 'antd/lib/index';
import {Toast, } from 'antd-mobile';
import router from 'umi/router';
import { getEditConf } from '@/components/Matrix/MatrixEditConfig';
import { addSaveCommon } from '@/pages/Merchants/commontable';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { submitVehicle,queryVehicleDetail } from '@/services/commonBusiness';
import MobileSubEdit from '@/components/MobileSubEdit';



@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class CommonBusinessVehicleEdit extends PureComponent {

  state = {
    dataSource: [],
    showColums: [],
    showSubColums: [],
    ziSaveFlag: true,
    tableTitle:'',
    detail:[]
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    queryVehicleDetail(id).then(resp => {
      const listData = resp.data;
      this.setState({
        detail:listData
      })
    })
    dispatch(TABLEEXTEND_COLUMNLIST({
      tableName: 'saas_truckinfo',
      'modulename': 'manage',
      queryType: 2,
    })).then(() => {
      const { tableExtend: { data } } = this.props;
      if (data !== undefined) {
        if (data.columList !== null && data.columList !== undefined) {
          const aa = data.columList;
          const tc=aa.table_main[0].tableAlias
          this.setState({
            showColums: aa.table_main,
            showSubColums: aa.table_sub,
            tableTitle:tc
          });
        }
      }
    });
  }

  onReturnData = (dataSource, flag) => {
    this.setState({ dataSource, ziSaveFlag: func.isEmpty(flag) ? true : flag });
  };



  // 提交按钮事件
  handleSubmit = e => {
    const { dataSource, ziSaveFlag, showColums, showSubColums,detail } = this.state;
    e.preventDefault();
    const { form } = this.props;
    const params = addSaveCommon(detail.id, form, dataSource, ziSaveFlag, showColums, showSubColums);
    if (func.notEmpty(params)) {
      params.menuCode='车辆管理'
      params.functionCode='车辆管理修改'
      submitVehicle(params).then(resp => {
        if (resp.success) {
          Toast.info(resp.msg);
          router.push( `/businessVehicle/businessVehicle`);
        }
      });
    }
  };




  render() {
    const {
      form,
    } = this.props;
    const {dataSource, showColums, showSubColums,tableTitle,detail } = this.state;

    const iteams=getEditConf(showColums,form,detail);
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
          backRouter='/businessVehicle/businessVehicle'
          onReturnData={this.onReturnData}
        />
      </div>
    );
  }
}

export default CommonBusinessVehicleEdit;

