import { List, InputItem,} from 'antd-mobile';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import {TRUCKINFO_LIST} from '../../../actions/truckinfo'
import MatrixInput from '@/components/Matrix/MatrixInput';
import MatrixSelect from '@/components/Matrix/MatrixSelect';
import MatrixListView from '../../../components/Matrix/MatrixListView';
import { Col } from 'antd';


@connect(({truckinfo,loading}) => ({
  truckinfo,
  loading: loading.models.truckinfo,
}))
@createForm()
class GoodList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  getData = (param)=> {
    const { dispatch } = this.props;
    dispatch(TRUCKINFO_LIST(param))
  }

  renderSearchForm = () => {
    const { form } = this.props;
    return (
      <List style={{fontSize:'15px'}} className='static-list'>
        <Col span={24} className='add-config'>
          <MatrixInput label="车号" xs='8' id="truckno" placeholder="请输入车号查询" form={form} style={{width:'100%'}} />
        </Col>
        <Col span={24} className='add-config'>
          <MatrixSelect label="车轴数" xs='8' id="axles" placeholder="请选择车轴数" form={form} dictCode='axlesName' style={{width:'100%'}} />
        </Col>
      </List>
    )
  }

  render() {
    const { truckinfo: {data},form } = this.props;
    const  rows = [
      {
        key:'车号',
        value:'truckno'
      },
      {
        key:'车轴数',
        value:'axlesName'
      },
      {
        key:'司机姓名',
        value:'drivername'
      },
      {
        key:'司机身份证',
        value:'driveridno'
      },
      {
        key:'司机手机号',
        value:'phone'
      },
    ]

    return (
      <div>
        <MatrixListView
          data={data}
          navName='车辆管理'
          rows={rows}
          form={form}
          code='truckinfo'
          renderSearchForm={this.renderSearchForm}
          getDataFromPa={this.getData}
          addPath="/base/truckinfo/add"
        />
      </div>
    );
  }
}

export default GoodList;
