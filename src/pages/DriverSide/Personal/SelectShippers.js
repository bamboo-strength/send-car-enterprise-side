import React from 'react';
import {  NavBar ,Button,List,Flex} from 'antd-mobile';
import router from 'umi/router';
import { Form, Icon,  } from 'antd';
import { getRelationTenant } from '../../../services/defaultShippers';

const {Item} = List;
@Form.create()
class SelectShippers extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      tenantData: '',
    };
  }

  componentWillMount() {
    getRelationTenant().then(resp =>{
      this.setState({
        tenantData:resp.data

      })
    })

  }

  render() {
    const {tenantData} = this.state

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
        >默认发货方
        </NavBar>
        <List>
          <Item key={tenantData.id}>
            <Flex>
              <Flex.Item>{tenantData.relationTenantName}</Flex.Item>
              <Button type="primary" size='small' inline style={{float: 'right',marginRight:'10px'}} onClick={()=> {router.push('/driverSide/personal/defaultShippersList')}}>
                修改
              </Button>
            </Flex>
          </Item>
        </List>
      </div>
    );
  }

}

export default SelectShippers;
