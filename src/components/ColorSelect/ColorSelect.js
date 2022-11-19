import React, { PureComponent } from 'react';
import { SketchPicker } from 'react-color';
import {Button} from 'antd';

export default class ColorSelect extends PureComponent {

  state = {
    color: '',
    displayColorPicker: "none",
  };

  componentWillMount() {
    const {initcolor,onRef} = this.props;
    this.setState({color: initcolor});
    if (typeof(onRef)==="function") {
      onRef(this)
    }
  }

  handleClick = ()=> {
    const {displayColorPicker} =this.state;
    const {display} = this.props;

    if (display==='block') {
      this.setState({displayColorPicker:displayColorPicker==='none'?'block':'none'})
    }
    // this.setState({displayColorPicker:displayColorPicker === "none"?"block":"none"});
  }

  setColour = colour => {
    this.setState({color:colour})
  }

  handleChange = (value)=>{
    const {updateColor} = this.props;
    this.setState({color: value.hex})
    updateColor(value)
  }

  render() {
    const {color,displayColorPicker} = this.state;

    return (
      <div>
        <Button onClick={this.handleClick} style={{background:color,border:"none",lineHeight:"31px",height:31,width:45,verticalAlign: "middle"}} />
        {displayColorPicker === "block"?
          <div style={{position:"absolute",zIndex:66}}>
            <SketchPicker color={color} onChangeComplete={this.handleChange} />
          </div>
          :null
        }
      </div>
    );
  }
}
