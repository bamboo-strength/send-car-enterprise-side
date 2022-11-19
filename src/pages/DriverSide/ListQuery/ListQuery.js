import { List, Button, Flex, NavBar,Modal } from 'antd-mobile';
import React, { PureComponent } from 'react';
import { createForm } from 'rc-form';
import { Icon } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import {LISTQUERY_LISTWITHOUTPAGE} from '../../../actions/listQuery'
import MatrixInput from '@/components/Matrix/MatrixInput';
import MatrixAutoComplete from '@/components/Matrix/MatrixAutoComplete';

const {Item} = List;



@connect(({ listQuery }) => ({
  listQuery,
}))

@createForm()
class ListQuery extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      showSearchModal:false
    };
  }

  componentWillMount() {
    this.queryDrivers()
  }

  queryDrivers=(name)=>{
    console.log(name)
    const {dispatch} = this.props
    dispatch(LISTQUERY_LISTWITHOUTPAGE({}))
  }

  // ************ 查询框
  showSearch = () => {
    this.setState({
      showSearchModal:true,
    })
  }

  onClose = () => {
    this.setState({
      showSearchModal:false
    })
  }

  render() {
    const {location,listQuery:{listData}} = this.props
    const {showSearchModal} = this.state
  //  console.log(listData,'---')


    const serarchForm = () => {
      const { form } = this.props;
      const items=[
        {key:'111',value:'test'}
      ]
      return (
        <List>
          <MatrixInput label="磅单号" id="truckno" placeholder="请输入磅单号" form={form} />
          <MatrixAutoComplete label='车号' placeholder='拼音码检索' dataType='vehicle' id='vehicle' labelId='vehicleName' form={form} style={{width: '100%'}} />
          <MatrixAutoComplete label='物资' placeholder='拼音码检索' dataType='goods' id='materialnos' labelId='materialnosName' form={form} style={{width: '100%'}} />
        </List>
      );
    };


    return (
      <div style={{padding:'0px 5px'}}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/function')}
          rightContent={[
            <Icon key="0" type="search" style={{fontSize:'24px',marginRight:'20px' }} onClick={() => this.showSearch()} />,
          ]}
        >榜单查询
        </NavBar>
        <List>
          {listData.map(i => (
            <Item key={i.id}>
              <Flex>
                <Flex.Item style={{lineHeight:'2.5'}}>
                  {i.time}<br />
                  {i.phone}<br />
                  {i.phone}<br />
                  {i.phone}<br />
                  {i.phone}<br />
                </Flex.Item>
              </Flex>
            </Item>
          ))}
        </List>
        <Modal
          visible={showSearchModal}
          transparent
          maskClosable
          onClose={() =>this.onClose()}
          popup
          animationType='slide-down'
          platform='android'
        >
          {serarchForm()}
          <div style={{marginTop:'8px',float:'right'}}>
            <Button type="primary" size='small' inline onClick={() =>this.query(1)} style={{marginLeft:'8px'}}>查询</Button>
            <Button type="primary" size='small' inline onClick={() =>this.reset()} style={{marginLeft:'15px'}}>重置</Button>
          </div>
        </Modal>
      </div>
    );
  }




}

export default ListQuery;
