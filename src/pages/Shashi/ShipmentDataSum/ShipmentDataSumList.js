import { Button, Flex, List, Modal, NavBar } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Radio , Form, Icon, Row} from 'antd';
import { getGeneral,   } from '@/services/menu';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import func from '@/utils/Func';
import { paramByColumnSetting } from '@/components/Matrix/commonJs';
import Text from 'antd/lib/typography/Text';
import inStyle from '@/pages/PageMould/IndexDataList.less';
import { getQueryConf } from '../../../components/Matrix/MatrixQueryConfig';
import ListCompontents from '@/components/ListCompontents';
import PoPover from '@/components/PoPover';

@connect(({ commonBusiness, tableExtend, loading }) => ({
  commonBusiness,
  tableExtend,
  loading: loading.models.commonBusiness,
}))

@Form.create()
class ShipmentDataSumList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableName:'shashi_delivery_detail',
      moduleName:'deliveryDetail',
      showColums: [],
      tableCondition:[],
      getBusinessList:[],
      queryData: {},
      selectData:''
    };
  }

  componentDidMount() {
    const {tableName,moduleName} = this.state
    const {dispatch} = this.props
    dispatch(TABLEEXTEND_COLUMNLIST({ 'tableName': tableName,'modulename':moduleName,queryType:0})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined && func.notEmpty(data.columList)) {
        const aa=data.columList;
        this.setState({
          showColums: aa.table_main.filter(ii=>ii.listShowFlag === 1),
          tableCondition:aa.table_condition,
        },()=>{
          const queryParam = paramByColumnSetting(aa.table_condition)
          queryParam.current = 1
          queryParam.size = 5
          this.getDatas(queryParam)
        })

      }
    })
  }

  getDatas =(queryParam)=>{
    const {tableName,moduleName} = this.state
    queryParam.current = 1
    queryParam.size = 5
    if(typeof queryParam.startDate ==='object'){
      queryParam.startDate = func.format(queryParam.startDate)
      queryParam.endDate = func.format(queryParam.endDate)
    }
    getGeneral('api/mer-tableextend/commonBusiness/page',{tableName,'modulename':moduleName,'queryParam':queryParam}).then(response=>{
      if (func.notEmpty(response) && response.success) {
        const {resultData,commonBusinessDefineVO,pages} = response.data
        const dd = commonBusinessDefineVO.dataType === 0?pages.records:(func.notEmpty(resultData.records)?typeof resultData.records === 'string'?JSON.parse(resultData.records):resultData.records:[])
        this.setState({
          getBusinessList:dd,
          queryData:queryParam,
        });
      }
    })
  }

  reset = () => {
    const {form} = this.props
    form.resetFields()
    this.query()
  };

  onClickList = (item) => {
    const { queryData,tableCondition,selectData } = this.state;
    const shipmentParams = {
      object: item,
      queryParams: queryData,
      tableCondition,
      backUrl: '/shashi/shipmentDataSum/shipmentDataSumList',
      selectData
    }

    router.push({
      pathname: `/shashi/shipmentDataSum/shipmentDataSum/${item.id}`,
      state: shipmentParams,
    });
  };

  // ************ 查询框
  showSearch = () => {
    this.setState({
      showSearchModal: true,
    });
  };

  onClose = () => {
    this.setState({
      showSearchModal: false,
    });
  };

  aa=(form)=>{
    // const {form} = this.props
    console.log(form.getFieldsValue(),'===')
    form.setFieldsValue({
      startDate:func.moment('2020-10-01 12:00:00')
    })
  }

  renderSearchForm = (tableCondition) => {
    const { form } = this.props;
    const queryItem = getQueryConf(tableCondition,form,{},9)
    return (
      <div style={{minHeight:'260px'}}>
        {queryItem}
        {/* <Row>
          <Radio.Group defaultValue="a" buttonStyle="solid">
            <Radio.Button value="a" onClick={()=>this.aa(form)}>Hangzhou</Radio.Button>
          </Radio.Group>
        </Row> */}
      </div>
    );
  }

  query = () => {
    const { form } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      const values = {
        ...fieldsValue,
      };
      this.getDatas(values);
      this.onClose()
    });
  };

  onSelect = (e,name) =>{
    const params = {
      endDate: e.ends,
      startDate: e.starts,
    };
    this.setState({
      selectData:name
    })
    this.getDatas(params)
  }

  render() {
    const { getBusinessList,showColums,queryData,showSearchModal,tableCondition} = this.state;
    const {location} = this.props
    const backUrl = location.state?location.state.backUrl:'/dashboard/function'
    const condation  =tableCondition.filter(item=>item.columnName !== 'custno' && item.columnName !== 'materialno' && item.columnName !== 'contractno')
    let carsumTotal = 0
    let netweightSumTotal = 0
    JSON.stringify(Array.isArray(getBusinessList)? getBusinessList.map(item=>{
      carsumTotal += Number(item.carsum)
      netweightSumTotal += Number(item.netweightsum)
    }):0)

    return (
      <div >
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(backUrl)}
          rightContent={[
            <Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.showSearch()} />,
          ]}
        >发运数据汇总
        </NavBar>
        <div className="am-list">

          <List
            renderHeader={
              <div className={inStyle.renderHeader}>
                <div>
                  <div className={inStyle.textNum}>
                    <Text>总发运次数：{carsumTotal}</Text>
                    <Text>总发运量（吨）：{netweightSumTotal.toFixed(2)}</Text>
                  </div>
                </div>
                <div style={{color:'black'}}><PoPover onSelect={this.onSelect} /></div>
              </div>}
            className={`my-list ${inStyle.myList}`}
          >
            <ListCompontents
              list={getBusinessList}
              showColums={showColums}
              queryData={queryData}
              onClick={(item) => this.onClickList(item)}
            />

          </List>
        </div>

        <Modal
          visible={showSearchModal}
          transparent
          maskClosable
          onClose={() => this.onClose()}
          popup
          animationType='slide-down'
          platform='android'
        >
          {this.renderSearchForm(condation)}
          <div style={{ marginTop: '8px', float: 'right' }}>
            <Button type="primary" size='small' inline onClick={() => this.query()} style={{ marginLeft: '8px' }}>查询</Button>
            <Button type="primary" size='small' inline onClick={() => this.reset()} style={{ marginLeft: '15px' }}>重置</Button>
          </div>
        </Modal>
      </div>
    );
  }


}

export default ShipmentDataSumList;
