import { Button, Card, Flex, Icon, ListView, Modal, NavBar, PullToRefresh, Toast } from 'antd-mobile';
import React from 'react';
import router from 'umi/router';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Col, Form, Row } from 'antd';
import { getButton } from '../../utils/authority';
import { requestApi } from '../../services/api';
import func from '@/utils/Func';
import Loading from '../Loading/Loading';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { getColums } from '../../pages/Merchants/commontable';
import { getQueryConf } from './MatrixQueryConfig';
import inStyle from '@/pages/PageMould/IndexDataList.less';
import RecordList from '@/components/RecordList';
import { btnFilter } from '@/components/Matrix/commonBtnFilter';

const { alert } = Modal;
const FormItem = Form.Item;

@connect(({ tableExtend, loading }) => ({
  tableExtend,
  // loading: loading.models.tableExtend,
}))

class MatrixListViewTable extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    const {locationData} = this.props
    this.state = {
      isLoading: true,
      hasMore: true,
      refreshing: true,
      dataSource,
      realdata: [],
      pageNo: 1,
      pageSize: 5,
      showSearchModal: false,
      buttons: getButton(props.code),
      upOrDown: true,  //
      renderStatus: true,
      showColums: [],
      showSubColums: [],
      tableCondition: [],
      isFirst: true,
      pullData: true,
      navName: props.navName,
      appListShowNum:props.appListShowNum,
      backgroundStyle:props.backgroundStyle,
      formValuesEcho:locationData && locationData.state?locationData.state.formValuesEcho:{}
    }
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
    const catchData = sessionStorage.getItem('listviewdata') ? JSON.parse(sessionStorage.getItem('listviewdata')) : null
    if (catchData) {
      this.setState({
        showColums: catchData.showColums || [],
        showSubColums: catchData.showSubColums || [],
        tableCondition: catchData.tableCondition || [],
        isFirst: false,
        navName: catchData.navName,
        appListShowNum:catchData.appListShowNum,
        backgroundStyle:catchData.backgroundStyle
      });
      this.getreDatas(catchData.realdata)
      setTimeout(() => {
        document.documentElement.scrollTop = catchData.scrollTop
        document.body.scrollTop = catchData.scrollTop
        sessionStorage.removeItem('listviewdata')
      }, 0)
      return
    }
    const { dispatch, tableName, modulename } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({ 'tableName': tableName, 'modulename': modulename, queryType: 0 })).then(() => {
      const { tableExtend: { data } } = this.props;
      if (data !== undefined && func.notEmpty(data.columList)) {
        const aa = data.columList;
        this.setState({
          showColums: aa.table_main,
          showSubColums: aa.table_sub,
          tableCondition: aa.table_condition,
          isFirst: false
        })
        this.query(1);
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.navName) return
    const { upOrDown } = this.state;
    const { data, navName, } = this.props;
    const { list } = nextProps.data;
    const data1 = data && data.list ? data.list.filter(d => { return d.id !== -1 }) : []
    const newlist = list ? list.filter(d => { return d.id !== -1 }) : []
    if (!upOrDown) {
      if ((newlist.length !== data1.length) ||
        (newlist.length > 0 && data1.length > 0 && data1[0].id !== newlist[0].id) ||
        newlist.length === 0) {
        this.getreDatas(newlist);
      } else {
        this.getreDatas(null);
      }
    } else {
      this.getreDatas(newlist);
    }
    if (nextProps.navName !== navName) {
      this.setState({ navName: nextProps.navName,appListShowNum:nextProps.appListShowNum,backgroundStyle:nextProps.backgroundStyle });
    }
  }

  shouldComponentUpdate() {
    const { renderStatus } = this.state;
    if (renderStatus) {
      return true;
    }
    return false;
  }

  getDatas = (params) => {
    const { getDataFromPa, } = this.props;
    const {  pageSize, tableCondition,  } = this.state;
    params.size = pageSize;
    delete params.pageNo;
    getDataFromPa(params, tableCondition);
  };

  getreDatas = (returnData) => {
    const { pageNo, dataSource, realdata, upOrDown } = this.state;
    if (func.notEmpty(returnData)) {
      const len = returnData.length;
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false,
        });
      }

      if (upOrDown) {
        // 下拉刷新
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(returnData),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: returnData,
        });
      } else {
        // 上拉加载
        const dataArr = realdata.concat(returnData);
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(dataArr),
          refreshing: false,
          isLoading: false,
          realdata: dataArr,
        });
      }
    } else {
      this.setState({
        //  refreshing: false,
        //  isLoading: false,
        hasMore: false,
        //   showSearchModal: false,
      });
    }
  };

  // 下拉刷新
  onRefresh = () => {
    this.setState({
      refreshing: true,
      isLoading: true,
      upOrDown: true,
      pageNo: 1,
    }, () => {
      this.query(1)
    });
  };

  onEndReached = (event) => {
    event.preventDefault();
    const { isLoading, hasMore, pageNo, isFirst } = this.state;
    if ((isLoading && !hasMore) || isFirst) {
      return;
    }
    this.setState({
      isLoading: true,
      pageNo: pageNo + 1,
      upOrDown: false,
    }, () => {
      this.query(pageNo + 1);
    });
  };
  // *********** 操作 **********

  query = (pageNo) => {
    const { form, tableName, modulename } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      const values = {
        ...fieldsValue,
        current:pageNo,
      };

      this.setState({
        pageNo,
      },()=>{
        this.getDatas(values);
        // this.onClose()
      });
    });
  };

  reset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValuesEcho:{},
    },()=>{
      this.onRefresh();
    })

  };

  handleBtnClick = (btn, obj, parentObj) => {
    const { showColums, showSubColums, tableCondition, navName, appListShowNum,backgroundStyle,realdata } = this.state;
    if (!btn) {
      return
    }
    this.setState({
      pageNo: 1,
      upOrDown: true,
    });
    const { path, alias, code } = btn;
    const { btnCallBack } = this.props;
    if (code.includes('edit')) {
      router.push(`${path}/${obj.id}`);
    } else if (code.includes('view')) {
      console.log('view', obj.id);
      const {form} = this.props
        const tempData = {
          showColums,
          showSubColums,
          tableCondition,
          realdata,
          scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
          navName,appListShowNum,backgroundStyle
        }
        sessionStorage.setItem('listviewdata', JSON.stringify(tempData))

        const {formValuesEcho} = this.state
        router.push(
          {
            pathname: `${path}/${encodeURIComponent(obj.id)}`,
            state: {
              data: obj.id?'':obj,
              formValuesEcho:{...formValuesEcho,...form.getFieldsValue(),},
              id: obj.id
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
    }
    if (btnCallBack) {
      this.setState({ renderStatus: false });
      btnCallBack({ btn, obj, parentObj });
      this.setState({ renderStatus: true });
    }
  };


  // ************ 查询框
  showSearch = () => {
    this.setState({
      showSearchModal: true,
      upOrDown: true,
    }, () => {
      this.setState({
        pullData: false
      })
    });
  };

  onClose = () => {
    this.setState({
      showSearchModal: false,
      searchLoading: false
    }, () => {
      this.setState({
        pullData: true
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

  onLeftClick = () => { // 左边按钮点击时
    const { handleLeftClick, backUrl } = this.props
    if (handleLeftClick) {
      handleLeftClick()
    } else {
      router.push(backUrl || '/dashboard/function')
    }
  }

  render() {
    const { dataSource, isLoading, searchLoading,refreshing, showSearchModal, buttons, showColums, tableCondition, subTitleName, showSubColums, pullData, navName,appListShowNum,backgroundStyle} = this.state;
    const { addPath, notAdd, visibleCommonModal, CreateModalForm, buttonsNone, xs, isShowSub, notSearch = false,locationData } = this.props;
    const rows = getColums(showColums.filter(ii => ii.listShowFlag === 1).slice(0, appListShowNum || 6), '')
    const subRows = getColums(showSubColums.filter(ii => ii.listShowFlag === 1), '')
    window.gobackurl = () => {
      this.onLeftClick()
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: xs || 8 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: xs ? 24 - xs : 16 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
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
    const actionButtons1 = buttons.filter(button => button.alias !== 'add' && button.alias !== 'view' && !button.alias.includes('justForPC') && button.alias !== 'downloadExcel' && button.action !== 4);
    const viewBtn = buttons.filter(button => button.alias === 'view');
    const checkedId = locationData && locationData.state?locationData.checkedId : ''
    const row = (rowData, sectionID, rowID) => {
      const cardStyle = {backgroundColor:rowData.id=== checkedId ?'#f0ecec':backgroundStyle ?eval(backgroundStyle):'white',border: 'solid 1px thistle'} // border: rowData.id=== checkedId?'solid 1px #d1c6c6':'solid 1px white'
      const actionButtons = btnFilter(actionButtons1, rowData)
      return (
        <div key={rowID}>
          {
            rows.length > 0 ?
              <Card className={inStyle.amCard}>
                {/* <StyleForList sectionID={sectionID} rows={rows} handleBtnClick={this.handleBtnClick(viewBtn[0], rowData)}  /> */}
                <RecordList rows={rows} rowData={rowData} checkedId={checkedId} onClick={() => { this.handleBtnClick(viewBtn[0], rowData) }} backgroundStyle={backgroundStyle} />
                {
                  actionButtons.length > 0 && !buttonsNone ?
                    <Card.Body style={cardStyle}>
                      <Flex className='flexForList'>
                        {
                          actionButtons.map(button => {
                            return (
                              <Flex.Item>
                                <Button type="primary" size='small' inline onClick={() => this.handleBtnClick(button, rowData)}>{<FormattedMessage id={`button.${button.alias}.name`} /> === `button.${button.alias}.name` ? <FormattedMessage id={`button.${button.alias}.name`} /> : button.name}</Button>
                              </Flex.Item>
                            )
                          })
                        }
                      </Flex>
                    </Card.Body> : undefined
                }

              </Card> : undefined
          }

          {
            isShowSub && subRows.length > 0 ?
              <Card>
                <Card.Header
                  title={subTitleName || '子项'}
                />
                {
                  rowData.sublist.map(sub => (
                    <Card.Body key={sub.id}>
                      {
                        subRows.map(rrow => (
                          <Row gutter={24}>
                            <Col span={24} className="view-config"><FormItem {...formItemLayout} label={rrow.key}><span>{sub[rrow.value]}</span></FormItem></Col>
                          </Row>
                        ))
                      }
                      {
                        buttons.filter(button => button.action === 4).map((button, index) => (
                          <Button
                            key={button.code}
                            size='small'
                            inline
                            style={{ margin: '5px 0px 0px 0px' }}
                            type='primary'
                            onClick={() => {
                              this.handleBtnClick(button, sub, rowData);
                            }}
                          >
                            {<FormattedMessage id={`button.${button.alias}.name`} /> === `button.${button.alias}.name` ? <FormattedMessage id={`button.${button.alias}.name`} /> : button.name
                            }
                          </Button>
                        ))
                      }
                    </Card.Body>
                  ))
                }
              </Card> : undefined
          }
        </div>
      );
    };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={this.onLeftClick}
          rightContent={[
            tableCondition.length>0 && <Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.showSearch()} />,
            !notAdd && <Icon key="1" type="plus" size='sm' onClick={() => router.push(addPath)} />,
          ]}
        ><span style={{ color: '#108ee9' }}>{navName}</span>
        </NavBar>
        <div className="am-list">
          <ListView
            dataSource={dataSource}
            renderFooter={() => (
              <Loading isLoading={isLoading} />
            )}
            renderRow={row}
            renderSeparator={separator}
            pageSize={5}
            useBodyScroll
            pullToRefresh={pullData ? <PullToRefresh
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            /> : undefined}
            scrollRenderAheadDistance={500}
            onEndReached={(e) => this.onEndReached(e)}
            onEndReachedThreshold={10}
            style={{ padding: 8 }}
          />
        </div>

        <Modal
          visible={showSearchModal}
          transparent
          maskClosable={!searchLoading}
          onClose={() => this.onClose()}
          popup
          animationType='slide-down'
          platform='android'
        >
          {this.renderSearchForm(tableCondition)}
          <div style={{ marginTop: '8px', float: 'right', display: 'flex' }}>
            <Button type="primary" size='small' loading={searchLoading} inline onClick={() => {this.query(1); this.setState({ searchLoading: true });}} style={{ marginLeft: '8px' }}>查询</Button>
            <Button type="primary" size='small' inline onClick={() => this.reset()} style={{ marginLeft: '15px' }}>重置</Button>
          </div>
        </Modal>
        {
          visibleCommonModal && typeof CreateModalForm === 'function' ? CreateModalForm(showColums, showSubColums) : undefined
        }
      </div>
    );
  }
}

export default MatrixListViewTable;
