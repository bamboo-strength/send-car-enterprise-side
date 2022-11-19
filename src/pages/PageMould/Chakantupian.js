import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Icon, Button, message } from 'antd';
import { NavBar, Modal } from 'antd-mobile';
import { getAppPic, returnPic } from '../../services/photograph'

const alert = Modal.alert;
export default class Chakantupian extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data2: []
        };
    }
    componentWillMount() {
        const { location: { query: { list } } } = this.props;
        if (list) {
            if (list.pictype === '1') {
                getAppPic({ 'truckno': list.truckno, 'fhdh': list.fhdh, 'pictype': list.pictype + '' }).then(res => {
                    if (res.success) {
                        this.setState({
                            data: res.data,
                        })
                    }
                })
            }
            if (list.pictype === '2') {
                getAppPic({ 'truckno': list.truckno, 'fhdh': list.fhdh, 'pictype': list.pictype + '' }).then(res => {
                    if (res.success) {
                        this.setState({
                            data2: res.data,
                        })
                    }
                })
            }
            if (list.pictype === '0') {
                getAppPic({ 'truckno': list.truckno, 'fhdh': list.fhdh, 'pictype': '1' }).then(res => {
                    if (res.success) {
                        this.setState({
                            data: res.data,
                        })
                    }
                })
                getAppPic({ 'truckno': list.truckno, 'fhdh': list.fhdh, 'pictype': '2' }).then(res => {
                    if (res.success) {
                        this.setState({
                            data2: res.data,
                        })
                    }
                })
            }
        }

    }
    czhongche = () => {
        const { data2 } = this.state;
        if (data2.length === 0) {
            const alertInstance = alert('提示', '是否确定重新上传', [
                { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
                { text: '确定', onPress: () => this.queren() },
            ]);
            setTimeout(() => {
                // 可以调用close方法以在外部close
                console.log('auto close');
                alertInstance.close();
            }, 500000);
        } else {
            const alertInstance = alert('提示', '上传空车图片后，不能重新上传重车图片', [
                { text: '确定', onPress: () => console.log('cancel') },
            ]);
            setTimeout(() => {
                // 可以调用close方法以在外部close
                alertInstance.close();
            }, 500000);
        }


    }
    ckongche = () => {
        const alertInstance = alert('提示', '是否确定重新上传', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => this.querens() },
        ]);
        setTimeout(() => {
            // 可以调用close方法以在外部close
            console.log('auto close');
            alertInstance.close();
        }, 500000);
    }
    //重新上传重车图片
    queren = () => {
        const { location: { query: { list } } } = this.props;
        if (list) {
            if (list.pictype === '1' || list.pictype === '0') {
                returnPic({ 'truckno': list.truckno, 'fhdh': list.fhdh, 'pictype': '1' }).then(res => {
                    if (res.success) {
                        message.success(res.msg);
                        router.push('/dashboard/menu')
                    } else {
                        message.success(res.msg);
                    }
                })
            }
        } else {
            const alertInstance = alert('提示', '缺少参数，不能重新上传', [
                { text: '确定', onPress: () => console.log('cancel') },
            ]);
            setTimeout(() => {
                // 可以调用close方法以在外部close
                console.log('auto close');
                alertInstance.close();
            }, 500000);
        }

    }
    //重新上传空车图片
    querens = () => {
        const { location: { query: { list } } } = this.props;
        if (list) {
            if (list.pictype === '2' || list.pictype === '0') {
                returnPic({ 'truckno': list.truckno, 'fhdh': list.fhdh, 'pictype': '2' }).then(res => {
                    if (res.success) {
                        message.success(res.msg);
                        router.push('/dashboard/menu')
                    } else {
                        message.success(res.msg);
                    }
                })
            }
        } else {
            const alertInstance = alert('提示', '缺少参数，不能重新上传', [
                { text: '确定', onPress: () => console.log('cancel') },
            ]);
            setTimeout(() => {
                // 可以调用close方法以在外部close
                console.log('auto close');
                alertInstance.close();
            }, 500000);
        }

    }
    render() {
        const { data, data2 } = this.state
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
                    查看图片
                </NavBar>
                <div style={{ width: '100%', paddingTop: '50px' }}>
                    <h2 style={{ margin: '0px', width: '100%', textAlign: "center" }}>重车图片</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        {
                            data.map(item => (
                                <img src={item.picurl} width='49%' height={140} style={{ marginTop: '10px' }}></img>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <h2 style={{ margin: '0px', width: '100%', textAlign: "center" }}>空车图片</h2>
                    <div>
                        {
                            data2.map(item => (
                                <img src={item.picurl} width='49%' height={150} style={{ marginTop: '10px' }}></img>
                            ))
                        }
                    </div>
                </div>
                <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px auto' }}>
                    <Button type="danger" onClick={this.czhongche}>重新上传重车</Button>
                    <Button type="danger" onClick={this.ckongche}>重新上传空车</Button>
                </div>
            </div>
        )
    }
}