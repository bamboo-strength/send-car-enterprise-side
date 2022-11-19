
import React,{ PureComponent } from 'react';
import { Form} from 'antd';
import { connect } from 'dva';
import { MINERAL_LIST} from '../../../actions/mineral'
import MatrixListView from '@/components/Matrix/MatrixListView';
import { InputItem, List } from 'antd-mobile';

const  FormItem = Form.Item;

@connect(({ mineral,loading }) =>({
  mineral,
  loading:loading.models.mineral,
}))
@Form.create()
class Mineral extends PureComponent{



  getData = params => {
    const { dispatch } = this.props;

    dispatch(MINERAL_LIST(params));
  };



  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldProps } = form;
    return (
      <List style={{fontSize:'15px'}} className='static-list'>
        <InputItem
          {...getFieldProps('minecode')}
          clear
          placeholder="请输入矿点"
          style={{fontSize:'15px'}}
        >矿点：
        </InputItem>
      </List>
    );
  };



  render(){
    const code='mineral';
    const{form,mineral:{ data }} = this.props;
    const rows = [
      {
        key: 'ID',
        value: 'id',
      },
      {
        key: '矿点',
        value: 'minecode',
      },
      {
        key: '拼音码',
        value: 'sortl',
      },
      {
        key: '创建人',
        value: 'createUserName',
      },
      {
        key: '创建时间',
        value: 'createTime',
      },
    ];


    return (
        <MatrixListView
          data={data}
          navName='矿点信息'
          rows={rows}
          form={form}
          code={code}
          renderSearchForm={this.renderSearchForm}
          getDataFromPa={this.getData}
          addPath="/base/mineral/add"
        />
    );
  }
}
export  default Mineral;
