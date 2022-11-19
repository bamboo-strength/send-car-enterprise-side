import React, { PureComponent } from 'react';
import { ListView, PullToRefresh, NavBar, Tabs, Toast, Card, Flex, Button, Modal } from 'antd-mobile';
import { Form, Icon, Row, Col, message } from 'antd';
import router from 'umi/router';
import func from '@/utils/Func';
import { connect } from 'dva';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { COMMONBUSINESS_LIST } from '../../../actions/commonBusiness';
import { getColums } from '../../Merchants/commontable';
import { getButton } from '../../../utils/authority';
import { requestApi } from '../../../services/api';
import {getQueryConf} from '@/components/Matrix/MatrixQueryConfig';
import { submit } from '@/services/commonBusiness';

const FormItem = Form.Item;

const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

@connect(({ tableExtend,commonBusiness,loading }) => ({
  tableExtend,
  commonBusiness,
  loading: loading.models.commonBusiness,
}))
@Form.create()
class Waybill extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      hasMore: true,
      refreshing: true,
      dataSource: dataSource1,
      realdata: [],
      pageNo: 1,
      pageSize: 5,
      tabKey: '1',
      showColums:[],
      tableCondition:[],
      load: localStorage.getItem('load'),
      tabs:[{ title: '全部',key:'0' },{ title: '待审核',key:'1' }, { title: '已审核',key:'2' }, { title: '已冻结',key:'3' }, { title: '已作废',key:'4' }],
    };
  }

  componentWillMount() {
      const { dispatch,
      } = this.props;
      const paramData={}
      dispatch(TABLEEXTEND_COLUMNLIST({ 'tableName': 'shashi_dinas_contract','modulename':'byMoney',queryType:0})).then(() => {
        const {tableExtend:{ data }} = this.props;
        if (data !== undefined && func.notEmpty(data.columList)) {
          const aa=data.columList;
          const newCondation = func.notEmpty(aa.table_condition)?aa.table_condition:this.conditions
          const  rparams = func.notEmpty(paramData)?paramData:{}
          this.setState({
            showColums: aa.table_main.filter(ii=>ii.listShowFlag === 1).slice(0,6),
            tableCondition:aa.table_condition
          })
          this.getData(true,rparams)
        }
      })
    }

  getData(ref, param) {
    const { pageNo, pageSize, dataSource, realdata,tabKey } = this.state;
    const {
      dispatch,
    } = this.props;
    param.current = pageNo;
    param.size = pageSize;
    if(tabKey === '1'){ // 待审核
      param.auditFlag = 0
    }
    dispatch(COMMONBUSINESS_LIST({'tableName': 'shashi_dinas_contract','modulename':'byMoney',queryParam:param})).then(()=>{
      const { commonBusiness:{ data },
      } = this.props;
      const tempdata = data.list?data.list.filter(d => { return d.id !== -1 }):[]
      const len = tempdata.length;
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false,
        });
      }
      if (ref) { // 下拉刷新
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: tempdata,
        });
      } else { // 上拉加载
        const dataArr = realdata.concat(tempdata);
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(dataArr),
          refreshing: false,
          isLoading: false,
          realdata: dataArr,
        });
      }
    });
  }

  // 下拉刷新
  onRefresh = () => {
    this.setState({
      refreshing: true,
      isLoading: true,
      pageNo: 1,
    }, () => {
      this.query(true, {});
    });
  };

  onEndReached = () => {
    const { isLoading, hasMore, pageNo } = this.state;
    if (isLoading && !hasMore) {
      return;
    }
    this.setState({
      isLoading: true,
      pageNo: pageNo + 1, // 加载下一页
    }, () => {
      this.query(false, {});
    });
  };

  query = (flag, param) => {
    const { form } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      const values = {
        ...fieldsValue,
        ...param,
      };
      this.getData(flag, values);
    });
  };

  reset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      pageNo: 1,
    }, () => {
      this.query(true, {});
    });
  };

  changeTab = (tab,) => {
    this.setState({
      pageNo: 1,
      tabKey: tab.key,
      dataSource: dataSource1,
      isLoading: true,
      load: localStorage.removeItem('load'),
    }, () => {
      this.query(true, {});
    });
  };


  /* 跳转详情 */
  onNetWorkCard = rowData => {
    const {tabKey,load,} = this.state;
    router.push(
      {
        pathname: `/network/waybill/waybillview/${rowData.id}`,
        state: {
          initialPage: load != null && true ? load :tabKey,
        },
      },
    );
  };

  handleBtnClick = (btn, obj) => {
    this.setState({
      pageNo: 1,
    });
    const { path, alias } = btn;
    if (alias === 'edit') {
      router.push(`${path}/${obj.id}`);
    } else if (alias === 'view') {
      // router.push(`${path}/${obj.id}`);
      if(func.notEmpty(obj.id)){
        router.push(`${path}/${obj.id}`);
      }else {
        router.push(
          {
            pathname: `${path}/${obj.id}`,
            state: {
              data: obj,
            },
          },
        );
      }

    } else if (alias === 'delete') {
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
    }else {
      const { match: {
        params: { tableName,modulename },
      } } = this.props;
      const refresh = this.handleSearch;
      const {params} = this.state
      if(btn.code.includes('withoutPop')){
        submit({tableName,modulename,submitParams:{realId:obj.id},btnCode:btn.code}).then(resp=>{
          if(resp.success){
            message.success('操作成功！');
            refresh(params)
          }
        })
      }
    }
  };

  // ************ 查询框
  showSearch = () => {
    this.setState({
      showSearchModal:true,
    })
  }

  onClose = () => {
    clearInterval(this.timer);
    this.setState({
      showSearchModal:false,
    })
  }

  render() {
    const { showColums,dataSource, isLoading, refreshing, tabKey,  load,tabs,showSearchModal,tableCondition } = this.state;
    const {form} = this.props
    const rows =getColums(showColums,'')
    const buttons = getButton('')
    const viewBtn = buttons.filter(button => button.alias === 'view');

    const separator = (sectionID, rowID) => (<div
      key={`${sectionID}-${rowID}`}
      style={{
      backgroundColor: '#F5F5F9',
      height: 8,
      borderTop: '1px solid #ECECED',
      borderBottom: '1px solid #ECECED',
    }}
    />);
    const formItemLayout = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 15 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const actionButtons = buttons.filter(button => button.alias !== 'add' && button.alias !== 'view' && button.alias !== 'downloadExcel' && button.action !== 4);

    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID}>
          {
            rows.length>0 ?
              <Card>
                <Card.Header
                  extra={
                    <span style={{color:'blue'}}>
                      <Icon type="qrcode" onClick={()=> this.onFirstClick(rowData)} />:
                    </span>
                  }
                />
                <Card.Body key={sectionID} onClick={()=>{this.handleBtnClick(viewBtn[0], rowData)}}>
                  <Row gutter={24}>
                    {
                      rows.map(rrow => (
                        <Col span={24} className="view-config"><FormItem {...formItemLayout} label={rrow.key}><span style={{color: 'rgba(0, 0, 0, 0.85)'}}>{rowData[rrow.value]}</span></FormItem></Col>
                      ))
                    }
                  </Row>
                </Card.Body>
                {
                  actionButtons.length>0?
                    <Card.Body>
                      <Flex className='flexForList'>
                        {
                          actionButtons.map(button => {
                            return (
                              <Flex.Item>
                                <Button type="primary" size='small' inline onClick={() =>this.handleBtnClick(button,rowData)}>{<FormattedMessage id={`button.${button.alias}.name`} /> === `button.${button.alias}.name` ? <FormattedMessage id={`button.${button.alias}.name`} /> : button.name}</Button>
                              </Flex.Item>
                            )
                          })
                        }
                      </Flex>
                    </Card.Body>:undefined
                }
              </Card>:undefined
          }
        </div>
      );
    };

    const serarchForm = () => {
      const queryItem = getQueryConf(tableCondition,form,{})
      return (
        <div>
          {queryItem}
        </div>
      )
    };

    const listView = (
      <ListView
        ref={el => this.lv = el}
        dataSource={dataSource}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>{isLoading ? '加载中...' : '加载完毕'}</div>)}
        renderRow={row}
        renderSeparator={separator}
        pageSize={4}
        useBodyScroll
        pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    );

    return (
      <div id={NetWorkLess.netWork}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/menu')}
          rightContent={[
            <Icon key="0" type="search" style={{fontSize:'24px',marginRight:'20px' }} onClick={() => this.showSearch()} />,
          ]}
        >合同管理
        </NavBar>
        <div className='am-list'>
          <Tabs
            tabs={tabs}
            page={load != null && true ? Number(load) - 1 : tabKey - 1}
            initialPage={0}
            onChange={(tab, index) => this.changeTab(tab, index)}
          >
            <div key='0'>{listView}</div>
            <div key='1'>{listView}</div>
            <div key='2'>{listView}</div>
            <div key='3'>{listView}</div>
            <div key='4'>{listView}</div>
          </Tabs>
        </div>
        <Modal
          visible={showSearchModal}
          transparent
          maskClosable
          onClose={() =>this.onClose()}
          popup
          animationType='slide-down'
          platform='android'
        >
          {serarchForm()}
          <div style={{marginTop:'8px',float:'right'}}>
            <Button type="primary" size='small' inline onClick={() =>this.query(1)} style={{marginLeft:'8px'}}>查询</Button>
            <Button type="primary" size='small' inline onClick={() =>this.reset()} style={{marginLeft:'15px'}}>重置</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Waybill;
