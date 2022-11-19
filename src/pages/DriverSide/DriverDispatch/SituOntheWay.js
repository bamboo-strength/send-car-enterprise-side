import { ImagePicker, SegmentedControl, Tabs, List, NavBar, Button } from 'antd-mobile';
import React from 'react';
import { Form, Icon } from 'antd';
import router from 'umi/router';
import MatrixSelect from '../../../components/Matrix/MatrixSelect';
import MatrixTextArea from '../../../components/Matrix/MatrixTextArea';


const {Item} = List;


class SituOntheWay extends React.Component {
  state = {
    files: [],
  }

  fileChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files,
    });
  }

  changeTab=(tab, index) =>{
    if (index === '0'){
      // this.getData(false,{})
    }
  }

  CreateFormManFun=()=>{
    const CreateFormMan = Form.create()(props => {
      const { files } = this.state;
      const { dispatch,form} = props;
      // 提交事件
      const saveLeft = () => {
        form.validateFields((err, values) => {
          if (err) { return; }
          const params = {
            ...values,
          };
          console.log(params,'------------params')
        })
      };
      return (
        <List>
          <Item style={{padding:'30px 10px 20px 10px'}}><MatrixSelect label="在途情况" placeholder="请选择在途情况" dictCode="residentAuditFlag" id="tenantId" style={{width: '100%'}} required form={form} /></Item>
          <Item style={{padding:'20px 10px'}} id='taSty'><MatrixTextArea label='备注' placeholder='请填写备注' id='remark' maxLength='100' row={4} form={form} /></Item>
          <Item>
            <ImagePicker
              files={files}
              onChange={this.fileChange}
              onImageClick={(index, fs) => console.log(index, fs)}
              selectable={files.length < 7}
              multiple={false}
              accept='camera'
            />
          </Item>
          <Item><Button type="primary" size='small' inline onClick={() =>saveLeft()} style={{marginLeft:'8px'}}>保存</Button>
          </Item>
        </List>
      );
    });
    return <CreateFormMan />
  }

  CreateFormManFun2=()=>{
    const CreateFormMan = Form.create()(props => {
      const { files } = this.state;
      const { dispatch,form} = props;
      // 提交事件
      const saveRight = () => {
        form.validateFields((err, values) => {
          if (err) { return; }
          const params = {
            ...values,
          };
          console.log(params,'------------params')
        })
      };
      return (
        <List>
          <Item style={{padding:'30px 10px 20px 10px'}}><MatrixSelect label="登记类型" placeholder="请选择登记类型" dictCode="residentAuditFlag" id="tenantId" style={{width: '100%'}} required form={form} /></Item>
          <Item style={{padding:'20px 10px'}} id='taSty'><MatrixTextArea label='备注' placeholder='请填写备注' id='remark' maxLength='100' row={4} form={form} /></Item>
          <Item>
            <ImagePicker
              files={files}
              onChange={this.fileChange}
              onImageClick={(index, fs) => console.log(index, fs)}
              selectable={files.length < 7}
              multiple={false}
              accept='camera'
            />
          </Item>
          <Item><Button type="primary" size='small' inline onClick={() =>saveRight()} style={{marginLeft:'8px'}}>保存</Button>
          </Item>
        </List>
      );
    });
    return <CreateFormMan />
  }

  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/driverSide/driverDispatch/driverOrder')}
          style={{marginBottom:'5px'}}
        >在途汇报
        </NavBar>
        <Tabs
          tabs={[
            {title:'在途情况'},
            {title:'异常登记'}
          ]}
          initialPage={0}
          onChange={(tab, index) => this.changeTab(tab, index)}
        >
          <div>
            {this.CreateFormManFun()}
          </div>

          <div>
            {this.CreateFormManFun2()}
          </div>
        </Tabs>
      </div>

    );
  }
}
export default SituOntheWay
