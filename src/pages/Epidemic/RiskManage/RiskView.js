import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { router } from 'umi';
import { NavBar } from 'antd-mobile';
import { riskDetail } from '@/services/epidemic';
import { InTheLoad } from '@/components/Stateless/Stateless';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';

class RiskView extends PureComponent {
  state = {
    detail: {},
  };

  async componentDidMount() {
    const { match: { params: { id } } } = this.props;
    const aa = await riskDetail({ id });
    this.setState({
      detail: aa.data,
    });
  }

  render() {
    const { detail } = this.state;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/epidemic/riskmanage')}
        >风险地区查看
        </NavBar>
        <div className='am-list'>
          {/* Object.getOwnPropertyNames(detail).length === 0  判断json是否为空 */}
          {
            Object.getOwnPropertyNames(detail).length === 0 ? <InTheLoad /> : (
              <div style={{ padding: '0 15px', background: 'white' }}>
                <MatrixListItem label="厂区" title={detail.deptName} />
                <MatrixListItem label="风险地(省)" title={detail.riskAreaProvincial} />
                <MatrixListItem label="风险地(市)" title={detail.riskAreaCity} />
                <MatrixListItem label="创建时间" title={detail.createTime} />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default RiskView;
