import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Col, Form, Icon, Row } from 'antd';
import { COMMONBUSINESS_LIST } from '@/actions/commonBusiness';
import matrixqrcode from '../../../components/Matrix/MatrixCommon.less';
import { getColums, getTenantId } from '../../Merchants/commontable';
import func from '@/utils/Func';
import { handleDate } from '@/components/Matrix/commonJs';
import { Button, ListView, Modal, NavBar, PullToRefresh } from 'antd-mobile';
import CardWrap from '@/components/CardWrap';
import Loading from '@/components/Loading/Loading';
import RecordList from '@/components/RecordList';
import inStyle from '@/pages/PageMould/IndexDataList.less';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { getQueryConf } from '../../../components/Matrix/MatrixQueryConfig';

const FormItem = Form.Item;

@connect(({ commonBusiness,tableExtend,loading }) =>({
  commonBusiness,
  tableExtend,
  loading:loading.models.commonBusiness,
}))

@Form.create()
class Weighing extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      tableName:'shashi_dinas_sale_weight',
      modulename:'query',
      showColums:[],
      tableCondition:[],
      dataSource,
      pageNo: 1,
      pageSize: 5,
      realdata: [],
      showSearchModal:false,
      sumData:[{}],
      selectData:'',
      paramToLocation:{}
    };
  }

  componentWillMount() {
    const { tableName,modulename } = this.state;
    const { dispatch } = this.props
    dispatch(TABLEEXTEND_COLUMNLIST({ 'tableName': tableName,'modulename':modulename,queryType:0})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined && func.notEmpty(data.columList)) {
        const aa=data.columList;
        this.setState({
          showColums: aa.table_main,
          //  showSubColums: aa.table_sub,
          tableCondition:aa.table_condition.filter(item=>item.columnName !=='deptId' && item.columnName !=='materialno'),
        })
        this.getDatas(true,{pageNo:1},'first');
      }
    })
  }

  componentDidMount() {
    const {location} = this.props
    if(location.state){
      const {selectData,paramToLocation,materialName} =location.state
      this.setState({
        paramToLocation,
        selectData,
        materialName
      })
    }

  }

  onLeftClick=()=>{ // 左边按钮点击时
    const {location} = this.props
    const {selectData} = this.state
    router.push({
      pathname: location.state.backUrl,
      state: {
        queryData:location.state.queryData,
        object:location.state.object,
        tableCondition:location.state.tableCondition,
        queryParams:location.state.queryParams,
        selectData
      },
    });
  }

  getDatas = (ref,param,flag) => {
    const { pageNo, pageSize,tableCondition,paramToLocation } = this.state;
    param.current = func.notEmpty(param.pageNo) ? param.pageNo : pageNo;
    param.size = pageSize;
    delete param.pageNo;
    let params = {}
    if(flag === 'first'){
      params = {...param,...paramToLocation}
    }else {
      params = {...paramToLocation,...param}
    }
    const newCondation = func.notEmpty(tableCondition)?tableCondition:this.conditions
    if(newCondation.length>0){
      newCondation.forEach((item)=>{
        if(item.conditionflag === 2){
          func.addQuery(params, item.columnName, '_like')
        }
        if(item.category ===8){ // 组织机构 添加equal 主要对接砂石使用
          params[`${item.columnName}_equal`] = params[item.columnName]?params[item.columnName].toString():undefined
          delete params[item.columnName];
        }

        if (item.category === 2) {  // 处理时间
          const valueDefault = handleDate(item.initialvalue)
          const dateValue = params[item.columnName]?func.formatFromStr(params[item.columnName]):valueDefault
          if (item.conditionflag === 3) {
            params[`${item.columnName}_le`]=dateValue;
            delete params[item.columnName];
          }else if (item.conditionflag === 4) {
            params[`${item.columnName}_ge`]=dateValue;
            delete params[item.columnName];
          }else {
            params[item.columnName] = dateValue;
          }
        }
        if(func.notEmpty(item.initialvalue) && item.isReadonly === 1){
          params[item.columnName] = item.initialvalue
        }
      })
    }
    this.conditions = func.notEmpty(tableCondition) && tableCondition.length>0?tableCondition:this.conditions
    const rparams = func.notEmpty(params)?params:{}
    rparams['Blade-DesignatedTenant'] = getTenantId()
    delete rparams.headers
    this.getDataFromBack(rparams,ref)
  };

  getDataFromBack=(rparams,ref)=>{
    // console.log(ref,)
    const {dispatch} = this.props
    const {tableName,modulename,pageNo,dataSource,realdata} =this.state
    dispatch(COMMONBUSINESS_LIST({tableName,modulename,queryParam:rparams})).then(()=>{
      const { commonBusiness:{ data }, } = this.props;
      const tempdata = data && data.list?data.list.filter(d => { return d.id !== -1 }):[];
      const sumData  = data && data.list?data.list.filter(d => { return d.id === -1 }):[{}];
      // console.log(ref,tempdata,'===tempdata')
      const len = tempdata.length
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false,
          sumData
        })
      }
      if (ref) {
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: tempdata,
          sumData
        })
      } else {
        const dataArr = realdata.concat(tempdata)
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(dataArr),
          refreshing: false,
          isLoading: false,
          realdata: dataArr,
          sumData
        })
      }
    })
  }

  // 下拉刷新
  onRefresh = () => {// console.log('1111')
    this.setState({
      refreshing: true,
      isLoading: true,
      pageNo: 1,
    }, () => {
      this.query(true,1)
    });
  };

  onEndReached = () => {// console.log('0000')
    const { isLoading, hasMore, pageNo } = this.state;
    // console.log(isLoading,hasMore)
    if ((isLoading && !hasMore)) {
      return;
    }
    this.setState({
      isLoading: true,
      pageNo: pageNo + 1,
    }, () => {
      this.query(false,pageNo + 1);
    });
  };
// *********** 操作 **********

  query = (flag,pp) => {
    const { form } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      const values = {
        ...fieldsValue,
        pageNo: pp,
      };
      this.setState({
        pageNo: pp,
      }, () => {
        this.getDatas(flag,values);
        this.onClose()
      });
    });
  };

  /* handleLeftClick=()=>{ // 向子组件传递方法、点击返回键时带参数
     const {location} = this.props
     const { object, queryParams, backUrl} = location.state
     router.push({
       pathname:backUrl,
       state:{
         object,
         queryParams,
         backUrl:'/dashboard/menu'
       }
     })
   }
 */
  onSelect = (e,name) =>{
    const params = {
      pageNo:1,
      grosstime_gt: e.starts,
      grosstime_lt:e.ends,
      size:5,
      current:1,
    }
    this.setState({
      selectData:name
    })
    this.getDatas(true,params);
    //  this.getDataFromBack(params,true)
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

  reset = () => {
    const {form} = this.props
    form.resetFields()
    this.setState({
      pageNo:1
    }, ()=> {
      this.query(true,1)
    })
  };

  renderSearchForm = (tableCondition) => {
    const { form } = this.props;
    const queryItem = getQueryConf(tableCondition,form,{},9)
    return (
      <div style={{minHeight:'260px'}}>
        {queryItem}
      </div>
    );
  }


  render() {
    const {showColums,dataSource,isLoading,refreshing,showSearchModal,tableCondition,realdata,sumData,materialName,selectData}=this.state
    const rows =getColums(showColums.filter(ii=>ii.listShowFlag === 1).slice(0,8 || 6),'')
    // console.log(realdata,sumData,'===sumData')
    const {location} = this.props
    const obj = {carsum:sumData.length>0?sumData[0].carsum?sumData[0].carsum:'0':'0',netweightsum:sumData.length>0?sumData[0].netweight?sumData[0].netweight:'0':'0',materialName}
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID}>
          {
            rows.length>0 ?
              <RecordList rows={rows} rowData={rowData} />:undefined
          }
        </div>
      );
    };

    return (
      <div className={matrixqrcode.commonPageList}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={this.onLeftClick}
          rightContent={[
            <Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.showSearch()} />,
          ]}
        >{materialName}
        </NavBar>
        <div className="am-list">
          <CardWrap obj={obj} onSelect={this.onSelect} defaultValue={location.state?location.state.selectData:selectData} />
          <ListView
            dataSource={dataSource}
            renderHeader={()=>(
              <div className={inStyle.renderHeader}>
                <div>
                  <span className={inStyle.bussName}>过磅记录({`${realdata.length}`})</span>
                </div>
              </div>
            )}
            renderFooter={() => (
              <Loading isLoading={isLoading} />
            )}
            renderRow={row}
            className={inStyle.listView}
            renderSeparator={separator}
            pageSize={5}
            useBodyScroll
            pullToRefresh={<PullToRefresh
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={20}
            style={{padding:'0 8px'}}
          />
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
            <Button type="primary" size='small' inline onClick={() => this.query(true,1)} style={{ marginLeft: '8px' }}>查询</Button>
            <Button type="primary" size='small' inline onClick={() => this.reset()} style={{ marginLeft: '15px' }}>重置</Button>
          </div>
        </Modal>
      </div>

    );
  }


}

export default Weighing;
