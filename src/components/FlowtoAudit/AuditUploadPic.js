import React, {PureComponent} from 'react';
import { Form, Drawer, Button,Upload, Icon, message  } from 'antd';
import { connect } from 'dva';
import { getToken } from '@/utils/authority';

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.models.audit,
}))
@Form.create()
class AuditUploadPic extends PureComponent{

  state = {
    visible: false,
    fileList: [],
    uploading: false,
    orderHandelId: '',
  };

  componentWillMount() {
    const {orderHandelId} = this.props;
    this.setState({
      orderHandelId: orderHandelId,
    });
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


  handleUpload = () => {
    const { fileList } = this.state;

    console.log(fileList)
    const formData = new FormData();

    fileList.map((value,index,arr) => {
      formData.append('file', value);
      return value;
    })
    console.log('订单信息');
    console.log(this.state.orderHandelId);
    formData.append('orderHandelId', this.state.orderHandelId);

    this.setState({
      uploading: true,
    });

    // 上传图片
    const myToken = getToken();

    fetch('/api/shippers-flowpic/flowMonipic/uploadAuditPhoto',{
      method:'POST',
      headers: {
        'Authorization':'Basic c3dvcmQ6c3dvcmRfc2VjcmV0',
        'Blade-Auth': myToken,
      },
      name: 'file',
      body: formData,
      mode:'cors',
      cache:'default'
    })
      .then(res =>res.json())
      .then((data) => {
        // console.log(data)
        if(data.success){
          this.setState({
            fileList: [],
            uploading: false,
          });
          message.success('上传成功！');
        }else{
          this.setState({
            uploading: false,
          });
          message.error('上传失败！');
        }
      })
  };


  render() {
    const { uploading, fileList } = this.state;
    const props1 = {
      accept: 'image/*',
      listType: 'picture',
      multiple: true,
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Button type="primary" onClick={this.showDrawer}>
          <Icon type="upload" /> 上传图片
        </Button>

        <Drawer
          title="上传图片"
          width={650}
          placement="left"
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Upload {...props1}>
            <Button>
              <Icon type="upload" /> 请选择图片
            </Button>
          </Upload>
          <Button
            type="primary"
            onClick={this.handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? '上传中' : '开始上传'}
          </Button>

        </Drawer>
      </div>
    );
  }
}

export default AuditUploadPic;
