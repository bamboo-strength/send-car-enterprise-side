import React, { PureComponent } from 'react';
import { Col, Divider, Row } from 'antd';
import MatrixMobileSelect from '@/components/MatrixMobile/MatrixMobileSelect';
import {groupDept, } from '../../../services/epidemic';
import MatrixGroupTree from '@/components/Matrix/MatrixGroupTree';
import { getCurrentUser } from '@/utils/authority';
import { requestListApi } from '@/services/api';


class UseDept extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dept:'uninit',
      vars:[]
    };
  }


  componentDidMount() {
    const { id='deptId',detail={},coalId } = this.props;
    groupDept().then(resp => {
      if (resp.success) {
        this.setState({
          dept:resp.data.isGroup
        })
      }
    })
    if(coalId){
      this.chooseVarByDeptid(detail[id])
    }
  }

  select=(e)=>{
    const {form,coalId} = this.props
    form.setFieldsValue({
      [coalId]:''
    })
    if(coalId){
      this.chooseVarByDeptid(e)
    }
  }

  chooseVarByDeptid=(e)=>{
    requestListApi('/api/mer-queue/coal/pc/listNoPage',{deptId:e,}).then(resp=>{
      const {data} =resp
      const vars = []
      data.forEach((item)=>{
        vars.push({key:item.id,value:item.coalName})
      })
      this.setState({
        vars
      })
    })
  }

  render() {
    const { form,width='100%',labelNumber=8,id='deptId',coalId,query,detail={} } = this.props;
    const {dept,vars} = this.state;
    const dividerStyle = { margin: 0, background: 'none' };
    // console.log(dept,form.getFieldsValue(),getCurrentUser(),'===!!!')
    return (
      dept !=='uninit'?
        dept ? // 集团选厂区
          <div>
            {/*<MatrixMobileSelect label="厂区" placeholder="请选择厂区" showAllDefault id={id} labelNumber={labelNumber} valueParam='deptName' onSelect={(e)=>this.select(e)} required={!query} dictCode="/api/mer-queue/reservationqueue/getGroupList" form={form} />*/}
            <MatrixMobileSelect id={id} labelId='deptName' required label='厂区' onChange={this.onChanges} showAllDefault deptCategory={2} dictCode='/api/shipper-system/dept/treesimple' initialValue={detail[id]} labelNumber={labelNumber} placeholder='请选择厂区' className='list-class' form={form} />

            <Divider style={dividerStyle} />
            {
            coalId?
              <MatrixMobileSelect label="物资" placeholder="请选择物资" showAllDefault={query} id={coalId} labelNumber={labelNumber} keyParam='id' required={!query} valueParam='coalName' options={vars} form={form} />
            :undefined
            }

          </div>

          : // 厂区显示
          <div>
            <MatrixGroupTree label="厂区名称" placeholder="请选择厂区名称" id={id} initialValue={getCurrentUser().deptId} disabled deptId required={!query} style={{ width }} form={form} />
            <Divider style={dividerStyle} />
            {
              coalId?
                <MatrixMobileSelect label="物资" placeholder="请选择物资" showAllDefault={query} id={coalId} labelNumber={labelNumber} required={!query} keyParam='id' valueParam='coalName' dictCode="/api/mer-queue/coal/pc/listNoPage" form={form} />
            :undefined
            }

          </div>
        :null
    );
  }
}

export default UseDept;
