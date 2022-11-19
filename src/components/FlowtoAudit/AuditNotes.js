import React, {PureComponent} from 'react';
import { Form, Drawer, Card, Button, Row, Col, Icon, message, TreeSelect } from 'antd';
import { connect } from 'dva';
import Func from '@/utils/Func';
import {AUDIT_GETNOTES} from '../../actions/audit';


@connect(({ audit, loading }) => ({
  audit,
  loading: loading.models.audit,
}))

@Form.create()
class AuditNotes extends PureComponent{

  constructor() {
    super();
    this.state = {
      visible: false,
      orderHandelId: '',
      notesContent: '',
    };
  }


  componentWillMount() {
    const {dispatch, orderHandelId} = this.props;
    if(Func.isEmpty(orderHandelId)){
      message.error("审核备注页未获取到订单ID");
      return;
    }else{
      this.setState({
        orderHandelId: orderHandelId,
      });
    }
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });

    const {dispatch, orderHandelId} = this.props;
    const payload = {
      orderHandelId: orderHandelId,
    };
    dispatch(AUDIT_GETNOTES(payload));
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  cascaderonChange = (status, result) => {
    const { auditNotes } = this.props;
    // console.log(result[0]);
    this.setState({
      notesContent:result[0],
    },function() {
      auditNotes(this.state);
    })
  }

  render() {
    const {
      audit:{
        NotesTree,
      },

    } = this.props;

    console.log(NotesTree)

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Button type="Default" onClick={this.showDrawer}>
          <Icon type="audit" /> 审核备注
        </Button>

        <Drawer
          title="选择审核备注"
          width='100%'
          height='60%'
          placement="bottom"
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <TreeSelect
            style={{ width: '300px'}}
            // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            onChange={this.cascaderonChange}
            treeData={NotesTree}
            allowClear
            showSearch
            treeNodeFilterProp="title"
            placeholder="请选择审核备注"
          />
        </Drawer>
      </div>
    );
  }
}

export default AuditNotes;
