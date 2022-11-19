import { Modal, NavBar, Icon, Card, Toast, Flex, List } from 'antd-mobile';
import React from 'react';
import func from '@/utils/Func';
import { getEditConf } from '@/components/Matrix/MatrixEditConfig';
import router from 'umi/router';
import style from '@/components/MatrixMobile/MatrixMobile.less';
import { Col, Form, Input, Row ,Button} from 'antd';
import MatrixMobileAddForm from '@/components/MatrixMobile/MatrixMobileAddForm';
import { SubmitBtn } from '@/components/Stateless/Stateless';

const { alert } = Modal;
@Form.create()
class MobileSubEdit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false,
      selectObj: {},
      operationType:'add'
    };
  }

  ok = e => {
    const { form, dataSource, onReturnData } = this.props;
    const { selectObj } = this.state;
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
        });
        onReturnData(dataSource, true);
      } else {
        Toast.info('请检查主子表信息填写是否正确');
      }
    });
  };

  showAdd = () => {
    this.setState({
      selectObj: {},
      showAddModal: true,
      operationType:'add'
    });
  };

  CreateAddForm=()=>{
    const {
      subcolumns,dataSource,onReturnData,methodsSub={}
    } = this.props;
    const formPra = this.props.form
    const {selectObj,operationType} = this.state
    const AddForm = Form.create()(props => {
      const {form} = props;
      // console.log(methodsSub,'==methodsSub')
      const renderEditForm = getEditConf(subcolumns, form, selectObj,methodsSub,formPra,'',operationType);
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
              onReturnData(dataSource, true);
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

  onClose = () => {
    this.setState({
      showAddModal: false,
    });
  };

  edit = (obj) => {
    this.setState({
      showAddModal: true,
      selectObj: obj,
      operationType:'edit'
    }, () => {
    //  this.resetForm();
    });
  };

  resetForm = () => {
    const { form, subcolumns } = this.props;
    const cols1 = subcolumns.map(v => v.columnName);
    const cols2 = subcolumns.map(v => v.showname);
    form.resetFields([...cols1, ...cols2]);
  };

  delete = (obj) => {
    const { dataSource, onReturnData } = this.props;
    alert('移除', '确定移除?', [
      { text: '取消', style: 'default' },
      {
        text: '确定', onPress: () => {
          const newSource = dataSource.filter(item => item.key !== obj.key);
          onReturnData(newSource, true);
        },
      },
    ]);
  };

  addPreaMount = (e, key, columnName) => {
    const { dataSource, onReturnData } = this.props;
    dataSource[key][columnName] = e.target.value;
    onReturnData(dataSource, true);
  };

  watchNumber=(e)=>{
    // console.log(e,e.target.value)
    const v = e.target.value
    e.target.value = v.match(/\d+(\.\d{0,2})?/) ? v.match(/\d+(\.\d{0,2})?/)[0] : ''
  }

  render() {
    const {
      NavBarTitle,
      title,
      backRouter,
      columns,
      subcolumns,
      dataSource = [], iteams, subMethod,
      submitLoading,
      ifSingleSub,
      form,methodsSub,
      commonIfnotNeedAddBtn
    } = this.props;
    const { showAddModal } = this.state;
    const columnWithPops = columns.filter(item => item.category === 5)
    const bringData = columnWithPops.length > 0 ? columnWithPops[0].bringData : ''
    return (
      <div className="commonAdd">
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(backRouter)}
        >{NavBarTitle}
        </NavBar>
        <div className='am-list'>
          <Form hideRequiredMark={false} style={{marginBottom:75}}>
            <Card className={style.MatrixMobileAddForm}>
              {/* <Card.Body> */}
              <div className="matrix-add-form-div" style={{margin:0,border:'none',}}>
                {iteams}
              </div>
            </Card>
            {subcolumns.length>0 && <MatrixMobileAddForm showColumsText={subcolumns} dataSource={dataSource} ifNeedAddBtn={(subcolumns.length > 0 && func.isEmpty(bringData)) && !(ifSingleSub && dataSource.length>0) && !commonIfnotNeedAddBtn} notNeedDelete={commonIfnotNeedAddBtn} methodsSub={methodsSub} form={form} />}
          </Form>
          <SubmitBtn onClick={subMethod} loading={submitLoading} />
          {/* <Button icon='/image/plus.png' style={{lineHeight:'2',marginTop:'20px'}} type="primary" onClick={subMethod} block loading={submitLoading}> */}
          {/*  提交 */}
          {/* </Button> */}
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
          {/*   <div style={{ marginTop: '8px', float: 'right' }}>
            <Button type="primary" size='small' inline onClick={() => this.ok()} style={{ marginLeft: '8px' }}>确定</Button>
          </div> */}
        </Modal>

      </div>
    );
  }
}

export default MobileSubEdit;
