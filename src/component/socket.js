import React from 'react';
import Websocket from 'react-websocket';

import Store from '../redux/redux';

/**
 * 	往websocket 添加发送消息方法 
 * @param {Object} message
 */
Websocket.prototype.sendMessage = function(message) {
  let websocket = this.state.ws;
  websocket.send(message);
};

export default class Socket extends React.Component {

	state = {
	  SOCKETURL: Store.getState().SOCKETURL
	}

	componentDidMount() {
	  Store.dispatch({
	    type: 'ALL',
	    WS: this.refs.websocket
	  });

	}

	componentWillUnmount() {
	  Store.dispatch({
	    type: 'ALL',
	    WS: null
	  });
	}
	/**
	 * websocket 信息处理器
	 * 
	 */
	handleMsg(data) {
	  console.log('websocket data ' + data);
	  let result = JSON.parse(data);
	  if(result && result.type) {
	    switch(result.type) {
	    case 'connect':
	      this.handleConnect(result);
	      break;
	    case 'thumbUp':
	      this.handleThumbUp(result);
	      break;
	    case 'comment':
	      this.handleComment(result);
	      break;
	    case 'audience':
	      this.handleAundience(result);
	      break;
	    case 'video':
	      this.handleVideo(result);
	      break;
	    }
	  }

	}
	/**
	 *	处理连接信息 
	 */
	handleConnect(result) {
	  const userid = result.userid;
	  //记录sessionId 
	  Store.dispatch({
	    type: 'ALL',
	    USERID: userid
	  });
	  const openid = Store.getState().OPENID;
	  const name = Store.getState().NAME;
	  const headPic = Store.getState().HEADPIC;
	  if(openid) {
	    console.log('发送登陆请求');
	    const ws = Store.getState().WS;
	    if(ws) {
	      ws.sendMessage(JSON.stringify({
	        userid : Store.getState().USERID,
	        type: 'login',
	        openid: openid,
	        name: name,
	        headPic: headPic
	      }));
	    }
	  }
	}

	/**
	 * 处理点赞信息
	 */
	handleThumbUp(result) {
	  let thumbUp = result.thumbUp;
	  Store.dispatch({
	    type: 'ALL',
	    THUMBUP: thumbUp
	  });
	}

	/**
	 *	处理评论信息 
	 */
	handleComment(result) {
	  let comment = result.comment;
	  const comments = Store.getState().COMMENTS.concat(comment);
	  Store.dispatch({
	    type: 'ALL',
	    COMMENTS: comments
	  });

	}
	
	/**
	 * 处理观众人数
	 */
	handleAundience(result){
	  let audience = result.audience;
	  Store.dispatch({
	    type: 'ALL',
	    AUDIENCE : audience
	  });
	}
	
	/**
	 * 处理视频消息
	 */
	handleVideo(result){
	  let streamurl = result.streamurl || Store.InitState.STREAMURL;
	  Store.dispatch({
	    type: 'ALL',
	    STREAMURL : streamurl
	  });
	}
	/**
	 * websocket 连上处理器
	 */
	handleOpen() {
	  //		Config.socket = this.refs.websocket.state.ws
	}

	/**
	 * websocket 关闭处理器
	 */
	handleClose() {
	  //		Config.socket = null;
	}

	render() {
	  return(
	    <Websocket ref="websocket" url={this.state.SOCKETURL}
              		onMessage={this.handleMsg.bind(this)}
              		onOpen={this.handleOpen.bind(this)}
              		onClose={this.handleClose.bind(this)}
              		reconnect={true}
              		debug={true}
              	/>
	  );
	}
}