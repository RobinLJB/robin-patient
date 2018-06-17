import React from 'react';
import ReactDOM from 'react-dom';
import {
  Article,
  Panel,
  PanelBody,
  Cells,
  Cell,
  CellHeader,
  Button,
  CellBody,
  CellFooter,
  LoadMore
} from 'react-weui';
import fa from 'font-awesome/css/font-awesome.min.css';
import 'owo/dist/OwO.min.css';

import Store from '../redux/redux.js';
import Comment from './comment.js';
import Http from '../component/http.js';

export default class CommentArea extends React.Component {

  state = {
    //评论内容
    COMMENTS: Store.getState().COMMENTS,
    //评论url
    COMMENTURL: Store.getState().COMMENTURL,
    //加载状态
    loading_status: 'finish',
    //加载栏状态
    comments_loading_state: 'showDot',
    //加载栏信息
    comments_loading_text: '下拉加载评论',
    //默认为第一次进入该界面时间
    commentedDate: new Date().format('YYYY-MM-DD hh:mm:ss'),

    channelId: 1,

    //分页页面数
    page: 0
  }

  onScroll = function(e) {
    let $container = ReactDOM.findDOMNode(this.refs.container);
    let scrollTop = $container.scrollTop;
    if (scrollTop == 0) {
      //发送请求
      this.refs.request.get();
    }
  }.bind(this)

  /**
		* 加载中
		*/
  onLoading = function() {
    this.setState({loading_status: 'loading', comments_loading_state: 'loading', comments_loading_text: '正在加载中'});
  }.bind(this)

  /**
		* 加载成功
 		*/
  onLoad = function(xhr, body) {
    console.log(`收到响应${JSON.stringify(body)}`);
    let response = body;
    if (response) {
      if (response.success) {
        //请求成功
        let comments = response.data;
        if (Array.isArray(comments) && comments.length > 0) {
          Store.dispatch({
            type: 'all',
            COMMENTS: comments.concat(Store.getState().COMMENTS)
          });
          this.setState({
            page: this.state.page + 1
          });
        }
      } else {
        if (response.message) {
          console.log(`请求失败 ${response.message}`);
        }
      }
    }

    this.setState({loading_status: 'finish', comments_loading_state: 'showDot', comments_loading_text: '下拉加载评论'});
    let $container = ReactDOM.findDOMNode(this.refs.container);
    $container.scrollTop = 57;
  }.bind(this)

  /**
		* 加载错误
		*/
  onError = function() {
    this.setState({loading_status: 'finish', comments_loading_state: 'showDot', comments_loading_text: '下拉加载评论'});
    let $container = ReactDOM.findDOMNode(this.refs.container);
    $container.scrollTop = 57;
  }.bind(this)

  componentDidMount() {
    this.unSubscribe = Store.subscribe(() => {
      this.setState(Store.getState());
    });
    let $container = ReactDOM.findDOMNode(this.refs.container);
    $container.scrollTop = $container.scrollHeight;
    if (this.state.COMMENTS.length == 0) {
      this.refs.request.get();
    }
  }

  componentWillUnmount() {
    this.unSubscribe();
  }

  componentDidUpdate(oldProps, oldState) {
    if (this.state.loading_status == 'loading') {
      return;
    }

    if (this.state.loading_status == 'finish' && oldState && oldState.state && oldState.state.loading_status == 'loading') {
      return;
    }
    let $container = ReactDOM.findDOMNode(this.refs.container);
    $container.scrollTop = $container.scrollHeight;
  }

  render() {

    let comments = this.state.COMMENTS.map((it, index) => {

      let Comp = Comment.Others;
      //todo 取消我的内容判断
      //			if(it.userid == Store.getState().USERID || (it.openid == Store.getState().OPENID && Store.getState().OPENID != "-1")) {
      //				Comp = Comment.Mine;
      //			}
      return (<Comp key={index} headPic={it.headPic} name={it.name} detail={it.detail}></Comp>);
    });

    let styles = {
      paddingBottom: '45px',
      minHeight: '60vh'
    };

    return (<div ref="container" style={{
      height: '100%',
      overflow: 'auto',
      overflowScrolling: 'touch'
    }} onScroll={this.onScroll}>
      <PanelBody ref="comments" className="is-size-7" style={styles}>
        <LoadMore showDot={this.state.comments_loading_state == 'showDot'
          ? true
          : false} loading={this.state.comments_loading_state == 'loading'
          ? true
          : false}>
          {this.state.comments_loading_text}
        </LoadMore>
        <Http ref='request' url={this.state.COMMENTURL
        } headers={{
          'Access-Control-Allow-Origin' : '*'
        }} param={{
          'channelId' : this.state.channelId,
          'commentedDate' : this.state.commentedDate,
          'page' : this.state.page
        }} onloading={this.onLoading
        } onload={this.onLoad} onerror={this.onError}></Http>
        {comments}
      </PanelBody>
    </div>);
  }

}
