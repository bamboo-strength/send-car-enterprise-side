import React, { PureComponent } from 'react';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { Col, Form, Icon, Input, Row} from 'antd';
import router from 'umi/router';
import { NavBar,Modal,Flex,Button} from 'antd-mobile';
import NetWorkListItem from '@/components/NetWorks/NetWorkListItem';
import NetWorkListMeta from '@/components/NetWorks/NetWorkListMeta';
import NetWorkDatePicker from '@/components/NetWorks/NetWorkDatePicker';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { connect } from 'dva';
import { page } from '@/services/allthebill';
import { ALLTHEBILL_LIST } from '@/actions/allthebill';
import func from '@/utils/Func';
import { MERDRIVER_DETAIL } from '@/actions/merDriver';
import { getCurrentUser } from '@/utils/authority';
@connect(({ merDriver }) => ({
  merDriver,
}))
@connect(({allthebill, loading}) => ({
  allthebill,
  loading: loading.models.allthebill
}))
@Form.create()
class AllTheBills extends PureComponent {
  constructor(props) {
    super(props);
    const date = new Date();
    this.state = {
      data:{},
      modal: false,
      value: [date.getFullYear(), date.getMonth()+1],
      nowYears:'2021',
      nowMonth:'4',
      editYears: 0,
      editMonth: 0,
      id: '',
      notValue:[date.getFullYear(), date.getMonth()+1],
      screening:false,
      income:'',
      spending:''
    };
  }

  componentWillMount() {
    const Year = new Date().getFullYear();
    const Month = new Date().getMonth()+1;
    let income=0
    let spending=0
    const {
      dispatch,
      merDriver: {
        detail,
      },
    } = this.props;
    dispatch(MERDRIVER_DETAIL(getCurrentUser().userId));
    const params={
      current:1,
      size:15,
      querytime:Year+"-"+Month,
      jszh:detail.jszh,

    }
    page(params).then((res)=>{
      for(let i=0;i<res.data.records.length;i+=1)
      {
        if(res.data.records[i].bussType===2){
          spending += (+res.data.records[i].outAmount)
        }else if(res.data.records[i].bussType===4)
        {
          income += (+res.data.records[i].outAmount)
        }
      }
      this.setState({
        income:income.toFixed(2),
        spending:spending,
        data:res.data,
        nowYears:Year,
        nowMonth:Month,
        editYears: Year,
        editMonth: Month,
      })
    });
  }

  onClick = ( years, month) => {
    console.log(years,month)
    this.setState({
      modal: true,
      value: [years, month],
      notValue:[years, month]
    });
  };

  onClose = () => {
    this.setState({
      modal: false,
      screening:false
    });
  };
  onReset = () => {
    const {notValue} = this.state;
    this.setState({
      value: notValue,
    });
  };
  onOk = value => {
    this.setState({
      modal: false,
      editYears: value[0],
      editMonth: value[1],
    });
    let income=0
    let spending=0
    const params={
      current:1,
      size:15,
      querytime:value[0]+"-"+value[1],
    }
    page(params).then((res)=>{
      for(let i=0;i<res.data.records.length;i+=1)
      {
        if(res.data.records[i].bussType===2){
          spending += (+res.data.records[i].outAmount)
        }else if(res.data.records[i].bussType===4)
        {
          income += (+res.data.records[i].outAmount)
        }      }
      this.setState({
        income:income.toFixed(2),
        spending:spending,
        data:res.data
      })
    });

  };

  onChange = (value) => {
    this.setState({
      value,
    });
  };

  onScreening = ()=>{
    this.setState({
      screening:true
    })
  }
  render() {
    const { modal, value, editYears, editMonth, id,screening,data,nowMonth,nowYears,spending,income} = this.state;
    const { form,
    } = this.props;
    const {getFieldDecorator} = form
    const rightContent = [<div onClick={this.onScreening}>筛选<Icon type="caret-down" style={{marginLeft:5}} /></div>]
    return (
      <div id={NetWorkLess.netWork}>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/wallet/wallet')}
          // rightContent={rightContent}
        >账单
        </NavBar>
        <div className='am-list networkDetail'>
          <div className='networkDetailDiv' style={{paddingTop:0}}>
          <NetWorkListItem
            years={editYears != 0 ? editYears : nowYears}
            month={editMonth != 0 ? editMonth : nowMonth}
            spending={spending}
            income={income}
            choose
            onClick={(e) => this.onClick( editYears, editMonth)}
            />
          <NetWorkListMeta data={data.records}/>
          </div>
        </div>
        <NetWorkDatePicker
          visible={modal}
          onClose={this.onClose}
          value={value}
          onChange={this.onChange}
          onOk={() => this.onOk(value)}
          onReset={this.onReset}/>
        <Modal
          popup
          visible={screening}
          onClose={this.onClose}
          animationType="slide-down"
          maskClosable={true}
          className='screenIng'
        >
          <Flex justify='between' style={{marginTop:20}}>
            <Button type="ghost" className='dateBtnPicker' style={{ width: '50%' }}>重置</Button>
            <Button type="primary" className='dateBtnPicker' style={{ width: '50%' }}>确定</Button>
          </Flex>
        </Modal>
      </div>
    );
  }
}

export default AllTheBills;
