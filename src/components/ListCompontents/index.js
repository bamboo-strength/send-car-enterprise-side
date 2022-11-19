import React, { PureComponent } from 'react';
import { Card, Icon } from 'antd';
import { Flex } from 'antd-mobile';
import styles from '@/layouts/Sword.less';
import Text from 'antd/lib/typography/Text';
import style from './index.less';
import u27 from './image/u27.png';
import u28 from './image/u28.png';

class ListCompontents extends PureComponent {

  render() {
    const { list, showColums, onClick } = this.props;
    return (
      <div className={style.wrap}>
        {
          list.map(item => {
            return (
              <Card
                title={item.deptName}
                bordered={false}
                size="small"
                className={style.dataCard}
                onClick={() => onClick(item)}
              >
                {
                  showColums.map((rrow, index) => {
                    if (index !== 0) {
                      return (
                        <div className={style.divRound}>
                          <div className={style.imgRound} style={{ background: index === 1 ? '#edfff8' : '#f1f8fd' }}>
                            <img src={index === 1 ? u27 : u28} alt='' style={{ width: '100%' }} />
                          </div>
                          <Flex.Item className={style.flexItem}>
                            <span className={`${styles.tdTitle}`}>{rrow.columnAlias}：</span>
                            <Text strong className={style.text}>
                              {item[rrow.showname ? rrow.showname : rrow.columnName]}
                            </Text>
                          </Flex.Item>
                        </div>
                      );
                    }
                    return true;
                  })
                }
              </Card>
            );
          })}
      </div>
    );
  }
}

export default ListCompontents;
