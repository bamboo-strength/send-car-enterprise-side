import React, { PureComponent } from 'react';
import { Flex, List, Modal } from 'antd-mobile';
import router from 'umi/router';
import QRCode from 'qrcode.react';
import { connect } from 'dva';
import { Col, Icon, Spin } from 'antd';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import { clientId } from '@/defaultSettings';
import { getTenantId } from '../Merchants/commontable';
import { getGeneral, getMobileQuery } from '@/services/menu';
import func from '@/utils/Func';
import { paramByColumnSetting } from '@/components/Matrix/commonJs';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { requestListApi } from '@/services/api';
import inStyle from './IndexDataList.less';
import ListCompontents from '@/components/ListCompontents';
import DispatchForShashi from './DispatchForShashi';
import { getRoutes } from '../../utils/authority';
import { IconChangqu } from '@/components/Matrix/image';

const {Item} = List;
@connect(({tableExtend }) => ({
  tableExtend,
}))

class IndexDataList extends PureComponent{

}

export default IndexDataList
