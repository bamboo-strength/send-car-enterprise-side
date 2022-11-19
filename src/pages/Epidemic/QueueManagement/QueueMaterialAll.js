import React, { PureComponent } from 'react';
import { ListView, PullToRefresh, NavBar, Toast, WhiteSpace, Modal} from 'antd-mobile';
import { Form, Icon, Button,Card,Switch } from 'antd';
import router from 'umi/router';
import func from '@/utils/Func';
import { connect } from 'dva';
import Text from 'antd/es/typography/Text';
import { list,submit } from '@/services/queuemanagement';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { AntOutline, } from 'antd-mobile-icons'
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import { EmptyData, InTheLoad } from '@/components/Stateless/Stateless';

const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

@connect(({ merDriver }) => ({
  merDriver,
}))
@Form.create()
class QueueMaterialAll extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      modifyvisible:false,
      modifyId:'',
      callParameter:'',
      isLoading: true,
      hasMore: true,
      refreshing: true,
      dataSource: dataSource1,
      realdata: [],
      pageNo: 1,
      pageSize: 5,
      visible:false,
      loading:true
    };
  }

  componentWillMount() {
    this.getData(false, {});
  }

  getData(ref, param, coalName) {
    const { pageNo, pageSize, dataSource, realdata } = this.state;
    param.current = pageNo;
    param.size = pageSize;
    param.id= '';
    param.isall=1;
    param.coalName=(coalName===undefined?'':coalName)
    list(param).then(resp => {
      this.setState({
        loading:false
      })
      const tempdata = typeof resp.data === 'string' ? (func.notEmpty(resp.data) ? JSON.parse(resp.data) : []) : (func.notEmpty(resp.data) ? resp.data : []);
      const len = tempdata.length;
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false,
          visible:false
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
          visible:false
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
    const { form, } = this.props;
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

  // 取消
  hideModal = () => {
    this.setState({
      modifyvisible:false
    })
  };

  onSearch=()=>{
    const {form} = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err){
        this.getData(true, {},values.coalName)
      }
    })
  }

  onOK = () => {
    const {form}=this.props
    const {modifyId}=this.state
    form.validateFieldsAndScroll((err, values) => {
      if(!err){
        submit({id:modifyId,callParameter:values.callParameter}).then((res)=>{
          if(res.success){
            this.setState({
              modifyvisible:false
            })
            Toast.success('操作成功')
            this.query(true, {});
          }
        })
      }
    })

  };

  toSetting=(rowData)=>{
    // e.stopPropagation();
    // router.push('/epidemic/modifysettings')

    this.setState({
      modifyvisible:true,
      callParameter:rowData.callParameter,
      modifyId:rowData.id
    })

  }

  toView = (id) => {
    router.push(`/epidemic/queuemanagementview/${id}`)
  };

  onChange=(e,rowData)=>{
    // coalSwitch
    submit({id:rowData.id,coalSwitch:e===true?0:1}).then((res)=>{
      if(res.success){
        Toast.success(`操作成功，已${e === true?'开启':'停止'}${rowData.coalName}的排队申请`)
        this.query(true, {});
      }
    })
  }

  render() {
    const { loading,callParameter,dataSource, isLoading, refreshing, modifyvisible,visible} = this.state;
    const { form } = this.props;
    const separator = (sectionID, rowID) => (<div
      key={`${sectionID}-${rowID}`}
      style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',
      }}
    />);

    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID}>
          <Card
            title={
              <div style={{ fontWeight:'600',fontSize:'large',}}>
                <AntOutline style={{ marginRight: '4px', color: '#1677ff' }} />
                {rowData.coalName}
              </div>
              }
            extra={
              <div>
                <Switch checked={rowData.coalSwitch===0} onChange={(e)=>this.onChange(e,rowData)} />
              </div>
              }
            bordered={false}
            size='small'
          >
            <div style={{ display: 'flex',flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3 style={{margin:('0px 0px -6px -12px')}}>&nbsp; 排队中<Text style={{color:'#FFA500'}}>{rowData.inLine}</Text>辆</h3>
            </div>
            <WhiteSpace size="xl" />
          </Card>
          <div style={{position:'inherit'}}>
            <Modal
              // className={NetWorkLess.netWorkModal}
              visible={modifyvisible}
              title='修改设置'
              width={350}
              mask={false}
              // transparent
              onCancel={this.hideModal}
              // wrapProps={{ onTouchStart: this.onWrapTouchStart }}
              onOk={()=>this.onOK(rowData)}
              destroyOnClose
            >
              <div>
                <MatrixMobileInput id='callParameter' numberType='isIntGtZero' maxLength='5' initialValue={callParameter} required label='每次叫号' placeholder='请输入每次叫号辆数' extra='辆' moneyKeyboardAlign='left' className='list-class' form={form} />
                <WhiteSpace size="xl" />
              </div>
            </Modal>
          </div>
        </div>
      );
    };
    const {_cachedRowCount} = dataSource
    const listView = loading?<InTheLoad />: _cachedRowCount !== 0?(
      <ListView
        ref={el => this.lv = el}
        dataSource={dataSource}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>{isLoading ? '加载中...' :'加载完毕'}</div>)}
        renderRow={row}
        renderSeparator={separator}
        pageSize={4}
        useBodyScroll
        pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
        scrollRenderAheadDistance={500}
        // onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    ):<EmptyData text='暂无叫号车辆' />;

    const ifFromOtherSite = localStorage.getItem('ifFromOtherSite');
    return (
      <div>
        {
          ifFromOtherSite === 'ok' ? undefined :
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => router.push('/dashboard/function')}
            rightContent={<Icon type="search" onClick={()=>this.setState({visible:true})} />}
          >叫号管理(全部)
          </NavBar>
        }
        {/* <div className={ifFromOtherSite === 'ok' ? 'am-list-nestPage' : 'am-list'}> */}
        <div className={ifFromOtherSite === 'ok' ? 'am-list-nestPage' : 'am-list'}>
          {listView}
          <Modal
            visible={visible}
            transparent
            maskClosable
            onClose={()=>this.setState({visible:false})}
            popup
            animationType='slide-down'
            platform='android'
          >
            <div style={{marginTop:'8px'}}>
              <MatrixInput id='coalName' maxLength='15' label='物资名称' placeholder='请输入物资名称' form={form} />
            </div>
            <div style={{marginTop:'8px',float:'right'}}>
              <Button type="primary" size='small' inline onClick={() =>this.onSearch()} style={{marginLeft:'8px'}}>查询</Button>
              <Button type="primary" size='small' inline onClick={() =>this.reset()} style={{marginLeft:'15px'}}>重置</Button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default QueueMaterialAll;
