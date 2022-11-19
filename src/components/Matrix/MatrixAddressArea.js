import React, { Component } from 'react';
import 'react-picker-address/dist/react-picker-address.css';
import { rTree } from '@/services/RegionService';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import Picker from 'react-picker-address';
import { LinkageAddr } from '@/components/Matrix/linkage';

class MatrixAddressArea extends Component {

  state = {
    visible: false,
    district: JSON.parse(localStorage.getItem('areaData')),
  };

  componentDidUpdate(prevProps) {
    let { initialValue } = this.props;
    const { district } = this.state;
    if(initialValue && prevProps.initialValue !== initialValue){
      if(!Array.isArray(initialValue)){
        initialValue = initialValue.split(',')
      }
      const { form, id, idCode } = this.props;
      district.map(item => {
        if (item.value.includes(initialValue[0])) {
          item.children.map(i => {
            if (i.value.includes(initialValue[1])) {
              if(i.children){
                i.children.map(j => {
                  if (j.value.includes(initialValue[2])) {
                    form.setFieldsValue({
                      [id]: `${item.title},${i.title},${j.title}`,
                      [idCode]: `${item.value},${i.value},${j.value}`,
                    });
                  }
                  return j;
                });
              } else if (initialValue[2]) {
                form.setFieldsValue({
                  [id]: `${item.title},${i.title},${i.title}`,
                  [idCode]: `${item.value},${i.value},${i.value}`,
                });
              }
            }
            return i;
          });
        }
        return item;
      });
    }
  }

  showPicker = () => {
    this.setState({
      visible: true,
    });
  };

  hidePicker = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = (e) => {
    const { form, id, idCode } = this.props;
    form.setFieldsValue({
      [idCode]: e.meta.map(item => item.value).join(','),
      [id]: e.val.map(item => item).join(','),
    });
    this.setState({
      visible: false,
    });
  };


  render() {
    const { district, visible } = this.state;
    const { form, id, label, placeholder, className, required, initialValue, idCode, labelNumber} = this.props;
    return (
      <div className={className}>
        <MatrixMobileInput
          onClick={this.showPicker}
          id={id}
          label={label}
          placeholder={placeholder}
          className="add-area"
          required={required}
          editable={false}
          labelNumber={labelNumber}
          form={form}
        />
        {/* {
          district.length !== 0 ? (
            <Picker
              visible={visible}
              onClose={this.hidePicker}
              dataSource={district}
              onChange={this.onChange}
              title="请选择所在地区"
              value={initialValue}
            />
          ) : ''
        } */}
        <LinkageAddr initVal={initialValue ? initialValue.split(',') : []} dataSource={district} emitCancel={this.hidePicker} emitConfirm={this.onChange} isShow={visible} />
        <MatrixMobileInput
          id={idCode}
          label={label}
          placeholder={placeholder}
          className="add-area"
          editable={false}
          form={form}
          style={{ display: 'none' }}
        />
      </div>
    );
  }
}

export default MatrixAddressArea;
