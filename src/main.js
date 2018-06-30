import React from 'react';
import ReactDOM from 'react-dom';
import {
  Tab,
  NavBarItem,
  Button,
  Panel,
  PanelHeader,
  PanelBody,
  Article,
  Dialog,
  CellHeader,
  CellBody,
  Input,
  Label,
  Form,
  FormCell
} from 'react-weui';
import Http from '@/component/http';
import Screen from '@/video/screen';
import Interaction from '@/interaction/interaction';
import CommentArea from '@/interaction/commentArea';
import Subject from '@/subject/subject';
import Detail from '@/detail/detail';
import Store from '@/redux/redux.js';
import wx from 'weixin-jsapi';
import '@/robin-live.css';

class Main extends React.Component {

  state = {
    APPID: Store.getState().APPID,
    LIVEINFO: Store.getState().LIVEINFO,
    CLICKNAV: Store.getState().CLICKNAV,
    POSTER: Store.getState().POSTER,
    TITLE: Store.getState().TITLE,
    SUBJECT: Store.getState().SUBJECT ,
    password : '',
    inputPassword : '',
    showDialog : true,
    dialogTitle : '享点医 提示'
  }

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
          title: '欢迎收看享点医直播', link: 'http://robinluo.top/wechat-xdy/wechat/redirectLive', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://robinluo.top/xdy-live/head.png', // 分享图标
        });
        wx.onMenuShareAppMessage({
          title: '享点医', // 分享标题
          desc: '欢迎收看享点医直播, 本平台是牙医与患友O2O交流平台;汇聚口腔医学界知名医生.以服务牙医,关爱患友为宗旨.针对患友的服务主要有:网上咨询 挂号 求诊等服务;针对医生的服务有:口腔执业与助理医师考前培训 口腔主治医师考前培训 口腔医学类技术培训 网上接诊等.',
          link: 'http://robinluo.top/wechat-xdy/wechat/redirectLive', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://robinluo.top/xdy-live/head.png', // 分享图标
        });
      });
    }
  }.bind(this)

  componentDidUpdate(oldProps, oldState) {
    if (this.state != null && this.state.APPID != null) {
      if (this.state.APPID != oldState.APPID) {
        this.initWXConfig();
      }
    }
  }

  componentWillMount() {
    this.unSubscribe = Store.subscribe(() => {
      const me = this;
      this.setState(Store.getState());
    });
    Store.dispatch({type: 'ALL', CLICKNAV: 0});
  }

  componentWillUnmount() {
    this.unSubscribe();
  }

  componentDidMount() {
    if (this.state.APPID != null) {
      this.initWXConfig();
    }
    this.refs.liveInfo.get();
  }

  render() {
    const me = this;
    const {history } = this.props;
    return (<div style={{
      height: '100%'
    }}>
      <Http ref="liveInfo" url={this.state.LIVEINFO} headers={{
        'Access-Control-Allow-Origin' : '*'
      }} onload={(xhr, body) => {
        let json = body;
        console.log(JSON.stringify(json));
        if (json.success) {
          let data = json.data;
          Store.dispatch({
            type: 'ALL',
            STREAMURL: data.url
              ? decodeURI(data.url)
              : null,
            POSTER: data.poster
              ? decodeURI(data.poster)
              : null,
            TITLE: data.name
              ? data.name
              : '',
            SUBJECT: data.subject
              ? data.subject
              : '',
            THUMBUP: data.thumbUp || 0,
            AUDIENCE: data.audience || 0,
            password: data.password || ''
          });
        }
      }
      } onerror={() => {
        console.log('请求异常');
      }}></Http>
      <Screen/>
      <div className="hero has-text-primary has-text-centered is-size-7" style={{
        'width' : '100vw',
        'overflow' : 'hidden'
      }}>
        <span className="marquee" >助你2018笔试顺利过关：张老师 微信13798197298</span>
      </div>
      <Tab type="navbar" onChange={idx => {
        Store.dispatch({type: 'ALL', CLICKNAV: idx});
      }
      }>
        <NavBarItem className="hero is-primary padding-xs has-text-centered" label="互动">
          <CommentArea/>
        </NavBarItem>
        <NavBarItem className="hero is-primary padding-xs has-text-centered" label="主题内容">
          <Subject title={this.state.TITLE} subject={this.state.SUBJECT}/>
        </NavBarItem>
        <NavBarItem className="hero is-primary padding-xs has-text-centered" label="详情介绍">
          <Detail/>
        </NavBarItem>
      </Tab>
      <Interaction ></Interaction>
      <Dialog type="ios" title={this.state.dialogTitle} buttons={[
        {
          label: '确定',
          onClick : ()=>{
            if(this.state.password==this.state.inputPassword){
              me.setState({
                showDialog : false
              });
            }else{
              me.setState({
                dialogTitle : '密码错误!'
              });
            }
          }
        }
      ]} show={this.state.showDialog&&this.state.password != ''}>
        <Form>
          <FormCell>
            <CellHeader>
              <Label style={{
                width : '60px'
              }}>密码: </Label>
            </CellHeader>
            <CellBody>
              <Input onChange={(e)=>{
                me.setState({
                  inputPassword : e.target.value
                });
              }} autoFocus={true} placeholder="输入观看密码" />
            </CellBody>
          </FormCell>
        </Form>
      </Dialog>
    </div>);
  }
}

export default Main;
