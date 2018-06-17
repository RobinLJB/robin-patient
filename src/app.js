import 'weui';
import 'bulma';
import 'owo/dist/OwO.min.css';
import './robin-live.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, HashRouter, Switch, Redirect} from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import {Toast, Toptips} from 'react-weui';
import Websocket from 'react-websocket';

import './component/component';
import Socket from './component/socket';
import Store from './redux/redux';
import Main from './main';
import Subscribe from './subscribe/subscribe';
import Menu from './menu/menu';
import MediaPlay from './menu/mediaPlay';
import Http from './component/http';

class App extends React.Component {

  state = {
    CODE: Store.getState().CODE,
    USERINFO: Store.getState().USERINFO,
    SHOWTOAST: Store.getState().SHOWTOAST,
    TOASTTEXT: Store.getState().TOASTTEXT,
    TOASTTIMER: null,
    USERREQUESTSUCCESS: Store.getState().USERREQUESTSUCCESS
  }

  componentDidMount() {
    this.unSubscribe = Store.subscribe(() => {
      const me = this;
      this.setState(Store.getState());
    });

    //发送登陆请求 获取直播消息
    this.refs.userInfo.get();

    this.history = this.refs.route.history;
    //绑定history 到React变量上
    React.history = this.history;
  }

  componentWillUnmount() {
    this.state.TOASTTIMER && clearTimeout(this.state.TOASTTIMER);
    this.unSubscribe();
  }

  render() {
    const me = this;
    return (<div>
      <Http ref="userInfo" url={this.state.USERINFO} param={{
        code: this.state.CODE
      }} headers={{
        'Access-Control-Allow-Origin' : '*'
      }} onload={(xhr, body) => {
        let json = body;
        console.log(JSON.stringify(json));
        if (json.success) {
          let data = json.data;
          Store.dispatch({
            type: 'ALL',
            APPID: data.appid || '-1',
            NONCESTR: data.noncestr || '-1',
            TIMESTAMP: data.timestamp || 100,
            SIGNATURE: data.signature || '-1',
            OPENID: data.openid || '-1',
            NAME: data.nickname || '匿名用户',
            HEADPIC: data.headimgurl
              ? decodeURI(data.headimgurl).replace(/\\/g, '')
              : 'head.png',
            // STREAMURL: data.streamurl?decodeURI(data.streamurl):null,
            // POSTER : data.poster?decodeURI(data.poster):null,
            // TITLE : data.title?data.title:'',
            // SUBJECT : data.subject?data.subject:'',
            // STREAMURL: data.streamurl?decodeURI(data.streamurl):'http://pull.robinluo.top/dffe97a7a7ef4d2ba3b8bcab47fda716/3246150f8fb44c2da73239f63a14f759-fa1a738cfcb2db7d798521ab0874c3b4-sd.m3u8',
            // THUMBUP: data.thumbUp||0,
            // AUDIENCE: data.audience||0,
            USERREQUESTSUCCESS: true
          });
        } else {
          console.log('请求失败 跳转');
          //me.history.replace("/subscribe");
          Store.dispatch({type: 'ALL', USERREQUESTSUCCESS: true});
        }
      }
      } onerror={() => {
        console.log('请求异常');
        me.history.replace('/subscribe');
        Store.dispatch({type: 'ALL', USERREQUESTSUCCESS: true});
      }}></Http>
      <HashRouter ref="route">
        <Switch>
          <Route path="/" component={Main} exact={true}/>
          <Route path="/subscribe" component={Subscribe}/>
          <Route path="/menu" component={Menu}/>
          <Route path="/media/:id" component={MediaPlay}/>
        </Switch>
      </HashRouter>
      {
        this.state.USERREQUESTSUCCESS
          ? <Socket/>
          : <div/>
      }
      <Toast icon="loading" show={this.state.SHOWTOAST || !this.state.USERREQUESTSUCCESS}>{this.state.TOASTTEXT}</Toast>
    </div>);
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
