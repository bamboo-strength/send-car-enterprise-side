import React, { PureComponent } from 'react';
import { Form, Card,message } from 'antd';
import { NavBar,Button,Icon } from 'antd-mobile';
import { connect } from 'dva';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { releaseSource } from '@/services/salebill'
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import MatrixSearchDataTable from '@/components/Matrix/MatrixSearchDataTable';
import func from '@/utils/Func';
import {getAddConf} from '@/components/Matrix/MatrixAddConfig';


@connect(({ salebill, loading }) => ({
  salebill,
  submitting: loading.effects['/salebill/salebill'],
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
}))
@Form.create()
class ReleaseSource extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
   //   submitting: false,
      showColums:[],
      showSubColums:[],
    };
  }

  componentWillMount() {
    const {
      dispatch,
    } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({'tableName': 'mer_waybill','modulename':'waybill',queryType:1})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(data.columList!==null && data.columList!==undefined){
          const aa=data.columList;
          this.setState({
            showColums: aa.table_main,
            showSubColums: aa.table_sub,
          })
        }
      }
    })
  }

  handleAccpet = e => {
    e.preventDefault();
    const {
      form,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
          begintime: func.format(values.begintime),
          endtime: func.format(values.endtime),
        };
        const realId = params.id
        delete params.id
        params.sourceSalebillId = realId

        releaseSource(params).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            router.push('/salebill/salebill');
          }
        });
      }
    });
  };

  handleOkBefore = () =>{
    const {form} = this.props;
    return form;
  };

  render() {
    const {
      submitting,
      form,
      location
    } = this.props;
    let {data} = location.state
    const {showColums,showSubColums} = this.state
   // console.log(showColums)
    const methods = {
      billno:{
        searchs:this.child?this.child.showModal:''
      }
    }
    const iteams1=getEditConf(showColums,form,data,{});
    const iteams2=getAddConf(showColums,form,methods);
    const action = (
      <Button type="primary" onClick={this.handleAccpet} loading={submitting}>
          确认
      </Button>
    );

const searchParams = {'mainid':data.id,}
    return (
      <div>
      <div className="commonAdd">
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/salebill/salebill')}
        >发布货源
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card className={styles.card} bordered={false} style={{paddingBottom:'45px',paddingLeft:10,paddingRight:10}}>
              {showSubColums.length<1?iteams1:iteams2}
            </Card>
          </Form>
          {action}
        </div>
      </div>
      <MatrixSearchDataTable form={form} showColums={showColums} handleOkBefore={this.handleOkBefore} labelKey='billno' searchPath='/api/mer-salebill/salebillsub/page' searchParams={searchParams} onRef={(ref)=>{ this.child = ref}} />
      </div>
  );

  }
}

export default ReleaseSource;
