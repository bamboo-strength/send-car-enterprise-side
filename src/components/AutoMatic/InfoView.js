import React, {PureComponent} from 'react';
import { Form, Drawer, Button, Input, Row, Col, Icon, message, Descriptions, List, Avatar  } from 'antd';
import { connect } from 'dva';

@Form.create()
class InfoView extends PureComponent{

  state = { visible: false, childrenDrawer: false };

  componentWillUnmount() {
    console.log('---infoshowDrawer---')
    // this.showDrawer();
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {




  this.setState({
      visible: false,
    });
  };

  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true,
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  };

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showDrawer}>
          Open drawer
        </Button>
        <Drawer
          title="Multi-level drawer"
          width={520}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Button type="primary" onClick={this.showChildrenDrawer}>
            Two-level drawer
          </Button>
          <Drawer
            title="Two-level Drawer"
            width={520}
            closable={false}
            onClose={this.onChildrenDrawerClose}
            visible={this.state.childrenDrawer}
          >
            This is two-level drawer
          </Drawer>
        </Drawer>
      </div>
    );
  }
}

export default InfoView;
