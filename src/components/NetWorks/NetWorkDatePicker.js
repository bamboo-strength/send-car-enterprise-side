import React, { PureComponent } from 'react';
import { PickerView,Modal,Button,Flex } from 'antd-mobile';

export default class NetWorkDatePicker extends PureComponent {

  render() {
    const { value, onChange, onScrollChange,visible,onClose,onReset,onOk } = this.props;
    const date = new Date();
    let thisYear = date.getFullYear();
    const Section = thisYear - 2000;
    const arrYear = [];
    for (let i = 0; i <= Section; i++) {
      arrYear.push(thisYear--);
    }
    const allYear = [];
    arrYear.map(item => {
      allYear.push({ 'label': item, 'value': item });
    });
    const allMonth = [];
    for (let i = 1; i < 13; i++) {
      allMonth.push({ 'label': i, 'value': i });
    }
    const seasons = [
      allYear,
      allMonth,
    ];
    return (
      <Modal
        popup
        visible={visible}
        onClose={onClose}
        animationType="slide-down"
        maskClosable
      >
        <PickerView
          onChange={onChange}
          value={value} // 默认值
          data={seasons}
          cascade={false}
          onScrollChange={onScrollChange}
        />
        <Flex justify='between' style={{marginTop:20}}>
          <Button type="ghost" className='dateBtnPicker' onClick={onReset} style={{ width: '50%' }}>重置</Button>
          <Button type="primary" className='dateBtnPicker' onClick={onOk} style={{ width: '50%' }}>确定</Button>
        </Flex>
      </Modal>
    );
  }
}
