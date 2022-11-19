import React, {PureComponent} from "react";
import {Input,} from 'antd';
import InputGroup from '@/components/NetWorks/InputGroup';
import 'react-input-groups/lib/css/styles.css';
import style from './NetWorkPassWord.less'

export default class NetWorkPassWord extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      str: ''
    }
  }

  componentWillMount() {
    const {onRef} = this.props
    onRef(this)
  }

  myName = () => {
    this.getValue();
    this.setState({
      str: '',
    })
  }

  getValue = (value) => {
    const {form, id,passwordcheck} = this.props
    form.setFieldsValue({
      [id]: value
    })
    this.setState({
      str: value
    })
    if (value !== undefined){
      if(value.length===6) {
        passwordcheck(value)
      }
    }
  }

  onRef = (ref) => {
    this.child = ref
  }

  paFous = ()=>{
    setTimeout(()=>{
      this.child.inputFocus()
    })
  }

  render() {
    const {form: {getFieldDecorator}, id} = this.props
    const {str} = this.state
    return (
      <div className={style.inputBox}>
        {getFieldDecorator(id)(
          <Input style={{display: 'none'}} type="text" className='codeInput' maxLength={6} />
        )}
        <InputGroup getValue={this.getValue} onRef={this.onRef} length={6} type="box" str={str} />
      </div>
    );
  }
}
