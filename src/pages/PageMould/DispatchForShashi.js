import React from 'react';
import { connect } from 'dva';
import { Flex, List, Modal, Toast } from 'antd-mobile';
import { Card } from 'antd';
import router from 'umi/router';
import Text from 'antd/lib/typography/Text';
import style from './IndexDataList.less';

const { Item } = List;
const {alert} = Modal;
@connect(({ merDriver }) => ({
  merDriver,
}))
class DispatchForShashi extends React.Component {

}

export default DispatchForShashi;


