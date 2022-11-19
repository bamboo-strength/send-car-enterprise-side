import { Button, Flex, List, Modal, NavBar } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Form, Icon, } from 'antd';
import { COMMONBUSINESS_LIST } from '@/actions/commonBusiness';
import styles from '@/layouts/Sword.less';
import style from '@/components/ListCompontents/index.less';
import u27 from '@/components/ListCompontents/image/u27.png';
import u28 from '@/components/ListCompontents/image/u28.png';
import Text from 'antd/lib/typography/Text';
import inStyle from '@/pages/PageMould/IndexDataList.less';
import CardWrap from '@/components/CardWrap';
import Func from '@/utils/Func';
import { getQueryConf } from '../../../components/Matrix/MatrixQueryConfig';


@connect(({ commonBusiness, tableExtend, loading }) => ({
  commonBusiness,
  tableExtend,
  loading: loading.models.commonBusiness,
}))

@Form.create()
class ShipmentDataSum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      tableName: 'shashi_delivery_detail',
      modulename: 'materialName',
      object: {},
      backUrl: '',
      showSearchModal:false,
      tableCondition:[],
      queryData:{},
      selectData:''
    };
  }


  componentDidMount() {
    const { location, } = this.props;
    let pp ={}
    if(location.state){
      pp = location.state;
    }else {
      pp = JSON.parse(localStorage.getItem('shipmentParams'))
    }
    const { object, backUrl, tableCondition,queryParams,selectData} = pp
    const condation = tableCondition.filter(item=>item.columnName !== 'deptId')
    this.setState({
      tableCondition:condation,
      object,
      backUrl,
      selectData
    },()=>{
      const params = {
        endDate: queryParams.endDate,
        startDate: queryParams.startDate,
      };
      this.getDataFromBack(params)
    })
  }

  componentWillUnmount() {
    //  localStorage.removeItem('shipmentParams')
  }

  toWeightInfo = (obj) => { // 跳转道检斤明细
    const {queryData,selectData,object,tableCondition} = this.state
    const {location} = this.props
    const paramToLocation = {
      grosstime_lt: queryData.endDate,
      grosstime_gt: queryData.startDate,
      deptId: object.deptId,
      materialno: obj.materialno,
      // custno:obj.custno
    };
    const shipdataSum = {
      paramToLocation,
      object,
      queryParams:queryData,
      materialName:obj.materialName,
      tableCondition,
      backUrl: `/shashi/shipmentDataSum/shipmentDataSum/${object.id}`,
      selectData
    }
    const localStorageParam = {...shipdataSum,backUrl: location.state?location.state.backUrl:'/shashi/shipmentDataSum/shipmentDataSumList',}
    localStorage.setItem('shipmentParams',JSON.stringify(localStorageParam));
    router.push({
      pathname: `/shashi/weight/weighing`,
      state: shipdataSum,
    });
  };

  getDataFromBack=(params)=>{
    const { dispatch, } = this.props;
    const { tableName, modulename,object ,} = this.state;
    params.deptId = object.deptId
    // console.log(params,typeof params.startDate,'====')
    if(typeof params.startDate ==='object'){
      params.startDate = Func.format(params.startDate)
      params.endDate = Func.format(params.endDate)
    }
    dispatch(COMMONBUSINESS_LIST({ tableName, modulename, queryParam: params })).then(() => {
      const {
        commonBusiness: { data },
      } = this.props;
      if (data !== undefined) {
        const tempdata = data.list;
        this.setState({
          dataSource: tempdata,
          queryData:params
        });
      }
    });
  }

  query=()=>{
    const {form} = this.props
    form.validateFieldsAndScroll((err, values) => {
      const payload = {
        ...values,
      };
      if (!err) {
        this.getDataFromBack(payload)
      }
    });
    this.onClose()
  }

  onSelect = (e,name) =>{
    const params = {
      endDate: e.ends,
      startDate: e.starts,
    };
    this.setState({
      selectData:name
    })
    this.getDataFromBack(params)
  }

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

  renderSearchForm = (tableCondition) => {
    const { form } = this.props;
    const queryItem = getQueryConf(tableCondition,form,{},9)
    // setTimeout(console.log(form.getFieldsValue()), 10000);
    return (
      <div style={{minHeight:'260px'}}>
        {queryItem}
      </div>
    );
  }

  reset = () => {
    const {form} = this.props
    form.resetFields()
    this.query()
  };

  render() {
    const { dataSource, object, selectData, backUrl,showSearchModal,tableCondition} = this.state;
    const carsum = Func.sumData(dataSource,'carsum')
    const netweightsum = Func.sumData(dataSource,'netweightsum')
    const {location} = this.props
    const obj = {carsum,netweightsum,deptName:object.deptName}
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(backUrl || '/dashboard/menu')}
          rightContent={[
            <Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.showSearch()} />,
          ]}
        >{object.deptName}
        </NavBar>
        <div className='am-list'>
          <CardWrap obj={obj} onSelect={this.onSelect} defaultValue={location.state?location.state.selectData:selectData} />
          <List
            renderHeader={
              <div className={inStyle.renderHeader}>
                <div>
                  <span className={inStyle.bussName}>发运物资({dataSource.length})</span>
                </div>
              </div>}
            className={`my-list ${inStyle.myList}`}
          >
            {
              dataSource.map(item => {
                const list = [
                  { bg: '#edfff8', img: u27, label: '发运车数', text: item.carsum },
                  { bg: '#f1f8fd', img: u28, label: '发运量(吨)', text: item.netweightsum },
                  //  { bg: '#f1f8fd', img: u28, label: '客户', text: item.custName },
                ];
                return (
                  <Card
                    title={item.materialName}
                    bordered={false}
                    size="small"
                    className={style.dataCard}
                    extra={<div><Text style={{ fontSize: 12 }}>查看发运详情</Text><Icon type="right" /></div>}
                    onClick={() => this.toWeightInfo(item)}
                  >
                    {
                      list.map(i => {
                        return (
                          <div className={style.divRound}>
                            <div className={style.imgRound} style={{ background: i.bg }}>
                              <img src={i.img} alt='' style={{ width: '100%' }} />
                            </div>
                            <Flex.Item className={style.flexItem}>
                              <span className={`${styles.tdTitle}`}>{i.label}：</span>
                              {
                                i.label === '客户'?
                                  <Text strong className={style.text} style={{fontSize:'14px'}}>
                                    {i.text}
                                  </Text>:
                                  <Text strong className={style.text}>
                                    {i.text}
                                  </Text>
                              }
                            </Flex.Item>
                          </div>
                        );
                      })
                    }
                  </Card>
                );
              })
            }
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
          {this.renderSearchForm(tableCondition)}
          <div style={{ marginTop: '8px', float: 'right' }}>
            <Button type="primary" size='small' inline onClick={() => this.query()} style={{ marginLeft: '8px' }}>查询</Button>
            <Button type="primary" size='small' inline onClick={() => this.reset()} style={{ marginLeft: '15px' }}>重置</Button>
          </div>
        </Modal>
      </div>
    );
  }


}

export default ShipmentDataSum;
