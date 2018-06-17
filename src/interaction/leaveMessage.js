import React from 'react';
import {
  Article,
  Panel,
  PanelBody,
  Cells,
  Cell,
  CellHeader,
  Button,
  CellBody,
  CellFooter
} from 'react-weui';
import fa from 'font-awesome/css/font-awesome.min.css';
import OwO from 'owo';
import Store from '@/redux/redux.js';
import Http from '@/component/http';
import JumpBubble from '@/component/jumpBubble';

export default class LeaveMessage extends React.Component {

  state = {
    inputTxt: '',
    showToast: false,
    toastTimer: null,
    //点赞
    thumbUp: this.props.thumbUp || 0,
    //观众
    audience: this.props.audience || 0,

    CLICKNAV: Store.getState().CLICKNAV,

    MESSAGEURL: Store.getState().MESSAGEURL,

    THUMBUPURL: Store.getState().THUMBUPURL,

    AUDIENCEURL: Store.getState().AUDIENCEURL,

    NAME: Store.getState().NAME,

    HEADPIC: Store.getState().HEADPIC
  }

  bubble = null;

  componentDidMount() {
    const demo = new OwO({
      logo: '表情', container: document.getElementsByClassName('OwO')[0],
      target: document.getElementsByClassName('OwO-input')[0],
      api: './OwO.json',
      position: 'up',
      width: '90vw'
    });

    this.bubble = new JumpBubble(this.refs.bubble,{
      left : this.refs.bubble.width - 30
    });

    this.unSubscribe = Store.subscribe(() => {
      this.setState(Store.getState());
    });
    //发送增加观众请求
    this.refs.audience.put();
  }

  componentWillUnmount() {
    this.unSubscribe();
  }

  render() {

    const {channelId} = this.props;

    const {thumbUp, audience, NAME, HEADPIC} = this.state;

    const me = this;

    return (<div className={this.state.CLICKNAV === 0
      ? ''
      : 'is-hidden'} style={{
      zIndex: 600
    }}>
      <Http ref="audience" url={this.state.AUDIENCEURL} param={{
        'channelId' : channelId
      }} headers={{
        'Access-Control-Allow-Origin' : '*',
        'Content-Type' : 'application/json'
      }} onload={(xhr, response) => {
        if (response.success) {
          const channel = response.data;
          me.setState({'thumbUp' : channel.thumbUp, 'audience' : channel.audience});
        }

      }}></Http>
      <p className="button is-info is-outlined icon " style={{
        padding : '1em',
        position: 'fixed',
        bottom: '140px',
        right: '18px',
        opacity: 1
      }} disabled={true}>
        <i className={fa.fa + ' ' + fa['fa-eye'] + ' ' + fa['fa-lg']}/>
      </p>
      <p className="is-size-7 has-text-info has-text-centered" style={{
        width: '32px',
        position: 'fixed',
        bottom: '120px',
        right: '19px'
      }}>
        {audience}
      </p>
      <Http ref="thumbUp" url={this.state.THUMBUPURL} param={{
        'channelId' : channelId
      }} headers={{
        'Access-Control-Allow-Origin' : '*',
        'Content-Type' : 'application/json'
      }} onload={(xhr, response) => {
        if (response.success) {
          const channel = response.data;
          me.setState({'thumbUp' : channel.thumbUp, 'audience' : channel.audience});
        }

      }}></Http>
      <p className="button is-danger is-outlined icon " disabled={//						this.state.HASTHUMBUP?true://TODO 暂时屏蔽不能按两次点赞操作
        false
      } style={{
        padding : '1em',
        position: 'fixed',
        bottom: '80px',
        right: '18px'
      }} onClick={(e) => {
        console.log('发送点赞请求');
        this.refs.thumbUp.put();
        this.bubble.create('http://p8.qhimg.com/t01053ab4d4d6510abd.png');
      }
      }>
        <i className={fa.fa + ' ' + fa['fa-star'] + ' ' + fa['fa-lg']}/>
      </p>
      <p className="is-size-7 has-text-danger has-text-centered" style={{
        width: '32px',
        position: 'fixed',
        bottom: '60px',
        right: '19px'
      }}>
        {thumbUp}
      </p>
      <canvas
        ref="bubble"
        style = {{
          position : 'fixed',
          bottom : '100px',
          right : '18px',
        }}
      >
      </canvas>
      <div style={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        backgroundColor: '#FFFFFF',
        zIndex: 600
      }}>
        <Cell className="is-paddingless" vcode="true" style={{
          borderTop: '1px solid #E5E5E5'
        }}>
          <CellHeader >
            <Button type="vcode" className="OwO"></Button>
          </CellHeader>
          <CellBody>
            <form onSubmit={e => {}}>
              <input ref="input" className="input OwO-input is-size-6 is-primary" style={{
                'height' : '1.8em'
              }} type="text" placeholder="来说点什么吧..." value={this.state.inputTxt
              } onChange={(e) => {
                me.setState({inputTxt: e.target.value});
              }}></input>
            </form>
          </CellBody>
          <CellFooter>
            <Button className="is-size-6" type="vcode" onClick={(e) => {
              console.log(`发送评论消息${this.refs.input.value}`);
              let val = this.refs.input.value;
              if(val&&val.trim()!=''){
                me.setState(function(){
                  return {
                    inputTxt: val
                  };
                },function(){
                  me.refs.comment.post();
                });
              }
            }}>发送</Button>
            <Http ref="comment" url={this.state.MESSAGEURL} param={{
              'channelId' : channelId,
              'name' : NAME,
              'headPic' : HEADPIC,
              'commentedTime' : new Date().format('YYYY-MM-DD hh:mm:ss'),
              'detail' : this.state.inputTxt
            }} headers={{
              'Access-Control-Allow-Origin' : '*',
              'Content-Type' : 'application/json'
            }} onload={(xhr, response) => {
              //把留言添加到评论区  用事件总线
              me.trigger('messageAdd', response.data);
              me.setState({inputTxt: ''});
            }}></Http>
          </CellFooter>
        </Cell>
      </div>
    </div>);
  }
}
