import { createStore } from 'redux';
import querystring from 'component-querystring';

/**
 * 该对象用作初始化页面信息  store变量全为大写
 */

let param1 = location.toString().split('?')[1];
let param = {};
if(param1) {
  let param2 = param1.split('#')[0];
  param = querystring.parse(param2) || {};
}

const InitState = {
  APPID : null,
  NONCESTR : null,
  TIMESTAMP : null,
  SIGNATURE : null,
  CODE: param.code,
  USERID: undefined,
  OPENID: '-1',
  NAME: '匿名用户',
  HEADPIC: 'head.png',
  USERINFO: `http://${LOCAL_ROOT}/wechat-xdy/wechat/userInfo`,
  CHANNELINFO: `http://${LOCAL_ROOT}/wechat-xdy/media//channelInfo`,
  LIVEINFO: `http://${LOCAL_ROOT}/wechat-xdy/media/liveInfo`,
  VIDEOLIST:`http://${LOCAL_ROOT}/wechat-xdy/media/videoList`,
  THUMBUPURL:`http://${LOCAL_ROOT}/wechat-xdy/media/thumbUp`,
  AUDIENCEURL:`http://${LOCAL_ROOT}/wechat-xdy/media/audience`,
  ERRORURL: `http://${LOCAL_ROOT}/xdy-live/#/subscribe`,
  COMMENTURL: `http://${LOCAL_ROOT}/wechat-xdy/media/lastComment`,
  SOCKETURL: `ws:${LOCAL_ROOT}/wechat-xdy/live`,
  MESSAGEURL : `http://${LOCAL_ROOT}/wechat-xdy/media/comment`,
  STREAMURL: null,
  TITLE : '',
  SUBJECT : '',
  // STREAMURL: 'http://pull.robinluo.top/dffe97a7a7ef4d2ba3b8bcab47fda716/3246150f8fb44c2da73239f63a14f759-fa1a738cfcb2db7d798521ab0874c3b4-sd.m3u8',
  THUMBUP: 0,
  HASTHUMBUP: false,
  AUDIENCE: 0,
  WS: null,
  CLICKNAV: 0,
  LIVEDATA:[],
  MEDIADATA:[],
  COMMENTS:[],
  // COMMENTS: [
  // 	{
  // 		'userid' : '-1',
  // 		'openid' : '-1',
  // 		'name' : '享点医',
  // 		'headPic' : 'head.png' ,
  // 		'detail' : '😀 欢迎观看：享点医直播',
  // 	}
  // ],
  SHOWTOAST: false,
  TOASTTEXT: '正在加载中',
  USERREQUESTSUCCESS: false,
};

const reducer = (state, newState) => {
  let mergeState = {};
  Object.assign(mergeState, state, newState);
  return mergeState;
};

const Store = createStore(reducer, InitState);

const dispatch = Store.dispatch;

//订阅方法执行后  返回的结果  是一个取消的订阅的方法
const subscribe = Store.subscribe;

Store.InitState = InitState;

export {
  InitState,
  dispatch,
  subscribe
};

export default Store;
