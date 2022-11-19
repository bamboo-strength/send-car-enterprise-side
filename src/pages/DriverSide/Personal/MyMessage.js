import { Button, Card, List, ListView, Modal, NavBar, PullToRefresh } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Icon } from 'antd';
import { MYMESSAGE_LIST } from '../../../actions/myMessage';
import MatrixSelect from '@/components/Matrix/MatrixSelect';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { getCurrentUser } from '@/utils/authority';

const {Item} = List

@connect(({myMessage,loading}) => ({
  myMessage,
  loading: loading.models.myMessage,
}))
@Form.create()
class MyMessage extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      isLoading: true,
      hasMore:true,
      refreshing: true,
      dataSource,
      realdata: [],
      pageNo: 1,
      pageSize: 5,
      showSearchModal:false,
    };
  }

  componentWillMount() {
    this.getData(false,{})
  }

  getData(ref,param) {
    const { dispatch } = this.props;
    const {pageNo,pageSize,dataSource,realdata} =this.state
    param.current=pageNo
    param.size=pageSize
    dispatch(MYMESSAGE_LIST(param)).then(() => {
      // console.log(this.props)
      const { myMessage: {data} } = this.props;
      const tempdata = data.list
      const len = tempdata.length
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false
        })
        //  Toast.info('没有多余的数据', 1)
      }
      if (ref) {
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: tempdata
        })
      } else {
        const dataArr = realdata.concat(tempdata)
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(dataArr),
          refreshing: false,
          isLoading: false,
          realdata: dataArr
        })
      }
    })
  }

  query = (flag,param) => {
    const {form} = this.props
    form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        ...param
      };
    //  console.log(values,'-----------values')
      this.getData(flag,values)
      this.onClose()
    });
  }

  reset = () => {
    const {form} = this.props
    form.resetFields()
    this.setState({
      pageNo:1
    }, ()=> {
      this.query(true,{})
    })
  }

  // 下拉刷新
  onRefresh = () => {
    this.setState({
      refreshing: true,
      isLoading: true,
      pageNo: 1
    }, ()=>{
      this.getData(true,{})
    })
  }

  onEndReached = (event) => {
    const {isLoading,hasMore,pageNo} = this.state
    if (isLoading && !hasMore) {
      return;
    }
    this.setState({
      isLoading: true,
      pageNo: pageNo + 1, // 加载下一页
    }, ()=> {
      this.getData(false,{})
    })
  }


  // ************ 查询框
  showSearch = () => {
    this.setState({
      showSearchModal:true,
    })
  }

  onClose = () => {
    this.setState({
      showSearchModal:false
    })
  }

  goReturn = ()=>{
    const tenant_id = getCurrentUser().tenantId
    if(tenant_id==='847975'){
      router.push('/dashboard/menu')
    }else {
      window.history.back();
    }
  }


  render() {
    window.gobackurl=()=>{  //  安卓物理键返回
      this.goReturn()
    }
    const {dataSource,isLoading,refreshing,showSearchModal} = this.state

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
          <Card style={{padding:'0px 15px'}}>
            <Card.Body>
              <div> <span style={{color:'blue'}}>消息标题：</span>{rowData.title}</div>
              {/* <div> 推送用户：{rowData.pushUserName}</div>
               <div> 推送消息范围：{rowData.pushScope}</div> */}
              <div> <span style={{color:'blue'}}>消息类型：</span>{rowData.msgTypeName}</div>
              {/* <div> 接收者类型：{rowData.acceptTypeName}</div>
              <div> 消息分组：{rowData.msgGroupName} </div> */}
              <div> <span style={{color:'blue'}}>消息内容：</span>{rowData.content}</div>
              <div> <span style={{color:'blue'}}>接收时间：</span>{rowData.sendTime}</div>
            </Card.Body>
          </Card>
        </div>
      );
    };

    const serarchForm = () => {
      const { form } = this.props;
      return (
        <List>
          <Item> <MatrixInput label="消息标题" placeholder="请输入消息标题" id="title" form={form} style={{width: '100%'}}  /></Item>
          <Item><MatrixSelect label="消息类型" placeholder="请选择状态" id="msgType" dictCode="messagePushType " form={form} style={{width:'100%'}} /> </Item>
          {/* <Item><MatrixSelect label="接收者类型" placeholder="请选择类型" id="acceptType" dictCode="acceptType" form={form} style={{width:'100%'}} /> </Item>
          */}
        </List>
      );
    };


    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          // onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
          onLeftClick={this.goReturn}
         /* rightContent={[
            <Icon key="0" type="search" style={{fontSize:'24px',marginRight:'20px' }} onClick={() => this.showSearch()} />,
          ]} */
        >我的消息
        </NavBar>
        <ListView
          ref={el => this.lv = el}
          dataSource={dataSource}
          // renderHeader={serarchForm}
          renderFooter={() => (
            <div style={{ padding: 30, textAlign: 'center' }}>
              {isLoading ? '加载中...' : '加载完毕'}
            </div>)}
          renderRow={row}
          renderSeparator={separator}
          className="am-list"
          pageSize={4}
          useBodyScroll
          pullToRefresh={<PullToRefresh
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

export default MyMessage;
