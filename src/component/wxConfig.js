import React, { Component } from 'react';
import wx from 'weixin-jsapi';
import Store from '@/redux/redux';
import '@/component/component';


/*
* 微信配置component
*/
export default class WxConfig extends Component {

  state={
    APPID: Store.getState().APPID, // 必填，公众号的唯一标识
    TIMESTAMP: Store.getState().TIMESTAMP, // 必填，生成签名的时间戳
    NONCESTR: Store.getState().NONCESTR, // 必填，生成签名的随机串
    SIGNATURE: Store.getState().SIGNATURE // 必填，签名，见附录1
  }

  static defaultProps = {
    title : '欢迎收看享点医直播',
    link : 'http://robinluo.top/wechat-xdy/wechat/redirectLive',
    imgUrl : 'http://robinluo.top/xdy-live/head.png',
    desc : '欢迎收看享点医直播, 本平台是牙医与患友O2O交流平台;汇聚口腔医学界知名医生.以服务牙医,关爱患友为宗旨.针对患友的服务主要有:网上咨询 挂号 求诊等服务;针对医生的服务有:口腔执业与助理医师考前培训 口腔主治医师考前培训 口腔医学类技术培训 网上接诊等.'
  }

  render() {
    const {children} = this.props;
    return children ? (<div> {children}</div>) : null;
  }

  componentDidUpdate() {
    if (this.state != null && this.state.APPID != null) {
      this.initWXConfig();
    }
  }

  componentWillMount() {
    this.unSubscribe = Store.subscribe(() => {
      this.setState(Store.getState());
    });
  }

  componentDidMount() {
    if (this.state != null && this.state.APPID != null) {
      this.initWXConfig();
    }
  }

  initWXConfig = function() {

    const me = this;

    const {
      title ,
      link,
      imgUrl,
      desc
    } = this.props;

    const {
      APPID,
      TIMESTAMP,
      NONCESTR,
      SIGNATURE,
    } = this.state;

    if (React.isWeiXin()) {
      wx.config({
        appId : APPID, // 必填，公众号的唯一标识
        timestamp : TIMESTAMP, // 必填，生成签名的时间戳
        nonceStr : NONCESTR , // 必填，生成签名的随机串
        signature: SIGNATURE, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });

      wx.ready(function() {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.onMenuShareTimeline({
          title: title ,
          link: link , // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl // 分享图标
        });
        wx.onMenuShareAppMessage({
          title: title, // 分享标题
          desc: me.delHtmlTag(desc),
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl  // 分享图标
        });
      });
    }
  }.bind(this)

  delHtmlTag = function(str){
    return str.replace(/<[^>]+>/g,'').replace(/&nbsp;/ig, '').trim();//去掉所有的html标记
  }.bind(this)
}
