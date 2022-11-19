import React, { PureComponent } from 'react';
import {ListView,Flex, Card,PullToRefresh,NavBar,List,Checkbox,Modal} from 'antd-mobile';
import { Button, Icon, Col, Row, Form } from 'antd';
import { handleDate } from '@/components/Matrix/commonJs';
import { getTenantId } from '../../pages/Merchants/commontable';
import func from '@/utils/Func';
import { requestListApi,requestPostHeader } from '../../services/api';
import styles from '../../layouts/Sword.less';
import { getQueryConf } from './MatrixQueryConfig';
import { cloneDeep } from 'lodash';

const {CheckboxItem} = Checkbox;

class MatrixSearchDataTable extends PureComponent {

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
      visibleTable: false,
      expand:false,
      title:'',
      bringData: '',
      colNames: '',
      colCode: '',
      searchPath:'',
      tableName:'',
      modulename: '',
      searchConditions:[],
      checkedData:'',
      queryParam:{}
    };
    this.queryForm ={}
  }

  componentWillMount() {
    this.props.onRef(this)
  }

  getSettingData=()=>{
    const {showColums} = this.props
    const column = showColums.filter(item => item.category === 5)
    if(column.length>0){
      const {bringData} = column[0]
      const [tableName,modulename,title,searchPath] = column[0].dickKey.split(',')  // tableName,modulename,title,searchPath
      const params = {
        'tableName': tableName,
        'modulename': modulename,
        queryType: 1,
        tenantId: getTenantId(),
      }
      params['Blade-DesignatedTenant'] = getTenantId()
      requestListApi('/api/mer-tableextend/tableExtend/queryList', params).then(resp => {
        if (resp.success) {
          const data = resp.data.table_main
          const listShowColumn = data.filter(item => item.listShowFlag === 1)
          const colNames = listShowColumn.map(v => v.columnAlias).slice(0,6)
          const colCode = listShowColumn.map(v => func.notEmpty(v.showname) ? v.showname : v.columnName)
          // const hideColCode = data.filter(item => item.listShowFlag === 1).map(v =>func.notEmpty(v.showname)?v.columnName:'')
          this.setState({
            bringData,
            colNames,
            colCode,
            title,
            tableName,
            modulename,
            searchPath,
            searchConditions: data.filter(item => item.conditionflag >0),
          }, () => {
            this.getData(true, {});
          })
        }
      });
    }
  }


  getData(ref, param) {
    const { searchPath,pageNo, pageSize, dataSource, realdata,tableName,modulename,searchConditions } = this.state;
    const params = param
    params.current = pageNo;
    params.size = pageSize;

    if(func.notEmpty(searchConditions)){
      searchConditions.forEach((item) => {
        if (item.conditionflag === 2) {
          func.addQuery(params, item.columnName, '_like');
        }

        if(item.category ===8){ // 组织机构 添加equal 主要对接砂石使用
          params[`${item.columnName}_equal`] = params[item.columnName]?params[item.columnName].toString():undefined
          delete params[item.columnName];
        }
        if (func.notEmpty(item.showname)) {
          delete params[item.showname];
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
          }else if(item.conditionflag === 1) {
            params[item.columnName] = dateValue
          }else {
            params[item.columnName] = dateValue;
          }
        }
      });
    }
    let aa={}
    if(searchPath === '/api/mer-tableextend/commonBusiness/selectpage'){  // 通用业务查询
      params['Blade-DesignatedTenant'] = getTenantId()
      delete params.headers
      aa = {queryParam:params,tableName,modulename }
    }else {
      aa = {...params}
    }

    requestPostHeader(searchPath, aa).then(resp => {
      let tempdata =[]
      if(func.notEmpty(resp)){
        tempdata = typeof resp.data === 'string'?(func.notEmpty(resp.data)?JSON.parse(resp.data):[]):(func.notEmpty(resp.data.records)?resp.data.records:[])
      }
      tempdata = tempdata.filter(d => { return d.id !== -1 })
      const len = tempdata.length;
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false,
        });
      }
      if (ref) {
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: tempdata,
        });
      } else {
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

  query = (flag, param) => {
    const {queryParam} = this.state
    const values = {
      ...param,
      ...queryParam
    };
    this.getData(flag, values);
  };

  onRefresh = () => {
    this.setState({
      refreshing: true,
      isLoading: true,
      pageNo: 1,
    }, () => {
      this.query(true, {});
    });
  };

  onEndReached = (event) => {
    // event.preventDefault();
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


  showModal = (params, record, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({
      visibleTable: true,
    });
    // console.log(document.getElementsByClassName('am-list')[0])
    document.getElementsByClassName('commonAdd')[0].style.display = 'none'
    this.getSettingData()
  };

  handleCancel = () => {
    this.setState({
      visibleTable: false,
    });
    this.queryForm = {}
    document.getElementsByClassName('commonAdd')[0].style.display = 'block'
  };

  bringData=(rowData,bringData,rowID)=>{
    const {handleOkBefore} = this.props
    const {form} = this.props
    let data1=[];
    let data2=[];
    let fromSubData=false
    if(bringData){
      const splitData = bringData.split('|')
      data1 = splitData[0].split(',')
      data2 = splitData[1].split(',')
      fromSubData = !!(splitData[2] && splitData[2].includes('_sub'))
    }

    data1.forEach((item,key) => {
      form.setFieldsValue({
        [item]:rowData[data2[key]]
      })
    })
    if(typeof handleOkBefore === 'function'){
      const rowDatas = []
      rowDatas.push(rowData)
      handleOkBefore(rowDatas,fromSubData)
    }
    this.setState({
      visibleTable: false,
      checkedData:rowID
    });
    this.queryForm = {}
    document.getElementsByClassName('commonAdd')[0].style.display = 'block'
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };


  CreateFormManFun=()=>{
    const {searchConditions,} = this.state
    const QueryItems = Form.create()(props => {
      const form1 = props.form

      const queryNew = (flag, param) => {
        form1.validateFields(async (err, values) => {
          const rparam = param || values
          this.setState({
            pageNo: 1,
            queryParam:rparam
          }, () => {
            this.queryForm = cloneDeep(rparam)
            this.getData(true, rparam);
            this.toggle()
          });
        });
      };
      const reset = () => {
        form1.resetFields()
        this.setState({
          pageNo:1
        }, ()=> {
          queryNew(true,{})
        })
      }

      return(
        <div style={{background: 'white',padding: '10px 23px 0px 20px'}}>
          <div style={{minHeight: '260px'}}>
            {getQueryConf(searchConditions,form1,{},8,this.queryForm)}
          </div>
          <Row>
            <Col>
              <div style={{ float: 'right' }}>
                <Button type="primary" htmlType="submit" onClick={()=>queryNew(true, )}>
                  查询
                </Button>
                <Button style={{ margin: '0px 0px 5px 5px'  }} onClick={()=>reset(true, {})}>
                  重置
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )
    })
    return <QueryItems />
  }


  render() {
    const { visibleTable,dataSource,isLoading, refreshing,bringData,title,colNames,colCode,checkedData,expand } = this.state
    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID}>
          {
            <Card className='listView'>
              <Card.Body>
                <List>
                  <CheckboxItem key={rowID} onChange={() => this.bringData(rowData,bringData,rowID)} checked={checkedData === rowID}>
                    {
                      Object.keys(colNames).map(key => (
                        <div key={key}>
                          <span className={styles.tdTitle}>{colNames[key]}：</span>
                          <span className={styles.tdContent}>{rowData[colCode[key]]}</span>
                        </div>
                      ))
                    }
                  </CheckboxItem>
                </List>
              </Card.Body>
            </Card>
          }
        </div>
      );
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
    return (
      <div>
        {
          visibleTable?
            <div>
              <NavBar
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={() => this.handleCancel()}
                rightContent={[
                  <Icon key="0" type="search" style={{ marginRight: '16px',fontSize:'18px' }} onClick={() => this.toggle()}></Icon>,
                ]}
              ><span style={{ color: '#108ee9' }}>{title || '选择'}</span>
              </NavBar>
              <ListView
                dataSource={dataSource}
                className='am-list'
                renderFooter={() => (
                  <div style={{ padding: 30, textAlign: 'center' }}>
                    {isLoading ? '加载中...' : '加载完毕'}
                  </div>)}
                renderRow={row}
                renderSeparator={separator}
                //  className="am-list"
                pageSize={5}
                useBodyScroll
                pullToRefresh={<PullToRefresh
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                />}
                scrollRenderAheadDistance={800}
                onEndReached={()=>this.onEndReached()}
                onEndReachedThreshold={10}
              />
              {
                expand &&
                <Modal
                  visible={expand}
                  transparen
                  maskClosable
                  onClose={() => this.toggle()}
                  popup
                  animationType='slide-down'
                  platform='android'
                >
                  {this.CreateFormManFun()}
                </Modal>
              }


            </div>:undefined
        }
      </div>
    )
  }

}
export default MatrixSearchDataTable
