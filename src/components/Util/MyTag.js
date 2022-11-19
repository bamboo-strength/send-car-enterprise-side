import React, { PureComponent } from 'react';
import { Tag } from 'antd';

const { CheckableTag } = Tag;

export default class MyTag extends PureComponent{
  state = { checked: false };

  componentWillReceiveProps(nextProps){

    this.setState({
      checked: nextProps.checked
    })
  }

  handleChange = checked => {
    const {alter,colkey,children} = this.props;
    const a = {
      colkey:colkey,
      checked: checked,
      name: children
    }
    alter(a)
    this.setState({ checked });
  };

  render() {
    return (
      <CheckableTag {...this.props} checked={this.state.checked} onChange={this.handleChange} />
    );
  }
}
