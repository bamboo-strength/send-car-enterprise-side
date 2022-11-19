import React, { PureComponent } from 'react';
import { EmptyData, InTheLoad } from '@/components/Stateless/Stateless';
import { Form, Icon, } from 'antd/lib/index';
import { Button, Card, Flex, ListView, Modal, NavBar, PullToRefresh, Toast, } from 'antd-mobile';
import { connect } from 'dva';
import { COMMONBUSINESS_LIST } from '@/actions/commonBusiness';
import router from 'umi/router';
import { getColums, getTenantId ,} from '../commontable';
import inStyle from '@/pages/PageMould/IndexDataList.less';
import RecordList from '@/components/RecordList';
import { getButton,  } from '../../../utils/authority';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { requestApi, requestPostHeader, } from '../../../services/api';
import { getQueryConf } from '../../../components/Matrix/MatrixQueryConfig';
import { handleSearchParams } from '../../../components/Matrix/commonJs';
import { submit } from '@/services/commonBusiness';
import {handleTenantbtnClick} from './HandleTenantFunc'
import ExecuteOrder from './HandleTenantFunc/ExecuteOrder'
import { distinguishBtn } from './HandleTenantFunc/DistinguishBtn';

const { alert } = Modal;

@connect(({ commonBusiness,tableExtend,loading }) =>({
  commonBusiness,
  tableExtend,
  loading:loading.models.commonBusiness,
}))
@Form.create()
class CommonPageDispatchList extends PureComponent {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    // 创建ListViewDataSource对象
    const dataSource = new ListView.DataSource({
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2, // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
    });
    const {location} = this.props
    this.state = {
      isLoading: true,
      searchLoading:true,
      refreshing: true,
      onScrollChanges: true,
      dataSource,
      realdata: [],
      hasMore: true,
      pageNo: 1,
      pageSize: props.pageSize || 5,
      total:null,
      showColums: [],
      tableCondition: [],
      buttons:[],
      formValuesEcho:location.state?location.state.formValuesEcho:{},
      executeOrderVisible:false
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
      params: { tableName,modulename },
    }, } = this.props;
    const param ={ 'tableName': tableName, 'modulename': modulename, queryType: 0 }
    dispatch(TABLEEXTEND_COLUMNLIST(param)).then(() => {
        const {tableExtend:{ data }} = this.props;
        const {columList} =data
        this.setState({
          showColums: columList.table_main,
          tableCondition: columList.table_condition,
          buttons: getButton(`${tableName}_${modulename}`),
        })
        this.getData(true);
    })
  }

  /* 解决和时间组件滑动穿透问题 */
  slipThroughs = (e) =>{
    this.setState({
      onScrollChanges:e
    })
  }

  /* 调用接口 */
  getData = (ref = false,) => {
    const { form,
      dispatch,
      match: {
        params: { tableName,modulename },
      },
    } = this.props;
    const { pageNo, pageSize, realdata, tableCondition,formValuesEcho} = this.state;
    const formValues = form?form.getFieldsValue():{}
    const param = handleSearchParams(tableCondition,{...formValuesEcho,...formValues,},form)
    const params = {
      current: pageNo,
      size: pageSize,
      ...param,
    };
    params['Blade-DesignatedTenant'] = getTenantId()
    delete params.headers
    dispatch(COMMONBUSINESS_LIST({tableName,modulename,queryParam:params})).then(item => {
        const { dataSource } = this.state;
        const { commonBusiness:{ data },
        } = this.props;
        const settingVo = data.commonBusinessDefineVO || {}
      const {total} = data.pagination
        const tempdata = data.list ? data.list.filter(d => { return d.id !== -1 }) : []
        const len = tempdata.length;
        if (len <= 0) { // 判断是否已经没有数据了
          this.setState({
            refreshing: false,
            isLoading: false,
            searchLoading:false,
            hasMore: false,
            settingVo,
            total
          });
        }
        if (ref) { // 下拉刷新
          this.setState({
            pageNo,
            dataSource: dataSource.cloneWithRows(tempdata), // 数据源中的数据本身是不可修改的,要更新datasource中的数据，请（每次都重新）调用cloneWithRows方法
            hasMore: true, // 下拉刷新后，重新允许开下拉加载
            refreshing: false, // 是否在刷新数据
            isLoading: false, // 是否在加载中
            searchLoading:false,
            realdata: tempdata, // 保存数据进state，在下拉加载时需要使用已有数据
            total,
            settingVo,
          });
        } else { // 上拉加载
          // 合并state中已有的数据和新增的数据
          const dataArr = realdata.concat(tempdata); // 关键代码
          this.setState({
            pageNo,
            dataSource: dataSource.cloneWithRows(dataArr), // 数据源中的数据本身是不可修改的,要更新datasource中的数据，请（每次都重新）调用cloneWithRows方法
            refreshing: false,
            isLoading: false,
            searchLoading:false,
            realdata: dataArr, // 保存新数据进state
            total
          });
        }

    });
  };

  // 下拉刷新
  onRefresh = () => {
    this.setState({
      refreshing: true,
      isLoading: true,
      searchLoading:true,
      pageNo: 1,
    }, () => {
      this.getData(true);
    });
  };

  // 滑动到底部时加载更多
  onEndReached = () => {
    const { isLoading, hasMore, pageNo } = this.state;
    // 加载中或没有数据了都不再加载
    if (isLoading && !hasMore) {
      return;
    }
    this.setState({
      isLoading: true,
      searchLoading:false,
      pageNo: pageNo + 1, // 加载下一页
    }, () => {
      this.getData(false);
    });
  };

  renderHeader = () => {
    const {renderHeader} = this.props
    const {total} = this.state
    if (renderHeader) {
      return renderHeader(total)
    }
  }

  handleBtnClick = (btn, obj,) => {
    if (!btn) {
      return
    }
    const {form,match: {
      params: { tableName,modulename },
    },} = this.props
    this.setState({
      pageNo: 1,

    });
    const { path, code } = btn;
    if (code.includes('edit')) {
      router.push(`${path}/${obj.id}`);
    } else if (code.includes('view')) {
      const {formValuesEcho} = this.state
      router.push(
        {
          pathname: `${path}/${obj.id}`,
          state: {
            backUrl:`/commonBusiness/commonDispatchList/${tableName}/${modulename}`,
            data: obj.id?obj:'',
            formValuesEcho:{...formValuesEcho,...form.getFieldsValue(),}
          },
        },
      );
    } else if (code.includes('delete')) {
      alert('删除', '确定删除?', [
        { text: '取消', style: 'default' },
        {
          text: '确定', onPress: () => {
            requestApi(path, { ids: obj.id }).then(resp => {
              if (resp.success) {
                Toast.success(resp.msg);
                this.reset();
              }
            });
          },
        },
      ]);
    }else if(code.includes('remove')){
      alert('删除', '确定删除?', [
        { text: '取消', style: 'default' },
        {
          text: '确定', onPress: () => {
            requestPostHeader('/api/mer-tableextend/commonBusiness/remove', { ids: obj.id,tableName,modulename }).then(resp=>{
              if (resp.success) {
                Toast.success(resp.msg)
                this.reset();
              }
            })

          },
        },
      ]);
    }
    else {
      this.handleCommonBtn(btn,obj,)
    }
    handleTenantbtnClick(btn,obj,form,this) // 租户特殊方法处理
  };

  handleCommonBtn=(btn,obj,)=>{
    const { match: {
      params: { tableName,modulename },
    } } = this.props;
    const refresh = this.handleSearch;
    const { path } = btn;
    const {isloading,queryParams} = this.state
    if(btn.code.includes('withoutPop')){
      const word = btn.name
      if (!isloading){
        alert(word, `确定${word}该数据?`, [
          { text: '取消', style: 'default' },
          {
            text: '确定', onPress: () => {
              submit({tableName,modulename,submitParams:{realId:obj.id},btnCode:btn.code}).then(resp=>{
                if(resp.success){
                  Toast.success('操作成功！');
                  refresh(queryParams)
                }
              })
            },
          },
        ]);
      }
    }else if(btn.code.includes('withUrl')){
      router.push({
        pathname:`${path}/${obj.id}`,
        state:{
          object:obj,
          queryParams,
          topBarName:btn.name,
          btnCode:btn.code,
          backUrl:`/commonBusiness/commonDispatchList/${tableName}/${modulename}`
        }},
      )
    }
  }

  showSearchModal = () => {
    this.setState({
      showSearchModal: true,
      onScrollChanges:false
    });
  };

  renderSearchForm = (tableCondition) => {
    const { form, } = this.props;
    const {formValuesEcho} = this.state
    const queryItem = getQueryConf(tableCondition, form, {}, 9, formValuesEcho)
    return (
      <div style={{ minHeight: '260px' }}>
        {queryItem}
      </div>
    );
  }

  handleSearch=()=>{
    this.getData(true)
    this.setState({
      isLoading:true,
      searchLoading:true,
      showSearchModal:false
    })
  }

  reset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValuesEcho:{},
      showSearchModal:false
    },()=>{
      this.getData(true,)
    })
  };

  onClose=(type)=>{
    this.setState({
      showSearchModal:false,
      executeOrderVisible:false,
      onScrollChanges:true,
    })
  }

  goReturn=()=> {
    router.push('/dashboard/function')
  }

  render() {
    window.gobackurl = () => {
      this.goReturn()
    };
    const { dataSource, isLoading, searchLoading,onScrollChanges, refreshing,settingVo={},showColums,buttons,
      showSearchModal,tableCondition,executeOrderVisible,obj={}} = this.state;
    const {form,location,match: {
      params: { tableName,modulename },
    } } = this.props
    const { _cachedRowCount } = dataSource;
    const height = `calc( 100vh - 200px)`;
    const rows = getColums(showColums.filter(ii => ii.listShowFlag === 1).slice(0, settingVo.appListShowNum || 6), '')
    let actionButtons = buttons.filter(button => button.alias !== 'add' && button.alias !== 'view' && !button.alias.includes('justForPC') && button.alias !== 'downloadExcel' && button.action !== 4);
    const viewBtn = buttons.filter(button => button.alias === 'view');
    const addButtons = buttons.filter(button => button.alias === 'add');
    const addPath=addButtons.length>0?addButtons[0].path:''
    const checkedId = location.state?.checkedId || ''
    // console.log(actionButtons,'===actionButtons')
    const row = (rowData, sectionID, rowID) => {
      actionButtons  = distinguishBtn(tableName,modulename,actionButtons,rowData,rowID) // 按照租户处理按钮
      return (
        <div key={rowID}>
          {
            rows.length > 0 &&
              <Card className={inStyle.amCard}>
                <RecordList rows={rows} rowData={rowData} checkedId={checkedId} onClick={() => { this.handleBtnClick(viewBtn[0], rowData) }} />
                {
                  actionButtons.length > 0  &&
                  <Card.Body>
                    <Flex className='flexForList'>
                      {
                        actionButtons.map(button => {
                          return (
                            <Flex.Item>
                              <Button type="primary" size='small' inline onClick={() => this.handleBtnClick(button, rowData)}>{button.name}</Button>
                            </Flex.Item>
                          )
                        })
                      }
                    </Flex>
                  </Card.Body>
                }

              </Card>
          }
        </div>
      );
    };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={()=>router.push('/dashboard/function')}
          rightContent={[
            tableCondition.length>0 && <Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.showSearchModal()} />,
            addPath ? <Icon key="1" type="plus" size='sm' onClick={() => router.push(addPath)} />:undefined,
          ]}
        ><span style={{ color: '#108ee9' }}>{settingVo.functionName}</span>
        </NavBar>
        {searchLoading ? <InTheLoad height={height} /> :
            _cachedRowCount !== 0 ?
              <div className="am-list">
                <ListView
                  ref={el => {
                    this.lv = el;
                  }}
                  dataSource={dataSource}
                  pullToRefresh={onScrollChanges ? <PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} /> : false}
                  renderFooter={() => (
                    <div style={{ padding: 30, textAlign: 'center' }}>
                      {isLoading ? '加载中' : '加载完毕'}
                    </div>)}
                  renderHeader={this.renderHeader}
                  renderRow={row}
                  useBodyScroll
                  // renderSeparator={separator}
                  style={{ overflow: 'auto' }}
                  distanceToRefresh='20'
                  scrollRenderAheadDistance={500}
                  onEndReached={this.onEndReached}
                  onEndReachedThreshold={10}
                  className='list-view-round'
                  pageSize={5}
                />
              </div>
              : <EmptyData text='暂无记录' height={height} />}


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
            <Button type="primary" size='small' inline onClick={() => this.handleSearch()} style={{ marginLeft: '8px' }}>查询</Button>
            <Button type="primary" size='small' inline onClick={() => this.reset()} style={{ marginLeft: '15px' }}>重置</Button>
          </div>
        </Modal>
        <ExecuteOrder executeOrderVisible={executeOrderVisible} onClose={this.onClose} refresh={this.reset} obj={obj} />
      </div>

    );
  }
}

export default CommonPageDispatchList;
