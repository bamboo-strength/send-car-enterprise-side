import React, { Component } from 'react';
import './Matrix.less';

 class NoTimeContent extends Component {
   constructor (props) {
     super(props)
     this.state={
       dateSelected:false
     };
   }

   handleMask=()=>{
     this.setState({
       dateSelected: !this.state.dateSelected
     })
   }


   render() {
     return (
       <div
         onClick={this.handleMask}
         className={`selectMask_box ${this.state.dateSelected ? "mask" : ""} `} >

         {/*//这里是待展示的内容，*/}<div><p>hahahahahahahahahahahahahahahahahahahahah</p></div>
         {/*//你可以自己设置dataSelected的初始值，同时请注意注意三元运算的顺序。*/}
       </div>
     )
   }



 }
  export default NoTimeContent;
