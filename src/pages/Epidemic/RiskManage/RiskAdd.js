import React, { PureComponent } from 'react';
import { NavBar, Toast } from 'antd-mobile';
import { Button, Form, Icon } from 'antd';
import { router } from 'umi';
import { getCurrentUser } from '@/utils/authority';
import MatrixMobileGroupTree from '@/components/MatrixMobile/MatrixMobileGroupTree';
import MatrixMobileSSQ from '@/components/MatrixMobile/MatrixMobileSSQ';
import { riskAdd } from '@/services/epidemic';

@Form.create()
class RiskAdd extends PureComponent {

  state = {
    loading:false
  }

  // 提交
  onSubmit = () => {
    const {form} = this.props
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors){
        const param = {
          ...values,
          areaProvincialCode: values.regionIdprovince,
          areaCityCode: values.regionId
        }
        delete param.regionIdprovince
        delete param.regionId
        delete param.regionName
        this.setState({
          loading:false
        })
        riskAdd(param).then(resp => {
          this.setState({
            loading:false
          })
          if (resp.success) {
            Toast.success('添加成功')
            router.push('/epidemic/riskmanage')
          }
        });
      }
    })
  }

  render() {
    const {form} = this.props
    const {loading} = this.state
    const props = {labelNumber:4, required:true,form}
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/epidemic/riskmanage')}
        >风险地区添加
        </NavBar>
        <div className='am-list'>
          <MatrixMobileGroupTree label="厂区" placeholder="请选择厂区" id="deptId" disabled initialValue={getCurrentUser().deptId} deptId {...props} />
          <MatrixMobileSSQ label="风险区" id="regionId" labelId="regionName" placeholder='请输入风险区' {...props} />
          <div style={{padding:15}}>
            <Button size="large" type="primary" block loading={loading} onClick={this.onSubmit}>保存</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default RiskAdd;
