import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Icon, Button, message } from 'antd';
import { NavBar, Modal } from 'antd-mobile';
import { picupload, getPhotoList } from '../../services/photograph';
import { getToken } from '../../utils/authority'

const alert = Modal.alert;
export default class Zhongchepaizhao extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bgImg: '',
            nums: 0,
            remark: '',
            imgsrc: '',
            name: '',
            currentlng: '',
            currentlat: '',
            value: [],
            picorder:0
        };
    }
    componentWillMount() {
        const { location: { query: { data } } } = this.props
        this.setState({
            nums:data.nums,
            picorder:data.picorder
        })
        this.getlist()
        const state = LocationStatus.getLocationStatus();
        if (JSON.stringify(JSON.parse(state)) === 'false') {
            Toast.offline('请检查定位开启状态！！');
        } else {
            const location = Location.getLocation();
            const longitude = JSON.stringify(JSON.parse(location).longitude)
            const latitude = JSON.stringify(JSON.parse(location).latitude)
            this.setState({
                currentlng: longitude,
                currentlat: latitude
            })
        }
    }
    getlist = ()=>{
        const { location: { query: { data } } } = this.props
        getPhotoList({ 'picType': '1', 'allnums': data.allnums, 'orderid': data.orderid }).then(res => {
            if (res.success) {
                this.setState({
                    imgsrc: res.data[this.state.nums].imgsrc,
                    remark: res.data[this.state.nums].remark,
                    name: res.data[this.state.nums].name,
                })
            }
        })
    }
    handleCamera = (e) => {
        //e.target.value 获取到图片的地址路径
        //e.target.files 值为数组，图片的名字，图片大小,图片类型等图片信息
        let _this = this;
        let file = e.target.files[0];
        let reader = new FileReader();//FileReader对象允许Web应用程序异步读取存储在用户计算机上的文件,使用 File 或 Blob 对象指定要读取的文件或数据。
        if (file && file.type.match('image.*')) {//file为真且file的类型是图片
            reader.readAsDataURL(file)//readAsDataURL 方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，readyState 会变成已完成DONE，并触发 loadend 事件，同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。
        }
        console.log(reader);
        reader.onloadend = function (ev) {//读取完成，触发loadend事件·
            _this.setState({
                bgImg: ev.target.result
            })
        }
    }
    shuangchuan = () => {
        const { location: { query: { data } } } = this.props
        const { bgImg,picorder ,currentlng,currentlat} = this.state
        let bytes = window.atob(bgImg.split(',')[1]);
        let array = [];
        for (let i = 0; i < bytes.length; i++) {
            array.push(bytes.charCodeAt(i));
        }
        let blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('file', blob, Date.now() + '.jpg');
        formData.append('picorder', picorder + "");
        formData.append('pictype', '1');
        formData.append('x', currentlng + "");
        formData.append('y', currentlat + "");
        formData.append('remark', data.remark + "");
        formData.append('truckno', data.truckno + "");
        formData.append('orderId', data.orderid);
        const myToken = getToken();

        fetch('/api/other-weixin/weixin/uppic/picupload', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic c3dvcmQ6c3dvcmRfc2VjcmV0',
                'Blade-Auth': myToken,
            },
            name: 'file',
            body: formData,
            mode: 'cors',
            cache: 'default'
        })
            .then(res => res.json())
            .then((datas) => {
                // console.log(data)
                if (datas.success) {
                    if (parseInt(datas.data.picorder) >  parseInt(datas.data.allnums)) {
                        message.success('上传成功！');
                        let list ={
                            pictype:'1',
                            fhdh:data.fhdh,
                            truckno:data.truckno
                        }
                        const alertInstance = alert('提示', '所有图片上传成功', [
                            { text: '确定', onPress: () => router.push({pathname:'/dashboard/shangchuanchenggong',query:{list:list}}) },
                        ]);
                        setTimeout(() => {
                            // 可以调用close方法以在外部close
                            console.log('auto close');
                            alertInstance.close();
                        }, 500000);
                        return;
                    } else if (parseInt(datas.data.upNums) == parseInt(datas.data.perNums)) {
                        const alertInstance = alert('提示', `${datas.msg}今日重车拍照已达到上限`, [
                            { text: '确定', onPress: () => router.push({pathname:'/dashboard/menu'}) },
                        ]);
                        setTimeout(() => {
                            // 可以调用close方法以在外部close
                            console.log('auto close');
                            alertInstance.close();
                        }, 500000);
                        return;
                    }else{
                        this.setState({
                            nums: parseInt(datas.data.upNums),
                            bgImg: '',
                            picorder: parseInt(datas.data.picorder)
                        })
                        this.getlist()
                        message.success('上传成功！');
                    }
                } else {
                    message.error('上传失败！');
                }
            })
    }
    shuoming = () => {
        const { remark, name } = this.state
        const alertInstance = alert(`${name}说明`, <p>{remark}</p>, [
            { text: '确定', onPress: () => console.log('ok') },
        ]);
        setTimeout(() => {
            // 可以调用close方法以在外部close
            console.log('auto close');
            alertInstance.close();
        }, 500000);
    }
    render() {
        const { imgsrc, name } = this.state
        return (
            <div>
                <NavBar
                    mode="light"
                    leftContent={[
                        <Icon
                            key="0"
                            type="left"
                            // theme="twoTone"
                            style={{ marginRight: '16px', fontSize: 20 }}
                            onClick={() => router.push('/dashboard/menu')}
                        />,
                    ]}
                >
                    重车车头拍照
                </NavBar>
                <div style={{ height: '130px' }}>
                    <p style={{ color: 'red', paddingTop: '60px', paddingLeft: '40px' }}>*点击上方标题可返回首页重试</p>
                    <p style={{ color: 'red', paddingLeft: '40px' }}>*点击下方图片可查看拍照说明</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={imgsrc} width='85%' height={160} onClick={this.shuoming} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
                    <h2>{name}</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                    <img src={this.state.bgImg === '' ? './image/main02.png' : this.state.bgImg} width='85%' height={160} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '30px', position: 'relative' }}>
                    <Button type="danger" style={{ position: 'absolute', left: '7.5%', width: '85%', display: this.state.bgImg !== '' ? 'none' : 'block' }}>点击拍照</Button>
                    <Button type="danger" style={{ position: 'absolute', left: '7.5%', width: '40%', display: this.state.bgImg !== '' ? 'block' : 'none' }} onClick={this.shuangchuan} >确认上传</Button>
                    <Button type="danger" style={{ position: 'absolute', left: '51%', width: '40%', display: this.state.bgImg !== '' ? 'block' : 'none' }}>重新拍照</Button>
                    <input type="file" accept="image/*" capture="camera" onChange={this.handleCamera.bind(this)}
                        style={{ opacity: 0, width: this.state.bgImg !== '' ? '42.5%' : '85%', position: 'absolute', left: this.state.bgImg !== '' ? '51%' : '7.5%', }} />
                </div>
            </div>
        )
    }
}
