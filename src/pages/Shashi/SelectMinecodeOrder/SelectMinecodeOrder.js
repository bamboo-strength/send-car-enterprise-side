import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { Col, Form, Input } from 'antd';
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import { Modal, NavBar, Icon, Card, List,Button,Toast } from 'antd-mobile';
import {  getBaseUrl } from '../../Merchants/commontable';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import router from 'umi/router';
import styles from '@/layouts/Sword.less';
import { getCurrentUser, getToken } from '@/utils/authority';
import { USER_DETAIL, } from '../../../actions/user';
import { CUSTOMER_RegistedInfo } from '../../../actions/customer';


const FormItem = Form.Item;

@connect(({customer,user,commonBusiness,tableExtend, loading }) => ({
  customer,
  user,
  commonBusiness,
  tableExtend,
  loading: loading.models.commonBusiness,
}))

@Form.create()

class SelectMinecodeOrder extends PureComponent {

  state = {
    selectedRows: [],
    dataSource : [],
    showColums: [],
    showSubColums:[],
    ziSaveFlag:true,
    showAddModal: false,
    selectObj: [],
    detail:{},
    userdetail:{},
    RegistedInfo:{},
    conId:""
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { tableName,modulename ,id},
      },
      user: {
        detail,
      },
      // customer:{
      //   RegistedInfo,
      // },
      location
    } = this.props;
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      userdetail:detail,
      // RegistedInfo:RegistedInfo
    })
    const user = getCurrentUser();
    dispatch(USER_DETAIL(user.userId));
    // dispatch(USER_INIT());
    dispatch(CUSTOMER_RegistedInfo())

    let newArr =[];
        if(location.state===undefined)
    {
      router.goBack()
    }
    else {
      const { detail } = location.state

      if (func.notEmpty(detail)) {
        newArr = detail.sublist.map((v, index) => {    // 添加行号
          return { ...v, 'key': index + 1 }
        })
      }

      dispatch(TABLEEXTEND_COLUMNLIST({ tableName, modulename, queryType: 1 })).then(() => {
        const { tableExtend: { data } } = this.props;
        if (data !== undefined) {
          if (func.notEmpty(data.columList)) {
            const aa = data.columList;
            this.setState({
              showColums: aa.table_main,
              showSubColums: aa.table_sub,
              dataSource: newArr,
            })
          }
        }
      })
    }
  }

  onSelectRow = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

//  提交按钮事件
  handleSubmit = e => {
    this.setState({
      conId:"123456"
    })
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

  edit = (obj) => {
    this.setState({
      showAddModal: true,
      selectObj: obj,
    }, () => {
      this.resetForm();
    });
  };

  resetForm = () => {
    const { form } = this.props;
    const {showSubColums} = this.state
    const cols1 = showSubColums.map(v => v.columnName);
    const cols2 = showSubColums.map(v => v.showname);
    form.resetFields([...cols1, ...cols2]);
  };

  addPreaMount = (e, key, columnName) => {
    const { dataSource } = this.state;
    console.log(dataSource,key,columnName)
  };

  render() {
    const {
      form,
      match: { params: { tableName,modulename, }, },
      customer:{
        RegistedInfo,
      },
    } = this.props;
    const {dataSource,showColums,showSubColums,showAddModal,detail,userdetail,conId} = this.state;
    const jsonData={
      "${contractno1}":conId,
      "${address1}":"网签合同",
      "${name1}":"山东矩阵软件股份有限公司",
      "${name2}": RegistedInfo.realName,
      "${timeStamp1}":"",
      "${timeStamp2}":""
    }
    const a11={
      "realName": RegistedInfo.realName,
      "cardId":RegistedInfo.cardId,
      "legalPerson":RegistedInfo.legalPerson,
      "certType":"0",
      "phoneNo":RegistedInfo.phoneNo,
      "templateId":'TEM1025026',
      "flag":"ture",
      "contractData":jsonData,
      // "signerId": "10923668"
    }
    const address = `${getBaseUrl()}/contract-sign/${getToken()}/${JSON.stringify(a11)}`
    // const address = `${getBaseUrl()}/13395333307/${getToken()}/NetSign/main/${JSON.stringify(a11)}`
    const iteams=getEditConf(showColums,form,detail);
   // const backUrl = `/commonBusiness/commonList/${tableName}/${modulename}`
    const backUrl = `/shashi/showMineOrderDetail/shashi_select_minecode/selectMinecode/${detail.id}`
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
    return (
      <div className="commonAdd">
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(backUrl)}
        >下订单
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
                    dataSource.map((col,key) => (
                      <Card.Body>
                        <div>
                          {
                            showSubColums.map(rrow => (
                              <Col span={24} className="view-config">
                                <FormItem {...formItemLayout} label={rrow.columnAlias}>
                                  <span>
                                    {
                                      !col[func.isEmpty(rrow.dickKey) ? rrow.columnName : rrow.showname] ?
                                        <Input label={rrow.columnAlias} placeholder={`请输入${rrow.columnAlias}`} key={col[rrow.columnName]} defaultValue={col[rrow.columnName]} onChange={(e) => this.addPreaMount(e, key, rrow.columnName)} /> :
                                        col[func.isEmpty(rrow.dickKey) ? rrow.columnName : rrow.showname]
                                    }
                                  </span>
                                </FormItem>
                              </Col>
                            ))
                          }
                        </div>
                      </Card.Body>
                    ))
                  }
                </Card>:''
            }
          </Form>
          <Button type="primary" style={{marginTop:"10px"}}>
            <a href={address}
               style={{color:'#FFFFFF',lineHeight: '2.5'}}>提交</a>
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
export default SelectMinecodeOrder;

