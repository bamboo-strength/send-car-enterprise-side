import React, { PureComponent } from 'react';
import { ListView, PullToRefresh, NavBar } from 'antd-mobile';
import { Card, Form, Icon, Modal } from 'antd';
import router from 'umi/router';
import func from '@/utils/Func';
import { page } from '../../services/NetContract';
import NetWork from '../../components/NetWorks/NetWork.less';
import Text from 'antd/es/typography/Text';
import { connect } from 'dva';
import { getCurrentUser, getToken } from '@/utils/authority';
import { MERDRIVER_DETAIL } from '../../actions/merDriver';
import { getBaseUrl } from '@/pages/Merchants/commontable';

const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

@connect(({ merDriver }) => ({
  merDriver,
}))
@Form.create()
class ContractManage extends PureComponent {

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
    };
  }

  componentWillMount() {
    this.getData(false, {});
    const { dispatch } = this.props;
    dispatch(MERDRIVER_DETAIL(getCurrentUser().userId));
  }

  getData(ref, param) {
    const { pageNo, pageSize, dataSource, realdata } = this.state;
    param.current = pageNo;
    param.size = pageSize;
    page(param).then(resp => {
      const tempdata = typeof resp.data === 'string' ? (func.notEmpty(resp.data) ? JSON.parse(resp.data) : []) : (func.notEmpty(resp.data.records) ? resp.data.records : []);
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

  ViewContract = (e, rowData) => {
    e.stopPropagation();
    const a1 = {
      'contractId': rowData.contractId,
      'contractNo': rowData.contractNo,
      'signerId': rowData.signerId,
      'flag': 'false',
    };
    // const address = `${getBaseUrl()}/contract-sign/${getToken()}/${JSON.stringify(a1)}`;
    // window.location.href = address;
    router.push(`/network/waybill/contractview/${rowData.waybillid}`)
  };

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

  render() {
    const { dataSource, isLoading, refreshing } = this.state;
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
      let actions = ([]);
      actions = ([
        <div style={{ color: '#1890FF' }} onClick={(e) => this.ViewContract(e, rowData)}>查看合同</div>,
      ]);
      return (
        <div key={rowID}>
          <Card
            title={<Text style={{ color: '#1890FF' }}>合同ID：{rowData.id}</Text>}
            extra={<div>签订完成</div>}
            bordered={false}
            size='small'
            actions={actions}
            rowData={rowData}
          >
            <p style={{ display: 'flex', justifyContent: 'space-between' }}><h3>{'甲方：山西物迹福达科技有限公司'}</h3>----<h3>{'乙方:'}{rowData.carrier}</h3>
            </p>

            <div><Text type="secondary">运单编号：{rowData.waybillString}</Text></div>
            <div><Text type="secondary">物资信息：{rowData.materialName} {}</Text></div>
          </Card>
        </div>
      );
    };

    const listView = (
      <ListView
        ref={el => {
          this.lv = el;
        }}
        dataSource={dataSource}
        renderFooter={() => (
          <div style={{ padding: 30, textAlign: 'center' }}>
            {isLoading ? '加载中...' : '加载完毕'}
          </div>)}
        renderRow={row}
        renderSeparator={separator}
        pageSize={4}
        useBodyScroll
        pullToRefresh={<PullToRefresh
          refreshing={refreshing}
          onRefresh={this.onRefresh}
        />}
        scrollRenderAheadDistance={500}
        onEndReached={() => this.onEndReached}
        onEndReachedThreshold={10}
      />
    );
    const ifFromOtherSite = localStorage.getItem('ifFromOtherSite')

    return (
      <div id={NetWork.netWork}>
        {
          ifFromOtherSite === 'ok'?undefined:
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => router.push('/dashboard/freight')}
          >合同管理
          </NavBar>
        }

        <div className={ifFromOtherSite === 'ok'?'am-list-nestPage':'am-list'}>
          {listView}
        </div>
      </div>
    );
  }
}

export default ContractManage;
