import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { Form } from 'antd';
import { COMMONBUSINESS_DETAIL,COMMONBUSINESS_SUBMIT } from '@/actions/commonBusiness';
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import { Modal, NavBar, Icon, Card, List,Button } from 'antd-mobile';
import { addSaveCommon} from '../../Merchants/commontable';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import router from 'umi/router';
import styles from '@/layouts/Sword.less';

const {Item} = List;
// 自助领取任务
@connect(({ commonBusiness,tableExtend, loading }) => ({
  commonBusiness,
  tableExtend,
  loading: loading.models.commonBusiness,
}))

@Form.create()

class OrderQuickly extends PureComponent {

  state = {
    selectedRows: [],
    dataSource : [],
    showColums: [],
    showSubColums:[],
    ziSaveFlag:true,
    showAddModal: false,
    selectObj: [],
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id,tableName,modulename },
      },
    } = this.props;

    dispatch(COMMONBUSINESS_DETAIL({realId: id, tableName,modulename})).then(()=>{
        const {
          commonBusiness: { detail },
        } = this.props;
        let newArr =[]
        if(func.notEmpty(detail.sublist)){
           newArr = detail.sublist.map((v,index)=>{    // 添加行号
            return {...v,'key':index+1}
          })
        }
        this.setState({
          dataSource: newArr
        })

      }
    );

    dispatch(TABLEEXTEND_COLUMNLIST({tableName,modulename,queryType:1})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(func.notEmpty(data.columList)){
          const aa=data.columList;
          this.setState({
            showColums: aa.table_main,
            showSubColums: aa.table_sub,
          })
        }
      }
    })
  }



  onSelectRow = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

//  提交按钮事件
  handleSubmit = e => {
    const {dataSource,ziSaveFlag,showColums,showSubColums} = this.state;
    e.preventDefault();
    const { form ,dispatch,commonBusiness:{detail},
      match: {
      params: { tableName,modulename },
    } } = this.props;
    const  params = addSaveCommon(detail.id,form,dataSource,ziSaveFlag,showColums,showSubColums)
    const realId = params.id
    if(func.notEmpty(params)){
      delete params.id
      params.realId = realId
      dispatch(COMMONBUSINESS_SUBMIT({tableName,modulename,submitParams:params,btnCode:'edit'}));
    }
  };



  CreateAddForm=()=>{
    const {selectObj,showSubColums,dataSource} = this.state
    const AddForm = Form.create()(props => {
      const {form} = props;
      const renderEditForm = getEditConf(showSubColums, form, selectObj);
      const  handleOK = e => {
        form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const index = dataSource.findIndex(i => selectObj.key === i.key);
            if (index === -1) {
              values.key = dataSource.length + 1;
              dataSource.push(values);
            } else {
              const item = dataSource[index];
              dataSource.splice(index, 1, {
                ...item,
                ...values,
              });
            }
            this.setState({
              showAddModal: false,
            }, ()=>{
              this.onReturnData(dataSource, true);
            });
          }
        });
      };
      return (
        <div>
          {renderEditForm}
          <div style={{ marginTop: '8px', float: 'right' }}>
            <Button type="primary" size='small' inline onClick={() => handleOK()} style={{ marginLeft: '8px' }}>确定</Button>
          </div>
        </div>
      );

    });
    return <AddForm />
  }

  onReturnData = (dataSource,flag) =>{
    this.setState({dataSource,ziSaveFlag:func.isEmpty(flag)?true:flag});
  }



  onClose = () => {
    this.setState({
      showAddModal: false,
    });
  };






  render() {
    const {
      form,
      match: {
        params: { tableName,modulename, },
      },
      commonBusiness: { detail },
    } = this.props;

    const {dataSource,showColums,showSubColums,showAddModal} = this.state;
  //   console.log(dataSource,'=========dataSource')
    const iteams=getEditConf(showColums,form,detail);
    const backUrl = `/commonBusiness/commonList/${tableName}/${modulename}`
    return (
      <div className="commonAdd">
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(backUrl)}
        >{'领取任务'}
        </NavBar>
        <div className='am-list'>
          <Form hideRequiredMark={false}>
            <Card>
              <Card.Body title="基本信息" className={styles.card} bordered={false}>
                {iteams}
              </Card.Body>
            </Card>
            {
              showColums.length>0 && dataSource.length>0?
                <Card>
                  {
                    dataSource.map((col) => (
                      <Card.Body>
                        <div>
                          {
                            showSubColums.map(rrow => (
                              <List key={rrow.id} className='static-list'>
                                <Item>
                                  <span style={{ width: '35%', color: 'gray' }}>{rrow.columnAlias}：</span>
                                  <span style={{ width: '65%', float: 'right' }}>
                                    {
                          rrow.columnName !== 'preamount' || (rrow.columnName !== 'planamount') ?
                            col[func.isEmpty(rrow.dickKey) ? rrow.columnName : rrow.showname]
                            :''
                        }
                                  </span>
                                </Item>
                              </List>
                            ))
                          }
                        </div>
                      </Card.Body>
                    ))
                  }
                </Card>:''
            }
          </Form>
          <Button icon='/image/plus.png' block type="primary" onClick={this.handleSubmit}>
            提交
          </Button>
        </div>
        <Modal
          visible={showAddModal}
          transparent
          maskClosable
          onClose={() => this.onClose()}
          popup
          animationType='slide-down'
          platform='android'
        >
          {this.CreateAddForm()}
        </Modal>
      </div>
    );
  }
}
export default OrderQuickly;

