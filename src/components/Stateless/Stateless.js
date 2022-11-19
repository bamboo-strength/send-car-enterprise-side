import React from 'react';
import './Stateless.less';
import { ImagePageFault, img990 } from '@/components/Matrix/image';
import { Button, Spin } from 'antd';
import style from '@/pages/ShopCenter/ShopCenter.less';
import { Result } from 'antd-mobile';

/* 空白数据占位符 */
const heights = 'calc( 100vh - 100px)';

export function EmptyData(props) {
  const { text, height } = props;
  return (
    <div className='emptyData divBg' style={{ height: height || heights }}>
      <img src={img990} alt=''/>
      <h2>{text || '暂无数据'}</h2>
    </div>
  );
}

/* 加载中组件 */
export function InTheLoad(props) {
  const { size, tip, height } = props;
  return (
    <div className='emptyData divBg' style={{ height: height || heights }}>
      <Spin size={size || 'large'} tip={tip || '加载中'}/>
    </div>
  );
}

// 固定底部提交框
export function SubmitBtn(props) {
  const { loading, onClick } = props;
  return (
    <div style={{ background: 'white', padding: 15, position: 'fixed', bottom: 0, width: '100%', zIndex: 1 }}>
      <Button type="primary" size="large" block loading={loading} onClick={onClick}>提交</Button>
    </div>
  );
}

/* 页面出错 */
export function PageFault(props) {
  const { title } = props;
  return (
    <div className={`${style.shopCenter} am-list`}>
      <Result
        imgUrl={ImagePageFault}
        title={title || '页面出错'}
        className='page-fault-result'
      />
    </div>
  );
}

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

// 修复触摸在iOS上滚动背景页面
export const onWrapTouchStart = (e) => {
  // fix touch to scroll background page on iOS
  if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
    return;
  }
  const pNode = closest(e.target, '.am-modal-content');
  if (!pNode) {
    e.preventDefault();
  }
};

// 封装防抖方法
export function antiShake(fn, wait) {
  let timeOut = null; // 创建一个标记用来存放定时器的返回值
  return args => {
    // 每当用户输入的时候把前一个 setTimeout clear 掉
    if (timeOut) clearTimeout(timeOut);
    // fn 传入的方法，wait 传入的时间
    // 然后创建一个新的 setTimeout，这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
    timeOut = setTimeout(() => {
      // 改变 this 指向
      fn.call(this, args);
    }, wait);
  };
}
