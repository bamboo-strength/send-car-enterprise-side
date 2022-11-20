import React, { PureComponent } from 'react';
import { Flex, List, Modal } from 'antd-mobile';
import router from 'umi/router';
import QRCode from 'qrcode.react';
import { connect } from 'dva';
import { Col, Icon, Spin } from 'antd';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import { clientId } from '@/defaultSettings';
import { getTenantId } from '../Merchants/commontable';
import { getGeneral, getMobileQuery } from '@/services/menu';
import func from '@/utils/Func';
import { paramByColumnSetting } from '@/components/Matrix/commonJs';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { requestListApi } from '@/services/api';
import IconQrcode from '../../../public/image/qrcode.png';
import IconBgQrCode from '../../../public/image/icon_bg_qrCode.png';
import NoInformation from '../../../public/image/image_Noinformation2.png';
import inStyle from './IndexDataList.less';
import ListCompontents from '@/components/ListCompontents';
import DispatchForShashi from './DispatchForShashi';
import { getRoutes } from '../../utils/authority';
import { IconChangqu } from '@/components/Matrix/image';

const {Item} = List;
@connect(({tableExtend }) => ({
  tableExtend,
}))

class IndexDataList extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      showQRCode:false,
      qrModalContent:{},
      qrCodeInnerContent:'id',
      qrCodeContent:'{"deptName":"所属机构","custName":"客户","vehicleno":"车号","ztext2":"物资"}',
      showColums: [],
      businessSetting: {},
      getBusinessList: {},
      queryData: {},
      tableCondition:[],
    };
  }


  componentDidMount() {
    // const record  = JSON.parse(localStorage.getItem('indexDataRecord'))
    // if(record){
    //   this.getSettingData(record)
    // }else {
    //   const params = {current : 1,size : 5};
    //   params['Blade-DesignatedTenant'] = getTenantId();
    //   params.showType = 2
    //   getMobileQuery(func.parseQuery(params)).then(resp => {
    //     if (resp.success &&  resp.data.length>0) {
    //       localStorage.setItem('indexDataRecord', JSON.stringify(resp.data[0]));
    //       this.getSettingData(resp.data[0])
    //     }else {
    //       this.setState({
    //         getBusinessList:[]
    //       })
    //     }
    //   });
    // }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.interval2);
  }


  getSettingData=(record)=>{
    const { dispatch } = this.props;
    const commonParams = {current : 1,size : 15};
    const {tableName,moduleName} = record
    dispatch(TABLEEXTEND_COLUMNLIST({tableName,'modulename':moduleName,queryType: 0, })).then(() => {
      const { tableExtend: { data } } = this.props;
      if (func.notEmpty(data.columList)) {
        const item = data.columList;
        if (record.isCommonSetting == 0){// 非通用功能
          requestListApi(record.dataUrl, commonParams).then(response => {
            if (func.notEmpty(response)) {
              const dd = response.data.records || []
              this.setState({
                  getBusinessList: dd,
                  businessSetting: record,
                  showColums: item.table_main.filter(ii=>ii.listShowFlag === 1).slice(0, 6),
                }
              );
            }
          });
        }else { // 通用功能数据
          this.getCommonData(record,tableName,moduleName,data.columList)
          const tenantId = getTenantId()
          if(tenantId==='947229' && clientId==='kspt_driver'){ // 瀛洲矿业 东平砂石司机端定时刷新
            const that = this
            that.interval = setInterval(()=>{
              this.getCommonData(record,tableName,moduleName,item)
            },1000 * 60)  // 1分钟刷新一次
          }

        }
      }
    });
  }

  getCommonData =(record,tableName,moduleName,item)=>{
    const queryParam = paramByColumnSetting(item.table_condition)
    queryParam.current = 1
    queryParam.size = 5
    getGeneral(record.dataUrl,{tableName,'modulename':moduleName,'queryParam':queryParam}).then(response=>{
      if (func.notEmpty(response) && response.success) {
        const {resultData,commonBusinessDefineVO,pages} = response.data
        const dd = commonBusinessDefineVO.dataType === 0?pages.records:(func.notEmpty(resultData.records)?typeof resultData.records === 'string'?JSON.parse(resultData.records):resultData.records:[])
        this.setState({
          getBusinessList:dd,
          businessSetting: record,
          showColums: item.table_main && item.table_main.filter(ii=>ii.listShowFlag === 1).slice(0, commonBusinessDefineVO.appListShowNum?commonBusinessDefineVO.appListShowNum:6),
          queryData:queryParam,
          tableCondition:item.table_condition
        });
      }
    })
  }

  showQcode=(item)=>{
    const {businessSetting,} = this.state
    let {qrCodeContent,qrCodeInnerContent} = this.state
    const content = []
    if(businessSetting.remark){
      const qrcontent = businessSetting.remark.split('|')
      qrCodeContent = qrcontent[0]
      if(qrcontent.length > 1){ // 如果为两部分 则|前为二维码展示字段 |后为二维码扫描后显示的字段
        qrCodeInnerContent = qrcontent[1]
      }
    }
    Object.keys(JSON.parse(qrCodeContent)).map(key => {
      content.push({
        name:JSON.parse(qrCodeContent)[key],value:item[key],
      })
    })
    const toAndroidQrData = {
      id:item[qrCodeInnerContent],
      ifClose:item.carflag!==6?0:1,
    }

    toAndroidQrData.content = content
    const tenantId = getTenantId()
    const items = JSON.stringify(toAndroidQrData)
    if(window.__wxjs_environment === 'miniprogram'){ // 微信小程序
      wx.miniProgram.navigateTo({url: `/pages/logs/logs?items=${items}`})
    }else {
      try {
        ScreenBright.setBrightness(items)
        if(tenantId==='947229' && clientId==='kspt_driver'){
          const that = this
          that.interval2 = setInterval(()=>{
            const {getBusinessList} = that.state
            const data = getBusinessList.filter(ii=>ii.id === item.id)
            if(data.length>0){
              toAndroidQrData.ifClose = data[0].carflag!==6?0:1
              ScreenBright.setBrightness(JSON.stringify(toAndroidQrData))
            }else {
              toAndroidQrData.ifClose = 1
              ScreenBright.setBrightness('')
              clearInterval(that.interval2);
            }
          },1000 * 60 *5)  // 5分钟刷新一次
        }

      }catch (e) {
        this.setState({
          showQRCode:true,
          qrModalContent:item,
          qrCodeContent,
          qrCodeInnerContent
        })
      }
    }
  }

  onClose = () => {
    this.setState({
      showQRCode:false
    })
  };

  // 跳转到详情
  toDetail = (singleUrl,item)=>{
    if(singleUrl !== '/'){
      router.push({
        pathname: `${singleUrl}${item.id}`,
        state: {
          backUrl:'/dashboard/menu',
          detail:item
        },
      });
    }
  }

  onClickList = (item) => {
    const { queryData,tableCondition } = this.state;
    router.push({
      pathname: `/shashi/shipmentDataSum/shipmentDataSum/${item.id}`,
      state: {
        object: item,
        queryParams: queryData,
        tableCondition,
        backUrl: '/dashboard/menu',
      },
    });
  };

  goPage = (path) => {
    router.push(path);
  };

  seeMore = (url) =>{
    router.push(
      {
        pathname: url,
        state: {
          backUrl: '/dashboard/menu',
        },
      },
    );
  }

  render() {
    const {showQRCode,showColums, businessSetting, getBusinessList,queryData,qrModalContent,qrCodeContent,qrCodeInnerContent } = this.state;
    const tenantId = getTenantId()
    const ifBusinessListArray = Array.isArray(getBusinessList) && getBusinessList.length === 0
    let indexDefault

    const emptyData = (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '15%'
      }}
      >
        <img src={NoInformation} alt='' style={{ width: '60%', marginBottom: '30px' }} />
        <Text style={{ color: '#1890ff', fontSize: 18 }}>暂无信息展示 ...</Text>
      </div>
    )

    if(!Array.isArray(getBusinessList)){
      indexDefault = (
        <div style={{display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center',paddingTop: '15%'}}>
          <Spin />
        </div>)
    }
    else if(clientId!=='kspt_driver' && (tenantId==='947229' || tenantId==='847975' || tenantId==='187382')){// 东平砂石、瀛洲矿业 发货方;瀛洲矿业收货方 显示发运数据汇总
      const carsumTotal = func.sumData(getBusinessList,'carsum')
      const netweightSumTotal = func.sumData(getBusinessList,'netweightsum')
      const shipperTopMenu = getRoutes().filter(item=> item.path === "/ShippingData")
      const shipperMenu = shipperTopMenu.length>0 && shipperTopMenu[0].routes?shipperTopMenu[0].routes.filter(item=>item.path === "/shashi/shipmentDataSum/shipmentDataSumList"):[]
      indexDefault = (
        <List
          renderHeader={
            shipperMenu.length<1?undefined:
            <div className={inStyle.renderHeader}>
              <div>
                <span className={inStyle.bussName}>{businessSetting.name}</span>
                <div className={inStyle.textNum}>
                  <Text>总发运次数：{carsumTotal}</Text>
                  <Text>总发运量（吨）：{netweightSumTotal}</Text>
                </div>
              </div>
              <a className={inStyle.mored} onClick={() => {this.seeMore(businessSetting.totalUrl)}}>更多<Icon type="right" /></a>
            </div>}
          className={`my-list ${inStyle.myList}`}
        >
          {
            ifBusinessListArray || shipperMenu.length<1 ?
              emptyData:
              <ListCompontents
                list={getBusinessList}
                showColums={showColums}
                businessSetting={businessSetting}
                queryData={queryData}
                onClick={(item) => this.onClickList(item)}
              />
          }
        </List>
      )
    }
    else { // 默认
      indexDefault = (
        <List
          renderHeader={
            !ifBusinessListArray?
              <div style={{display: 'flex',justifyContent: 'space-between',}}><span style={{fontWeight: 'bold',fontSize: '16px'}}>{businessSetting.name}</span>
                <a onClick={() => this.seeMore(businessSetting.totalUrl)}>更多</a>
              </div>:<div />}
          className={`my-list ${inStyle.myList}`}
        >
          {ifBusinessListArray ?
            emptyData :
            getBusinessList.map(item => {
                return (
                  <Item
                    multipleLine
                    className='IconQrcode'
                    platform="android"
                  >
                    {businessSetting.isShowQrcode === 1?<div className='qrcodeBox' onClick={() =>this.showQcode(item,)}><div className='IconQrcodeBox'><img src={IconQrcode} alt='' /></div><Text>查看二维码</Text></div> :undefined}
                    <Flex className='flexForIndex' onClick={() => {this.toDetail(businessSetting.singleUrl,item)}}>
                      {
                        showColums.map((rrow,index) => {
                          return (
                            <div style={{minWidth:'100%'}}>
                              {
                                index === 0 ?
                                  <div
                                    className='itemTitle'
                                    style={{color:'#1890ff',fontWeight:'bold',marginBottom:10,borderBottom: '1px solid #ebebeb',lineHeight:'35px',display: 'flex',alignItems: 'center'}}
                                  > <img src={IconChangqu} alt='' style={{marginRight:5,width:18,height:18}} />
                                    {item[rrow.showname?rrow.showname:rrow.columnName]}
                                  </div>:
                                  <div className='itemText'>
                                    <Col span={7}>{rrow.columnAlias.includes('(')?rrow.columnAlias.split('(')[0]:rrow.columnAlias.trim()}：</Col>
                                    <Col span={17}>
                                      <span style={{color: 'rgba(0, 0, 0, 0.85)'}}>
                                        {item[rrow.showname?rrow.showname:rrow.columnName]}
                                        {rrow.columnAlias.includes('(')?rrow.columnAlias.substring( rrow.columnAlias.indexOf('(')+1 ,rrow.columnAlias.indexOf(')')):''}
                                      </span>
                                    </Col>
                                  </div>
                              }
                            </div>
                          )
                        })
                      }
                    </Flex>
                  </Item>

                );
              }
            )}
        </List>
      )
    }

    return (
      <div>
        {
          tenantId === '042606' && // 董家口车辆提示信息
          <div className={inStyle.dongjiakou}>
            {Array.isArray(getBusinessList) && getBusinessList[0]?getBusinessList[0].homeinfo:''}
          </div>
        }
        {indexDefault}
        <Modal
          visible={showQRCode}
          transparent
          maskClosable
          onClose={() =>this.onClose()}
          animationType='fade'
          platform='android'
          className='QrCodeModal'
        >
          <Title level={4} style={{marginTop: '10px',color: '#666',fontWeight: 500}}>二维码</Title>
          <div style={{background:`url(${IconBgQrCode})`}} className='qrCodeBg'>
            <QRCode
              value={qrModalContent[qrCodeInnerContent]}// 生成二维码的内容
              size={150} // 二维码的大小
              fgColor="#000000"
              style={{margin: '15px 0'}}
            />
          </div>
          {
            Object.keys(JSON.parse(qrCodeContent)).map(key => {
              return (<Text style={{marginBottom:5}}>{JSON.parse(qrCodeContent)[key]}：{qrModalContent[key]}</Text>)
            })
          }

        </Modal>
      </div>
    );
  }
}

export default IndexDataList
