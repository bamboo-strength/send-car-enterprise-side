import React, { PureComponent } from 'react';
import { Button, Form, Icon } from 'antd';
import { router } from 'umi';
import { NavBar, Toast } from 'antd-mobile';
import { riskAdd, riskDetail, riskUpdate } from '@/services/epidemic';
import { InTheLoad } from '@/components/Stateless/Stateless';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';
import MatrixMobileGroupTree from '@/components/MatrixMobile/MatrixMobileGroupTree';
import MatrixMobileSSQ from '@/components/MatrixMobile/MatrixMobileSSQ';

@Form.create()
class RiskEdit extends PureComponent {
  state = {
    detail: {},
    loading: false,
  };

  async componentDidMount() {
    const { match: { params: { id } } } = this.props;
    const aa = await riskDetail({ id });
    this.setState({
      detail: aa.data,
    });
  }

  // 提交
  onSubmit = () => {
    const { form } = this.props;
    const { detail } = this.state;
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const param = {
          ...values,
          areaProvincialCode: values.regionIdprovince,
          areaCityCode: values.regionId,
          id: detail.id,
        };
        delete param.regionIdprovince;
        delete param.regionId;
        delete param.regionName;
        this.setState({
          loading: false,
        });
        riskUpdate(param).then(resp => {
          this.setState({
            loading: false,
          });
          if (resp.success) {
            Toast.success('修改成功');
            router.push('/epidemic/riskManage/list');
          }
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { detail, loading } = this.state;
    const props = { labelNumber: 4, required: true, form };
    const { deptId, riskAreaProvincial, riskAreaCity, areaProvincialCode, areaCityCode } = detail;
    const ssqProps = {
      defaultValue: `${riskAreaProvincial}/${riskAreaCity}`,
      defaultCodeValue: [areaProvincialCode, areaCityCode],
    };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/epidemic/riskmanage')}
        >风险地区修改
        </NavBar>
        <div className='am-list'>
          {/* Object.getOwnPropertyNames(detail).length === 0  判断json是否为空 */}
          {
            Object.getOwnPropertyNames(detail).length === 0 ? <InTheLoad /> : (
              <div>
                <MatrixMobileGroupTree label="厂区" placeholder="请选择厂区" id="deptId" disabled initialValue={deptId} deptId {...props} />
                <MatrixMobileSSQ label="风险区" id="regionId" labelId="regionName" {...ssqProps} placeholder='请输入风险区' {...props} />
                <div style={{ padding: 15 }}>
                  <Button size="large" type="primary" block loading={loading} onClick={this.onSubmit}>保存</Button>
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default RiskEdit;
