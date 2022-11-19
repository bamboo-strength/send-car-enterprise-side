import {
  ListView,
  Toast,
  PullToRefresh,
  Button,
  Modal,
  NavBar,
  Icon,
} from 'antd-mobile';
import React, { Fragment } from 'react';
import router from 'umi/router';
import { FormattedMessage } from 'umi/locale';
import { getButton } from '../../utils/authority';
import { requestApi } from '../../services/api';
import func from '@/utils/Func';
import styles from '../../layouts/Sword.less';
import Loading from '../Loading/Loading';
import '../../global.less'

const { alert } = Modal;

class MatrixListView extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
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
      upOrDown: true,
    };
  }

  componentDidMount() {
    this.getDatas({});
  }

  componentWillReceiveProps(nextProps) {
    // console.log(document.referrer,'+++++++++++++')
    const { data } = this.props;
    const { upOrDown } = this.state;
    const newlist = nextProps.data.list;
    if (!upOrDown) {  // 上拉加载
      if ((newlist.length !== data.list.length) || (newlist.length > 0 && data.list.length > 0 && data.list[0].id !== newlist[0].id)) {
        //   console.log('000000000000')
        this.getreDatas(newlist);
      } else if (newlist.length === 0) {
        this.getreDatas(newlist);
         /* console.log('11111111111111') */
      } else {
        this.getreDatas(null);
        //  console.log('2222222222222')

      }
    } else {
      this.getreDatas(newlist);
      /* console.log('3333333333333');*/
    }
  }

  getDatas = (param) => {
    const { getDataFromPa } = this.props;
    const { pageNo, pageSize } = this.state;
    param.current = func.notEmpty(param.pageNo) ? param.pageNo : pageNo;
    param.size = pageSize;
    delete param.pageNo;
    getDataFromPa(param);
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
        // Toast.info('没有多余的数据', 1)
        //    return false
      }
      // console.log(upOrDown);
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
        // console.log(dataArr);
      }
    } else {
      this.setState({
        // refreshing: false,
        // isLoading: false,
        hasMore: false,
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
      this.getDatas({ pageNo: 1 });
    });
  };

  onEndReached = (event) => {
    const { isLoading, hasMore, pageNo } = this.state;
    if (isLoading && !hasMore) {
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

  query = (pp) => {
    const { form } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        pageNo: pp,
      };
      this.setState({
        pageNo: pp,
      }, () => {
        this.getDatas(values);
        this.onClose();
      });
    });
  };

  reset = () => {
    const { form } = this.props;
    form.resetFields();
    this.onRefresh();
    // this.getDatas({pageNo:1})
  };

  handleBtnClick = (btn, obj) => {
    const { path, alias } = btn;
    const { btnCallBack } = this.props;
    // console.log(btn);

    if (alias === 'edit') {
      router.push(`${path}/${obj.id}`);
    } else if (alias === 'view') {
      router.push(`${path}/${obj.id}`);
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
    }
    if (btnCallBack) {
      btnCallBack({ btn, obj });
    }
  };


// ************ 查询框
  showSearch = () => {
    this.setState({
      showSearchModal: true,
      upOrDown: true,
    });
  };

  onClose = () => {
    this.setState({
      showSearchModal: false,
    });
  };

  render() {
    const { dataSource, isLoading, refreshing, showSearchModal, buttons } = this.state;
    const { navName, rows, renderSearchForm, addPath, notAdd,notice,backUrl } = this.props;
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

    let rightContent = []
    if (notice === "menu"){
      rightContent = [];
    }else {
      rightContent = [
        <Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.showSearch()} />,
        notAdd ? undefined : <Icon key="1" type="plus" size='sm' onClick={() => router.push(addPath)} />,
      ]
    }

    const actionButtons = buttons.filter(button => button.alias !== 'add' && button.alias !== 'import');
    // console.log(actionButtons,'=========actionButtons')
    const row = (rowData, sectionID, rowID) => {

      return (
        <div key={rowID} style={{ padding: '15px 15px' }}>
          <div style={{ lineHeight: 2.5 }}>
            <table style={{ width: '100%' }}>
              <tbody>{
                rows.map(rrow => (
                  <tr key={rrow.value} style={{ width: '100%', display: 'flex' }}>
                    <td className={styles.tdTitle}>{rrow.key}：</td>
                    <td className={styles.tdContent}> {rowData[rrow.value]}</td>
                  </tr>
                ))
              }
              </tbody>
            </table>
            <div style={{ marginTop: '5px', clear: 'both' }}>
              {
                actionButtons
                  .map((button, index) => (
                    <Button
                      key={button.code}
                      //  icon={button.source}
                      size='small'
                      inline
                      style={{ margin: '0px 8px' }}
                      type={
                        button.alias === 'delete' || button.alias === 'remove'
                          ? 'warning'
                          : 'primary'
                      }
                      onClick={() => {
                        this.handleBtnClick(button, rowData);
                      }}
                    >
                      <FormattedMessage id={`button.${button.alias}.name`}/>
                    </Button>
                  ))
              }
            </div>
          </div>
        </div>
      );
    };
    return (
      <div className='outBasicStyle'>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(backUrl || '/dashboard/function')}
          rightContent={rightContent}
        ><span style={{ color: '#108ee9' }}>{navName}</span>
        </NavBar>
        <ListView
          // ref={el => this.lv = el}
          dataSource={dataSource}
          renderFooter={() => (
            <Loading isLoading={isLoading} />
            /* <div style={{ padding: 30, textAlign: 'center' }}>
              {isLoading ? '加载中...' : '加载完毕'}
            </div> */
          )}
          renderRow={row}
          renderSeparator={separator}
          className="am-list"
          pageSize={4}
          useBodyScroll
          pullToRefresh={
            <PullToRefresh
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
        <Modal
          visible={showSearchModal}
          transparent
          maskClosable
          onClose={() => this.onClose()}
          popup
          animationType='slide-down'
          platform='android'
        >
          {renderSearchForm()}
          <div style={{ marginTop: '8px', float: 'right' }}>
            <Button type="primary" size='small' inline onClick={() => this.query(1)} style={{ marginLeft: '8px' }}>查询</Button>
            <Button type="primary" size='small' inline onClick={() => this.reset()} style={{ marginLeft: '15px' }}>重置</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default MatrixListView;
