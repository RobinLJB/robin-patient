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

import Store from '@/redux/redux.js';
import Message from '@/interaction/message.js';
import Http from '@/component/http.js';

export default class MessageArea extends React.Component {

  state = {
    //留言内容
    messages: [],
    //留言url
    COMMENTURL: Store.getState().COMMENTURL,
    //评论时间
    commentedDate: new Date().format('YYYY-MM-DD hh:mm:ss'),
    //加载状态
    loading_status: 'finish',
    //加载栏状态
    messages_loading_state: 'showDot',
    //加载栏信息
    messages_loading_text: '下拉加载留言',
    //频道主键
    channelId: this.props.channelId,
    //分页页面数
    page: 0
  }

  static defaultProps = {
    listeners: {
      'messageAdd': function(comp, message) {
        this.setState({messages: this.state.messages.concat(message)});
      }
    }
  }

  onScroll = function(e) {
    let $container = ReactDOM.findDOMNode(this.refs.container);
    let scrollTop = $container.scrollTop;
    //		console.log(`scrollTop : ${scrollTop}`)
    if (scrollTop == 0) {
      //发送请求
      this.refs.request.get();
    }
  }.bind(this)

  /**
		* 加载中
		*/
  onLoading = function() {
    this.setState({loading_status: 'loading', messages_loading_state: 'loading', messages_loading_text: '正在加载中'});
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
        let messages = response.data;
        if (Array.isArray(messages) && messages.length > 0) {
          this.setState({
            page: this.state.page + 1,
            messages: messages.concat(this.state.messages)
          });
        }
      } else {
        if (response.message) {
          console.log(`请求失败 ${response.message}`);
        }
      }
    }

    this.setState({loading_status: 'finish', messages_loading_state: 'showDot', messages_loading_text: '下拉加载留言'});
    let $container = ReactDOM.findDOMNode(this.refs.container);
    $container.scrollTop = 57;
  }.bind(this)

  /**
		* 加载错误
		*/
  onError = function() {
    this.setState({loading_status: 'finish', messages_loading_state: 'showDot', messages_loading_text: '下拉加载留言'});
    let $container = ReactDOM.findDOMNode(this.refs.container);
    $container.scrollTop = 57;
  }.bind(this)

  componentDidMount() {
    super.componentDidMount();
    this.unSubscribe = Store.subscribe(() => {
      this.setState(Store.getState());
    });
    let $container = ReactDOM.findDOMNode(this.refs.container);
    $container.scrollTop = $container.scrollHeight;
    if (this.state.messages.length == 0) {
      this.refs.request.get();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
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

    let messages = this.state.messages.map((it, index) => {
      let Comp = Message;
      return (<Comp key={index} headPic={it.headPic} name={it.name} detail={it.detail}></Comp>);
    });

    let styles = {
      paddingBottom: '45px',
      minHeight: '60vh'
    };

    const {channelId} = this.props;

    return (<div ref="container" style={{
      height: '100%',
      overflow: 'auto',
      overflowScrolling: 'touch'
    }} onScroll={this.onScroll}>
      <PanelBody ref="comments" className="is-size-7" style={styles}>
        <LoadMore showDot={this.state.messages_loading_state == 'showDot'
          ? true
          : false} loading={this.state.messages_loading_state == 'loading'
          ? true
          : false}>
          {this.state.messages_loading_text}
        </LoadMore>
        <Http ref='request' url={this.state.COMMENTURL
        } headers={{
          'Access-Control-Allow-Origin' : '*'
        }} param={{
          'channelId' : channelId,
          'commentedDate' : this.state.commentedDate,
          'page' : this.state.page
        }} onloading={this.onLoading
        } onload={this.onLoad} onerror={this.onError}></Http>
        {messages}
      </PanelBody>
    </div>);
  }

}
