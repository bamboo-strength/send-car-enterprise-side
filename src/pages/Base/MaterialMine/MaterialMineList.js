import React,{ PureComponent } from 'react';
import { Form} from 'antd/lib/index';
import { connect } from 'dva/index';
import router from 'umi/router';
import { List } from 'antd-mobile';
import { MATERIALMINE_LIST} from '../../../actions/materialMine'
import MatrixAutoComplete from '../../../components/Matrix/MatrixAutoComplete';
import MatrixListView from '../../../components/Matrix/MatrixListView';

@connect(({ materialMine,loading }) =>({
  materialMine,
  loading:loading.models.materialMine,
}))
@Form.create()
class MaterialMineList extends PureComponent{


  constructor(props) {
    super(props);
    this.state = {
      params: {},
    }
  }

  getData = (params)=> {
    const { dispatch } = this.props;
    this.setState({ params });
    const rparams = params
    delete rparams.minecodeName;
    delete rparams.materialnoName;
    delete rparams.specName;
    delete rparams.headers
    dispatch(MATERIALMINE_LIST(params))
  }

// ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    return (
      <List style={{fontSize:'15px'}}>
        <MatrixAutoComplete label='物资' placeholder='拼音码检索' dataType='goods' id='materialno' labelId='materialnoName' form={form} style={{width: '100%'}} />
        <MatrixAutoComplete label='矿点' placeholder='拼音码检索' dataType='minecode' id='minecode' labelId='minecodeName' form={form} style={{width: '100%'}} />
        <MatrixAutoComplete label='规格' placeholder='拼音码检索' dataType='spec' id='spec' labelId='specName' form={form} style={{width: '100%'}} />
      </List>
    );
  };

  handleBtnCallBack = params => {
    const { btn } = params;
    if (btn.code === 'OrderBook') {
        router.push(`/MaterialMine/OrderBook/`);
    }
  }

  render(){
    const code='materialMine';
    const{form,materialMine:{ data }, } = this.props;

    const rows = [
      {
        key: '物资',
        value: 'materialnoName',
      },
      {
        key: '矿点',
        value: 'mineralName',
      },
      {
        key: '规格',
        value: 'specName',
      },
      {
        key: '计划日期车数',
        value: 'materialDetail',
      },
    ];

    return (
      <MatrixListView
        data={data}
        navName='物资计划查询'
        rows={rows}
        form={form}
        code={code}
        renderSearchForm={this.renderSearchForm}
        getDataFromPa={this.getData}
        btnCallBack={this.handleBtnCallBack}
        notAdd
      />
    );
  }
}
export  default MaterialMineList;
