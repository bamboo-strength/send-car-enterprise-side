import { ListView, PullToRefresh,NavBar, Card, SearchBar } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Col, Form, Icon, Row } from 'antd';
import { COMMONBUSINESS_LIST, COMMONBUSINESS_SUBMIT } from '../../../actions/commonBusiness';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import func from '@/utils/Func';
import { getColums } from '../commontable';
import MatrixSelect from '../../../components/Matrix/MatrixSelect';

const FormItem = Form.Item;

@connect(({ commonBusiness,tableExtend,loading }) =>({
  commonBusiness,
  tableExtend,
  loading:loading.models.commonBusiness,
}))
@Form.create()
class CommonBringDataByParam extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      showColums: [],
      isLoading: false,
      hasMore: true,
      refreshing: true,
      dataSource,
      realdata: [],
      pageNo: 1,
      pageSize: 5,
      searchParam: undefined,
      NavBarName:''
    };
  }

  componentWillMount() {
    const {
      dispatch,form,
      match: {
        params: { tableName,modulename },
      }, } = this.props;
    form.resetFields()
    dispatch(TABLEEXTEND_COLUMNLIST({'tableName': tableName,'modulename':modulename,queryType:1})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(func.notEmpty(data.columList)){
          const aa=data.columList;
          let tc=''
          if (aa.table_main.length > 0){
            tc=aa.table_main[0].tableAlias
          }
          this.setState({
            showColums: aa.table_main,
            NavBarName:tc
          })
        }
      }
    })
  }

  getData(ref, param) {
    const { dispatch, match: {
      params: { modulename,tableName},
    },} = this.props;
    const { pageNo, pageSize, dataSource, realdata, searchParam } = this.state;
    param.current = pageNo;
    param.size = pageSize;
    param[modulename] = !searchParam? undefined : searchParam;
    dispatch(COMMONBUSINESS_LIST({tableName,modulename,queryParam:param})).then(() => {
      // console.log(this.props)
      const { commonBusiness: { data } } = this.props;
      const tempdata = data.list;
      const len = tempdata.length;
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false,
        });
        //  Toast.info('没有多余的数据', 1)
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

  // 下拉刷新
  onRefresh = () => {
    this.setState({
      refreshing: true,
      isLoading: true,
      pageNo: 1,
    }, () => {
      this.getData(true, {});
    });
  };

  onEndReached = (event) => {
    const { isLoading, hasMore, pageNo } = this.state;
    if (isLoading && !hasMore) {
      return;
    }
    this.setState({
      isLoading: true,
      pageNo: pageNo + 1, // 加载下一页
    }, () => {
      this.getData(false, {});
    });
  };

  queryByParam = (param) => {
    this.setState({
      searchParam: param,
    }, () => {
      this.getData(true, {});
    });
  };

  subMethod=(rowData)=>{
    const {form,dispatch,match: {
      params: { modulename,tableName},
    }} = this.props
    form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }
      const params = {
        ...rowData,
        ...fieldsValue,
      }
      dispatch(COMMONBUSINESS_SUBMIT({tableName,modulename,submitParams:params,btnCode:'submit'}))
    });
  }

  render() {
    const { dataSource, isLoading, refreshing, showColums,NavBarName } = this.state;
    const {form} = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 16 },
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
    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID}>
          <Card full>
            <Card.Body key={sectionID}>
              <Row gutter={24}>
                {
                  showColums.map(rrow => (
                    <Col span={24} className="view-config">
                      {
                        rrow.category !== 1?
                          <FormItem {...formItemLayout} label={rrow.columnAlias}>
                            <span style={{color: 'rgba(0, 0, 0, 0.85)'}}>{rowData[func.notEmpty(rrow.showname)?rrow.showname:rrow.columnName]}</span>
                          </FormItem>:
                          <MatrixSelect label={rrow.columnAlias} placeholder={rrow.placeholder} id={rrow.columnName} dictCode={rrow.dickKey} required={rrow.isrequired} initialValue={rrow.initialvalue} style={{width: '100%'}} disabled={rrow.isReadonly} labelId={rrow.showname} form={form} />
                      }
                    </Col>
                  ))
                }
              </Row>
            </Card.Body>
          </Card>
          <Button icon='/image/plus.png' style={{lineHeight:'2',marginTop:'20px'}} type="primary" onClick={()=>this.subMethod(rowData)} block>
            提交
          </Button>
        </div>
      );
    };


    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/function')}
        >{NavBarName}
        </NavBar>
        <div className='am-list'>
          <SearchBar
            maxLength={8}
            placeholder="请输入信息查询"
         //   onChange={(e) => this.queryByParam(e)}
            onCancel={(e) => this.queryByParam(e)}
            showCancelButton
            cancelText='查询'
          />
          <ListView
            ref={el => this.lv = el}
            dataSource={dataSource}
            // renderHeader={serarchForm}
            renderFooter={() => (
              <div style={{ padding: 30, textAlign: 'center' }}>
                {isLoading ? '加载中...' : '没有多余的数据'}
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
        </div>
      </div>
    );
  }
}

export default CommonBringDataByParam;
