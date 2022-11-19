import { Button, ListView, Modal, NavBar } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import { Card, Form, Icon } from 'antd';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import func from '@/utils/Func';
import { paramByColumnSetting } from '@/components/Matrix/commonJs';
import { getQueryConf } from '../../components/Matrix/MatrixQueryConfig';
import { contractPay, getPrice } from '@/services/commonBusiness';
import { EmptyData, InTheLoad } from '@/components/Stateless/Stateless';
import { COMMONBUSINESS_LIST } from '@/actions/commonBusiness';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';

@connect(({ commonBusiness, tableExtend, loading }) => ({
  commonBusiness,
  tableExtend,
  loading: loading.models.commonBusiness,
}))

@Form.create()
class PayHomePage extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      tableName: 'shashi_dinas_sale_weight',
      moduleName: 'query',
      tableCondition: [],
      dataSource,
      loading: true,
    };
  }

  componentDidMount() {
    const { tableName, moduleName } = this.state;
    const { dispatch } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({ 'tableName': tableName, 'modulename': moduleName, queryType: 0 })).then(() => {
      const { tableExtend: { data } } = this.props;
      if (data !== undefined && func.notEmpty(data.columList)) {
        const aa = data.columList;
        this.setState({
          tableCondition: aa.table_condition,
        }, () => {
          const queryParam = paramByColumnSetting(aa.table_condition);
          queryParam.current = 1;
          queryParam.size = 5;
          this.getDatas(queryParam);
        });
      }
    });
  }

  getDatas = (queryParam) => {
    const { tableName, moduleName, dataSource } = this.state;
    const { dispatch } = this.props;
    queryParam.current = 1;
    queryParam.size = 5;
    if (typeof queryParam.startDate === 'object') {
      queryParam.startDate = func.format(queryParam.startDate);
      queryParam.endDate = func.format(queryParam.endDate);
    }
    dispatch(COMMONBUSINESS_LIST({ tableName, 'modulename': moduleName, 'queryParam': queryParam })).then(() => {
      const {
        commonBusiness: { data },
      } = this.props;
      this.setState({
        loading: false,
      });
      const tempdata = data.list;
      const newlist = tempdata ? tempdata.filter(d => {
        return d.id !== -1;
      }) : [];
      if (queryParam) {
        this.setState({
          dataSource: dataSource.cloneWithRows(newlist),
        });
      }
    });
  };


  onClick = (item) => {
    getPrice({
      chanCode: 16,
      price: item.price,
      deptId:item.deptId,
      materialno:item.materialno,
      netweight:item.netweight,
      weightno:item.weightno
    }).then(resp =>{
      if (resp.success){
        const msg = (
          <div>
            <p>实时单价(元/吨)：{resp.data.unitPrice.toFixed(2)}</p>
            <p>过磅净重（吨）：{resp.data.netweight.toFixed(2)}</p>
            <p>应付金额（元）：{resp.data.paymentAmount.toFixed(2)}</p>
          </div>
        )
        Modal.alert('是否确定支付？',
          msg,
          [
            {text:'取消',onPress:()=>{}},
            {text:'确定',onPress:()=>{
                contractPay({
                  rebackUrl: '/paygoods/payhomepage',
                  chanCode: 16,
                  deptId:item.deptId,
                  licensePlate: item.vehicleno,
                  materialno:resp.data.materialno,
                  price: resp.data.unitPrice,
                  netweight:resp.data.netweight,
                  weightno:resp.data.weightno,
                  paymentAmount: resp.data.paymentAmount,
                }).then(resps => {
                  if (resps.success) {
                    window.open(resps.data, '_self');
                  }
                });
              }
            },
          ])
      }
    })
  };

  reset = () => {
    const { form } = this.props;
    form.resetFields();
    this.query();
  };

  // 查询框
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
    const queryItem = getQueryConf(tableCondition, form, {}, 9);
    return (
      <div style={{ minHeight: '260px' }}>
        {queryItem}
      </div>
    );
  };

  query = () => {
    const { form } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      const values = {
        ...fieldsValue,
      };
      this.getDatas(values);
      this.onClose();
    });
  };

  render() {
    const { showSearchModal, tableCondition, dataSource, loading,showmodal } = this.state;
    const condation = tableCondition.filter(item => item.columnName !== 'custno' && item.columnName !== 'materialno' && item.columnName !== 'contractno');
    const { _cachedRowCount } = dataSource;
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
    const row = (item, sectionID, rowID) => {
      const {balanceMoney,deptName,materialName,price,netweight,grosstime} = item
      return (
        <div key={rowID}>
          <Card
            title={`派车单号：${item.dispatchId}`}
            bordered={false}
            // actions={(balanceMoney * 1 > 0) &&[<a onClick={()=>this.onClick(item)} style={{ color: '#108ee9' }}>立即支付</a>,]}
            actions={item.loadtype===1&&[<a onClick={()=>this.onClick(item)} style={{ color: '#108ee9' }}>立即支付</a>,]}
          >
            <Form>
              <MatrixListItem label="所属机构" title={deptName} />
              <MatrixListItem label="物资" title={materialName} />
              <MatrixListItem label="单价(元/吨)" title={price} />
              <MatrixListItem label="净重(吨)" title={netweight} />
              <MatrixListItem label="重车时间" title={grosstime} />
              <MatrixListItem label="总金额(元)" title={balanceMoney} />
            </Form>
          </Card>
        </div>
      );
    };
    const height = 'calc( 100vh - 200px)';
    const listView = loading ? <InTheLoad height={height} /> : (
      _cachedRowCount !== 0 ? (
        <ListView
          ref={el => {
            this.lv = el;
          }}
          dataSource={dataSource}
          renderRow={row}
          useBodyScroll
          renderSeparator={separator}
          style={{ overflow: 'auto' }}
          distanceToRefresh='20'
          pageSize={5}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={30}
        />
      ) : <EmptyData text="暂无支付记录" height={height} />
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            window.history.back();
          }}
          rightContent={[
            <Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.showSearch()} />,
          ]}
        >支付货款
        </NavBar>
        <div className='am-list'>
          {listView}
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
        <div>
          <Modal
            visible={showmodal}
            transparent
            maskClosable
            onClose={() => this.onClose()}
            popup
            animationType='slide-down'
            platform='android'
          >
            111
            <div style={{ marginTop: '8px', float: 'right' }}>
              <Button type="primary" size='small' inline onClick={() => this.query()} style={{ marginLeft: '8px' }}>确定</Button>
              <Button type="primary" size='small' inline onClick={() => this.reset()} style={{ marginLeft: '15px' }}>取消</Button>
            </div>
          </Modal>
        </div>

      </div>
    );
  }
}

export default PayHomePage;
