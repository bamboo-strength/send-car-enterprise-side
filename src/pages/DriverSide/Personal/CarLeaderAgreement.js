import React, { PureComponent } from 'react';
import { Form, Card,Divider} from 'antd';
import styles from '../../../layouts/Sword.less';

@Form.create()
class CarLeaderAgreement extends PureComponent {
  state = {
    data: {},
  };

  componentWillMount() {
    // const {
    //   match: {
    //     params: { id },
    //   },
    // } = this.props;
    // detail({ id }).then(resp => {
    //   if (resp.success){
    //     this.setState({ data: resp.data });
    //   }
    // });
  };

  render() {

    const { data } = this.state;

    const formItemLayout = {
      labelCol: {
        xs:{ span: 24 },
        sm:{ span: 7 },
      },
      wrapperCol: {
        xs: { span : 24 },
        sm: { span : 12},
        md: { span : 10},
      },
    };

    return (
      <div className={styles.main}>

        <Card className={styles.card} bordered={false}>

          <h3 align="center">代收运费协议</h3>
          <Divider />
          <p>致：</p>
          <u>山西物迹福达科技有限公司</u>
          <p>本人在物迹福达承运的运输任务，运费统一结算或本次结算如下账号信息：</p>
          <p>收款人姓名:____________________</p>
          <p>身份证号:______________________</p>
          <p>平台收款账号:__________________</p>
          <p>根据本协议本人在物迹福达承运的运输任务，运费统一结算或本次结算至绑定的车队长账户</p>
          <p>由此产生的合同责任及经济纠纷均由本人承担，与物迹福达平台无关！</p>

        </Card>
      </div>
    );
  }
}

export default CarLeaderAgreement;
