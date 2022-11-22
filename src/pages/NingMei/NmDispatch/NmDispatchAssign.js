import { ListView,Flex,PullToRefresh,Button,Modal, NavBar,Card } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Alert, Col, Form, Icon, message, Row,List } from 'antd';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import QRCode from 'qrcode.react'
import func from '@/utils/Func';
import {getQueryConf} from '@/components/Matrix/MatrixQueryConfig';
import { nanoid } from 'nanoid';
import { COMMONBUSINESS_LIST } from '../../../actions/commonBusiness';
import { getColums, getTenantId } from "../../Merchants/commontable";
import { getButton } from '../../../utils/authority';
import { FormattedMessage } from 'umi/locale';
import { requestApi } from '../../../services/api';
import { getVerifyTime, submit } from '@/services/commonBusiness';
import './Matrix.less';
import { handleDate, handleDateIsRange } from '@/components/Matrix/commonJs';

const FormItem = Form.Item;
const Item = List.Item;

const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

@connect(({ tableExtend,commonBusiness,loading }) => ({
  tableExtend,
  commonBusiness,
  loading: loading.models.commonBusiness,
}))
@Form.create()


class NmDispatchAssign extends React.Component {

}

export default NmDispatchAssign;
