import React from 'react';
import {Panel, PanelHeader, PanelBody, Cells} from 'react-weui';
import Store from '@/redux/redux';
import MenuItem from '@/menu/menuItem';
import fa from 'font-awesome/css/font-awesome.min.css';
import Http from '@/component/http.js';
import SearchBar from '@/component/searchBar.js';
import wx from 'weixin-jsapi';

export default class Menu extends React.Component {

  state = {
    APPID: Store.getState().APPID,
    //视频列表
    VIDEOLIST: Store.getState().VIDEOLIST,
    //搜索Text
    searchText: '',
    //直播数据
    LIVEDATA: Store.getState().LIVEDATA,
    //视频列表
    MEDIADATA: Store.getState().MEDIADATA
  }

  onSearchChange = function(value) {
    //搜索文本改变时
    this.setState({searchText: value});
  }.bind(this)

  onSearchSubmit = function() {
    //TODO 后台搜索对应视频
    this.refs.videoList.get();
  }.bind(this)

  //取消搜索
  onSearchCancel = function() {
    //TODO 后台搜索对应视频
    const me = this;
    this.setState(() => {
      return {searchText: ''};
    }, () => {
      me.refs.videoList.get();
    });
  }.bind(this)

  //初始化微信配置
  initWXConfig = function() {
    if (React.isWeiXin()) {
      wx.config({
        appId: Store.getState().APPID, // 必填，公众号的唯一标识
        timestamp: Store.getState().TIMESTAMP, // 必填，生成签名的时间戳
        nonceStr: Store.getState().NONCESTR, // 必填，生成签名的随机串
        signature: Store.getState().SIGNATURE, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });

      wx.ready(function() {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.onMenuShareTimeline({
          title: '欢迎收看享点医直播', link: 'http://robinluo.top/wechat-xdy/wechat/redirectMedia', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://robinluo.top/xdy-live/head.png', // 分享图标
        });
        wx.onMenuShareAppMessage({
          title: '享点医', // 分享标题
          desc: '欢迎收看享点医直播, 本平台是牙医与患友O2O交流平台;汇聚口腔医学界知名医生.以服务牙医,关爱患友为宗旨.针对患友的服务主要有:网上咨询 挂号 求诊等服务;针对医生的服务有:口腔执业与助理医师考前培训 口腔主治医师考前培训 口腔医学类技术培训 网上接诊等.',
          link: 'http://robinluo.top/wechat-xdy/wechat/redirectMedia', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://robinluo.top/xdy-live/head.png', // 分享图标
        });
      });
    }
  }.bind(this)

  //状态更新时
  componentDidUpdate(oldProps, oldState) {
    if (this.state != null && this.state.APPID != null) {
      if (this.state.APPID != oldState.APPID) {
        this.initWXConfig();
      }
    }
  }

  //渲染前
  componentWillMount() {
    this.unSubscribe = Store.subscribe(() => {
      const me = this;
      this.setState(Store.getState());
    });
  }

  componentWillUnmount() {
    this.unSubscribe();
  }
  /**
    * 渲染后
    */
  componentDidMount() {
    //发送登陆请求 获取直播消息
    this.refs.videoList.get();
    if (this.state.APPID != null) {
      this.initWXConfig();
    }
  }

  /**
    * 渲染dom
    */
  render() {
    const me = this;
    return (<div className="text-center" style={{
      height: '100%'
    }}>
      <Http ref="videoList" url={this.state.VIDEOLIST} param={{
        name: this.state.searchText
      }} headers={{
        'Access-Control-Allow-Origin' : '*'
      }} onloading={() => {
        Store.dispatch({type: 'ALL', USERREQUESTSUCCESS: false});
      }} onload={(xhr, body) => {
        let json = body;
        console.log(JSON.stringify(json));
        if (json.success) {
          let data = json.data;
          Store.dispatch({type: 'ALL', USERREQUESTSUCCESS: true, LIVEDATA: data.liveData, MEDIADATA: data.mediaData});
        } else {
          console.log('请求失败 跳转');
          me.history.replace('/subscribe');
          Store.dispatch({type: 'ALL', USERREQUESTSUCCESS: true});
        }
      }
      } onerror={() => {
        console.log('请求异常');
        Store.dispatch({type: 'ALL', USERREQUESTSUCCESS: true});
      }}></Http>
      <PanelHeader className='has-text-left hero is-primary' style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0
      }}>
        <p>
          <span className="is-size-6">享点医</span>影视点播</p>
      </PanelHeader>
      <SearchBar defaultValue={this.state.searchText} placeholder="点播服务搜索" lang={{
        submit: '搜索',
        cancel: '取消'
      }} onSubmit={this.onSearchSubmit
      } onCancel={this.onSearchCancel} onChange={this.onSearchChange} onClear={this.onSearchCancel} autocomplete="on" className="top"/>
      <Panel style={{
        marginTop: '92px'
      }}>
        <Panel>
          <PanelHeader className="has-text-left hero is-primary">
            <i className={fa.fa + ' ' + fa['fa-video-camera']}>&nbsp;&nbsp;享点医直播</i>
          </PanelHeader>
          <PanelBody>
            {
              this.state.LIVEDATA.map((item, i) => {
                return <MenuItem key={i} id={item.id} url={item.url} icon={item.poster} label={item.name} audience={item.audience} thumbUp={item.thumbUp} type={item.type} isBroadcasting={item.isBroadcasting} />;
              })
            }
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader className="has-text-left hero is-primary">
            <i className={fa.fa + ' ' + fa['fa-television']}>&nbsp;&nbsp;享点医视频</i>
          </PanelHeader>
          <PanelBody>
            {
              this.state.MEDIADATA.map((item, i) => {
                return <MenuItem key={i} id={item.id} url={item.url} icon={item.poster} label={item.name} audience={item.audience} thumbUp={item.thumbUp} type={item.type} isBroadcasting={item.isBroadcasting} />;
              })
            }
          </PanelBody>
        </Panel>
      </Panel>
    </div>);
  }
}
