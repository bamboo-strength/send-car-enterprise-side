import React, {Component} from 'react'
import {Card,NavBar,Icon,Toast } from 'antd-mobile';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';
import styles from '@/layouts/Sword.less';
import router from 'umi/router';
import { connect } from 'dva';
import { detail } from '@/services/commonBusiness';
import { getToken,getCurrentUser } from '@/utils/authority';
import {message} from 'antd';
import TableFor847975 from  './TableFor847975'
import TableFor947229 from  './TableFor947229'
import TableFor187382 from  './TableFor187382'


@connect(({ commonBusiness,loading }) => ({
  commonBusiness,
  loading: loading.models.commonBusiness,
}))
class ElectronicList extends Component {


  state = {
    detailData:{},
  };

  componentWillMount() {
    const {
      match: {
        params: {id,tableName,modulename},
      },
    } = this.props;
    detail({realId:id, tableName,modulename}).then(resp => {
      const listData = resp.data;
      this.setState({
        detailData:listData.resultData
      })
    })
  }

  downloadPdf = () => {
    const element = document.getElementById('demo');  // 这个dom元素是要导出的pdf的div容器
    if(element){
      /*    const w = element.offsetWidth;  // 获得该容器的宽
         const h = element.offsetHeight;  // 获得该容器的高
         const {offsetTop} = element; // 获得该容器到文档顶部的距离
         const {offsetLeft} = element; // 获得该容器到文档最左的距离
        const canvas = document.createElement("canvas");
         let abs = 0;
         const win_i = document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
         const win_o = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）
         if(win_o > win_i){
           abs = (win_o - win_i) / 2; // 获得滚动条宽度的一半
         }
         // canvas.width = w * 2; // 将画布宽&&高放大两倍
         // canvas.height = h * 2;
         canvas.width = w * 2; // 将画布宽&&高放大两倍
         canvas.height = h * 2;
         const context = canvas.getContext('2d');
         context.scale(2, 2);
         context.translate(-offsetLeft - abs, -offsetTop); */
      // 这里默认横向没有滚动条的情况，因为offset.left()，有无滚动条的时候存在差值，因此translate的时候，要把这个差值去掉
      html2canvas(element, {
        allowTaint: true,
        scale: 2 // 提升画面质量，但是会增加文件大小
      }).then( canvas => {
        const contentWidth = canvas.width;
        const contentHeight = canvas.height;
        // 一页pdf显示html页面生成的canvas高度
        const pageHeight = contentHeight / 99 * 220;
        // 未生成pdf的html页面高度
        let leftHeight = contentWidth;
        // 页面偏移
        let position = 0;
        // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        const imgWidth = 340;
        const imgHeight = 340 / contentWidth * contentHeight;
        const pageDate = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'pt', 'a4');
        // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面的高度（841.89）
        // 当内容未超过pdf一页显示的范围，无需分页SS
        if(leftHeight < pageHeight) {
          //  alert("不分页！")
          pdf.addImage(pageDate,'JPEG', 100, 100, imgWidth, imgHeight);
        }else { // 分页
          //   alert("分页！！！！")
          while (leftHeight > 0){
            pdf.addImage(pageDate, 'JPEG', 10, 0, imgWidth, imgHeight)
            leftHeight -= pageHeight;
            position -= 220;
            // 避免添加空白页
            if(leftHeight > 0){
              pdf.addPage()
            }
          }
        }
        //   pdf.save('电子磅单.pdf');
        const dataUrl=  pdf.output('datauristring') // jsPDF的output方法返回的字符串处理后得到base64的加密字符串
        // base64转为blob文件
        const binary = atob(dataUrl.split(',')[1]);
        const mime = dataUrl.split(',')[0].match(/:(.*?);/)[1];
        const array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        const fileData = new Blob([new Uint8Array(array)], {
          type: mime,
        });
        const file = new File([fileData], '电子磅单.pdf', { type: mime });
        // 传文件流提交后端上传服务器
        this.toSubmit(file)
      })
    }
  }

  downloadImg=()=>{
    const element = document.getElementById('demo');
    if(element) {
      html2canvas(element, {
        allowTaint: true,
        scale: 2 // 提升画面质量，但是会增加文件大小
      }).then( canvas => {
        const dataUrl = canvas.toDataURL("image/jpeg")
        const binary = atob(dataUrl.split(',')[1]);
        const mime = dataUrl.split(',')[0].match(/:(.*?);/)[1];
        const array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        const fileData = new Blob([new Uint8Array(array)], {
          type: mime,
        });
        const file = new File([fileData], '电子磅单.jpg', { type: mime });
        // 传文件流提交后端上传服务器
        this.toSubmit(file)
      })
    }
  }




  // 提交后端上传服务器
  toSubmit = (file) => {
    // console.log(file,'===file')
    const formData = new FormData()
    formData.append('file', file);
    formData.append('filename','');
    const myToken = getToken();
    fetch('/api/mer-driver-vehicle/certificatesClient/get-upload',{
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
      .then((response) => {
        if(response.success){
          if(window.__wxjs_environment === 'miniprogram'){ // 微信小程序
            wx.miniProgram.navigateTo({url: `/pages/shashi/download?url=${response.data}`})
          }else {
            window.location.href=response.data
          }

        }else{
          message.error('文件出错！');
        }
      })

  }

  test=()=>{
    // http://test.minio.dachebenteng.com/847975-kspt-driver/upload/2021/10/11/1447407329472540674%E7%94%B5%E5%AD%90%E7%A3%85%E5%8D%95.pdf
  //  const aa = 'http://test.minio.dachebenteng.com/847975-kspt-driver/upload/2021/10/11/1447407329472540674%E7%94%B5%E5%AD%90%E7%A3%85%E5%8D%95.pdf'
   const aa = 'http://test.minio.dachebenteng.com/847975-kspt-driver/upload/2021/06/26/220shashi_driver_admin1408716730900942849blob'
    wx.miniProgram.navigateTo({url: `/pages/shashi/download?url=${aa}`})
  }


  downloadFile=()=>{
    if(window.__wxjs_environment === 'miniprogram'){ // 微信小程序
      this.downloadImg()
    }else {
      this.downloadPdf()
    }
  }

  showPageByTenant=()=>{
    const {detailData}=this.state
    const currentTenant = getCurrentUser().tenantId;
    if(currentTenant === '947229' ){
      return  <TableFor947229 detailData={detailData} />
    }
    if(currentTenant === '847975'){
      return <TableFor847975 detailData={detailData} />
    }
    if(currentTenant === '187382'){ // 宝兴
      return <TableFor187382 detailData={detailData} />
    }
    return <TableFor947229 detailData={detailData} />
  }

  render() {
    const {
      match: {
        params: {tableName,modulename},
      },
    } = this.props;

    const address=`/commonBusiness/commonList/${tableName}/${modulename}`
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(address)}
          rightContent={[
            <a onClick={this.downloadFile}>下载</a>,
          ]}
        >{getCurrentUser().tenantId === '187382'?'电子准运证':'电子磅单'}
        </NavBar>
        <div className='am-list'>
          <Card className={styles.card} bordered={false} style={{height:'550px',display: 'flex',justifyContent: 'center',alignItems: 'center',marginLeft:'-20px'}}>
            <div
              id='demo'
              style={{
                transform: 'rotate(-90deg)',
                msTransform:'rotate(-90deg)', /* IE 9 */
                mozTransform: 'rotate(-90deg)',/* Firefox */
                webkitTransform: 'rotate(-90deg)', /* Safari and Chrome */
                oTransform: 'rotate(-90deg)', /* Opera */
                // marginTop:'15em',
                width: '485px',
                paddingRight:'20px'
                // marginLeft: '-15%',
               // position:'absolute'
              }}
            >
              {
                this.showPageByTenant()
              }


            </div>

          </Card>

        </div>
      </div>
    )
  }
}


export default ElectronicList;
