import React, { PureComponent } from 'react';
import { EmptyData, InTheLoad } from '@/components/Stateless/Stateless';
import {Form,Icon } from 'antd/lib/index';
import { Button, Card, Flex, ListView, Modal, NavBar, PullToRefresh, Toast, } from 'antd-mobile';
import router from 'umi/router';
import RecordList from '@/components/RecordList';
import { getButton,  } from '../../utils/authority';
import { requestApi ,requestPostHeader} from '@/services/api';
import { getQueryConf } from '@/components/Matrix/MatrixQueryConfig';
import { handleSearchParams } from '@/components/Matrix/commonJs';
import {submit} from '@/services/commonBusiness';
import style from './MatrixMobile.less'

@Form.create()
class CommonListView extends PureComponent {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    // 创建ListViewDataSource对象
    const dataSource = new ListView.DataSource({
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2, // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
    });
    const {location,code,tableCondition} = this.props
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
      tableCondition,
      buttons:getButton(code),
      formValuesEcho:location && location.state?location.state.formValuesEcho:{}
    };
  }

  componentDidMount() {
    const catchData = sessionStorage.getItem('listviewdata') ? JSON.parse(sessionStorage.getItem('listviewdata')) : null
    const {dataSource} = this.state

    if (catchData) {
      this.setState({
        searchLoading:false,
        refreshing: false,
        isLoading: false,
        realdata: catchData.realdata,
        dataSource:dataSource.cloneWithRows(catchData.realdata)
      });
      setTimeout(() => {
        document.documentElement.scrollTop = catchData.scrollTop
        document.body.scrollTop = catchData.scrollTop
        sessionStorage.removeItem('listviewdata')
      }, 0)
      return
    }
    this.getData(true);
  }

  /* 解决和时间组件滑动穿透问题 */
  slipThroughs = (e) =>{
    this.setState({
      onScrollChanges:e
    })
  }

  /* 调用接口 */
  getData = (ref = false,) => {
    const { form,path,originParam } = this.props;
    const { pageNo, pageSize, realdata, tableCondition,formValuesEcho} = this.state;
    const formValues = form?form.getFieldsValue():{}
    const param = handleSearchParams(tableCondition,{...formValuesEcho,...formValues,},form)
    const params = {
      current: pageNo,
      size: pageSize,
      ...param,
      ...originParam
    };
    path(params).then((resp) => {
        const { dataSource } = this.state;
        const {data} = resp
        const {total,records} = data
        const tempdata = records
        const len = tempdata.length;
        if (len <= 0) { // 判断是否已经没有数据了
          this.setState({
            refreshing: false,
            isLoading: false,
            searchLoading:false,
            hasMore: false,
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
    const {form} = this.props
    this.setState({
      pageNo: 1,
    });
    const { path, code } = btn;
    if (code.includes('edit')) {
      router.push(`${path}/${obj.id}`);
    } else if (code.includes('view')) {
      const {formValuesEcho,realdata} = this.state
      // console.log(this.props,'---')
      const tempData = {
        realdata,
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
      }
      sessionStorage.setItem('listviewdata', JSON.stringify(tempData))
      router.push(
        {
          // pathname: `${path}/${obj.id}`,
          pathname:path,
          state: {
            backUrl:'',
            data: obj.id?obj:'',
            formValuesEcho:{...formValuesEcho,...form.getFieldsValue(),}
          },
        },
      );
    } else if (code.includes('delete') || code.includes('remove')) {
      alert('', '确定删除?', [
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
    }else {
      this.handleCommonBtn(btn,obj,)
    }
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
    }, () => {
      this.setState({
        onScrollChanges: false
      })
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
    })
  }


  render() {
    const { dataSource, isLoading, searchLoading,onScrollChanges, refreshing,buttons,showSearchModal,tableCondition=false} = this.state;
    const {functionName,location,rows,customBtn,extra} = this.props
    const { _cachedRowCount } = dataSource;
    const height = `calc( 100vh - 200px)`;
    const actionButtons = buttons.filter(button => button.alias !== 'add' && button.alias !== 'view' && !button.alias.includes('justForPC') && button.action !== 4);
    const viewBtn = buttons.filter(button => button.alias === 'view');
    // const viewBtn = [{name:'查看',code:'view',path:'/epidemic/lineuprecord'}] // 例子

    const addPath=actionButtons.length>0?actionButtons[0].path:''
    const checkedId =  location && location.state?location.state.checkedId :''
    const row = (rowData, sectionID, rowID) => {
      let renderBtns = actionButtons.map(button => {
        return <a style={{color:'#1890FF'}} onClick={()=>this.handleBtnClick(button, rowData)}>{button.name}</a>
      })
      if(customBtn){
        renderBtns = customBtn(rowData) // 自定义按钮
      }
      return (
        <div key={rowID}>
          {
            rows.length > 0 &&
              <Card>
                <RecordList rows={rows} rowData={rowData} checkedId={checkedId} extra={extra} renderBtns={renderBtns} onClick={() => { this.handleBtnClick(viewBtn[0], rowData) }} />
              </Card>
          }
        </div>
      );
    };
    return (
      <div className={style.commonListView}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={()=>router.push('/dashboard/function')}
          rightContent={[
            <Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.showSearchModal()} />,
            addPath ? <Icon key="1" type="plus" size='sm' onClick={() => router.push(addPath)} />:undefined,
          ]}
        ><span style={{ color: '#108ee9' }}>{functionName}</span>
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
                  style={{ overflow: 'auto',background:'white' }}
                  distanceToRefresh='20'
                  scrollRenderAheadDistance={500}
                  onEndReached={this.onEndReached}
                  onEndReachedThreshold={10}
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

      </div>

    );
  }
}

export default CommonListView;
