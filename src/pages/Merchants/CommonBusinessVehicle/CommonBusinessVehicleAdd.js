import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form } from 'antd/lib/index';
import { Toast} from 'antd-mobile';
import func from '@/utils/Func';
import { getAddConf } from '@/components/Matrix/MatrixAddConfig';
import {addSaveCommon } from '@/pages/Merchants/commontable';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { submitVehicle } from '@/services/commonBusiness';
import router from 'umi/router';
import MobileSubEdit from '@/components/MobileSubEdit';


@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class CommonBusinessVehicleAdd extends PureComponent {

  state = {
    dataSource: [],
    showColums: [],
    showSubColums: [],
    ziSaveFlag: true,
    tableTitle:'',
    loading: false,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({
      tableName: 'saas_truckinfo',
      'modulename': 'manage',
      queryType: 1,
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
    this.setState({ dataSource, ziSaveFlag: flag });
  };



  // 提交按钮事件
  handleSubmit = e => {
    const { dataSource, ziSaveFlag, showColums, showSubColums,loading } = this.state;
    e.preventDefault();
    if (loading) {
      return;
    }
    const { form } = this.props;
    const params = addSaveCommon('add', form, dataSource, ziSaveFlag, showColums, showSubColums);
    this.setState({
      loading: true,
    });
    if (func.notEmpty(params)) {
      submitVehicle(params).then(resp => {
        this.setState({
          loading: false,
        });
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
    const {showColums,showSubColums,dataSource,tableTitle} = this.state;
    const iteams=getAddConf(showColums,form);

    return (
      <div>
        <MobileSubEdit
          NavBarTitle={`新增${tableTitle}`}
          title={tableTitle}
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

export default CommonBusinessVehicleAdd;

