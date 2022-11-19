/* eslint-disable import/prefer-default-export */
import { Modal, Toast,} from 'antd-mobile';

// 弹框确认方法
export function modalConfirm(title,path,params,refresh) {
  // return new Promise((resolve) => {
    Modal.alert('',  `确定${title}该数据?`, [
      { text: '取消', style: 'default' },
      {
        text: '确认', onPress: () => {
          Toast.loading('加载中...', 0);
          path(params).then(resp => {
            Toast.hide();
            if (resp?.success) {
              Toast.success('操作成功！');
              // 操作请求成功后刷新页面
              if (refresh) { refresh(); }
            }
          });
        },
      },
    ]);
  // })
}
