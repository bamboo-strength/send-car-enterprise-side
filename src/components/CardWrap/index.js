import React,{PureComponent} from 'react';
import style from '@/components/ListCompontents/index.less';
import PoPover from '@/components/PoPover';
import { Flex } from 'antd-mobile';
import styles from '@/layouts/Sword.less';
import Text from 'antd/lib/typography/Text';
import { Card } from 'antd';
import u27 from '@/components/ListCompontents/image/u27.png';
import u28 from '@/components/ListCompontents/image/u28.png';

export default class CardWrap extends PureComponent{

  render() {
    const {obj,onSelect,defaultValue} = this.props
    const shipment = obj?[
      { bg: '#edfff8', img: u27, label: '总发运车数', text: obj.carsum },
      { bg: '#f1f8fd', img: u28, label: '总发运量(吨)', text: obj.netweightsum },
    ]:[]

    return (
      <Card
        title={obj?obj.materialName?obj.materialName:obj.deptName:undefined}
        bordered={false}
        size="small"
        className={style.dataCard}
        extra={<PoPover onSelect={onSelect} defaultValue={defaultValue} />}
      >
        {
          shipment.map(item => {
            return (
              <div className={style.divRound}>
                <div className={style.imgRound} style={{ background: item.bg }}>
                  <img src={item.img} alt='' style={{ width: '100%' }} />
                </div>
                <Flex.Item className={style.flexItem}>
                  <span className={`${styles.tdTitle}`}>{item.label}：</span>
                  <Text strong className={style.text}>
                    {item.text}
                  </Text>
                </Flex.Item>
              </div>
            );
          })
        }
      </Card>
    );
  }
}
