import React, { PureComponent } from 'react';
import { Button, Form, Icon } from 'antd';
import router from 'umi/router';
import { Modal, NavBar, Toast } from 'antd-mobile';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';
import '../Shashi.less';
import { EmptyData } from '@/components/Stateless/Stateless';
import Title from 'antd/lib/typography/Title';
import { requestApiByJson, requestListApi } from '../../../services/api';

@Form.create()
class InspectVehicleForYamei extends PureComponent {
  // 雅美车检功能

  state = {
    resultData: '',
  };

  componentDidMount() {
    const {
      match: {
        params: { type },
      },
    } = this.props;
    if (type === 'justScan') {
      this.justScan();
    }
  }

  /* 扫描二维码 */
  scanTheCode = () => {
    const {
      match: {
        params: { type },
      },
    } = this.props;
    if (type === 'justScan') {
      this.justScan();
    } else {
      try {
        ERCode.scanErcode();
        window.content = item => {
          Toast.loading('加载中');
          requestApiByJson('/api/mer-yamei/inspect/vehicle/vehicleThree', { id: item }).then(
            resp => {
              Toast.hide();
              this.setState({
                resultData: Array.isArray(resp.data) ? resp.data[0] : '',
              });
            }
          );
        };
      } catch (e) {
        Toast.fail('浏览器不支持扫码!');
      }
    }
  };

  justScan = () => {
    try {
      ERCode.scanErcode();
      window.content = item => {
        Modal.alert('信息确认', '是否确认?', [
          { text: '取消', onPress: () => console.log('00') },
          {
            text: '确定',
            onPress: () => {
              Toast.loading('加载中'); // '333410439'
              requestListApi('/api/mer-yamei/inspect/vehicle/scanCode', { id: item }).then(resp => {
                Toast.hide();
                if (resp.success) {
                  Toast.info('操作成功');
                }
                router.push('/dashboard/function');
              });
            },
          },
        ]);
      };
    } catch (e) {
      Toast.fail('浏览器不支持扫码!');
    }
  };

  // 确认 取消
  handle = (type, id) => {
    const param = type === 'checkFlag' ? { checkFlag: 1 } : { cancelFlag: 1 };
    param.id = id;
    requestApiByJson('/api/mer-yamei/inspect/vehicle/vehicleThree', param).then(resp => {
      // 查询数据展示
      if (resp.success) {
        Toast.info('操作成功');
      }
    });
  };

  render() {
    const {
      match: {
        params: { type },
      },
    } = this.props;
    const { resultData, showMag } = this.state;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/function')}
          rightContent={[
            <Icon type="qrcode" style={{ fontSize: '24px' }} onClick={this.scanTheCode} />,
          ]}
        >
          {type === 'justScan' ? '扫描二维码' : '车检'}
        </NavBar>
        <div className="am-list">
          {resultData ? (
            <div style={{ padding: 15, background: 'white' }}>
              <Title level={4}>基本信息</Title>
              <div className="tran-logistics">
                <MatrixListItem
                  style={{ minHeight: 38 }}
                  label="单位"
                  title={resultData.minecodeName}
                />
                <MatrixListItem
                  style={{ minHeight: 38 }}
                  label="合同编号"
                  title={resultData.noticeno}
                />
                <MatrixListItem
                  style={{ minHeight: 38 }}
                  label="车号"
                  title={resultData.vehicleno}
                />
                <MatrixListItem
                  style={{ minHeight: 38 }}
                  label="物资"
                  title={resultData.varnoName}
                />
                <MatrixListItem
                  style={{ minHeight: 38 }}
                  label="挂车号"
                  title={resultData.trailercarno}
                />
                <MatrixListItem style={{ minHeight: 38 }} label="手机号" title={resultData.phone} />
                <MatrixListItem
                  style={{ minHeight: 38 }}
                  label="司机姓名"
                  title={resultData.driver}
                />
                <MatrixListItem
                  style={{ minHeight: 38 }}
                  label="车检状态"
                  title={resultData.checkVehicleName}
                />
                <MatrixListItem
                  style={{ minHeight: 38 }}
                  label="业务类型"
                  title={resultData.loadtypeName}
                />
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}
                >
                  <Button
                    type="primary"
                    onClick={() => this.handle('checkFlag', resultData.id)}
                    style={{ marginBottom: 10, marginRight: 10 }}
                  >
                    确认
                  </Button>
                  <Button
                    type="danger"
                    onClick={() => this.handle('cancelFlag', resultData.id)}
                    style={{ marginBottom: 10 }}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <EmptyData text={showMag} />
          )}
        </div>
      </div>
    );
  }
}

export default InspectVehicleForYamei;
