import React from 'react';
import {Tab, NavBarItem} from 'react-weui';
import LeaveMessage from '@/interaction/leaveMessage';
import MessageArea from '@/interaction/messageArea';
import Subject from '@/subject/subject';
import Detail from '@/detail/detail';
import Store from '@/redux/redux';
import MediaScreen from '@/menu/mediaScreen';
import WxConfig from '@/component/wxConfig';
import Http from '@/component/http';

export default class MediaPlay extends React.Component {

  state = {
    channelInfoUrl: Store.getState().CHANNELINFO,
    id: this.props.match.params.id,
    channel: {}
  }

  componentWillMount() {
    Store.dispatch({type: 'ALL', CLICKNAV: 0});
  }

  componentDidMount() {
    this.refs.channelInfo.get();
  }

  render() {
    const {match} = this.props;
    const id = match.params.id;

    const {
      url,
      poster,
      name,
      subject,
      thumbUp,
      audience
    } = this.state.channel;

    const mediaUrl = this.state.channelInfoUrl + `/?channelId=${id}`;
    const link = `http://robinluo.top/wechat-xdy/wechat/redirectMedia/${id}`;

    return (<div style={{
      height: '100%'
    }}>
      <MediaScreen url={url} poster={poster}/>
      <div className="hero has-text-primary text-center is-size-7" style={{
        'width' : '100vw',
        'overflow' : 'hidden'
      }}>
        <span className="marquee" >助你2018笔试顺利过关：张老师 微信13798197298</span>
      </div>
      <Tab type="navbar" onChange={(idx) => {
        Store.dispatch({type: 'ALL', CLICKNAV: idx});
      }
      }>
        <NavBarItem className="hero is-primary padding-xs text-center" label="边学边说">
          <MessageArea channelId={id}/>
        </NavBarItem>
        <NavBarItem className="hero is-primary padding-xs text-center" label="直播讲义">
          <Subject title={name} subject={subject}/>
        </NavBarItem>
        <NavBarItem className="hero is-primary padding-xs text-center" label="助你成功">
          <Detail/>
        </NavBarItem>
      </Tab>
      <LeaveMessage channelId={id} thumbUp={thumbUp} audience={audience} ></LeaveMessage>
      <Http ref="channelInfo" url={mediaUrl} headers={{
        'Access-Control-Allow-Origin' : '*'
      }} onload={(xhr, body) => {
        let json = body;
        console.log(JSON.stringify(json));
        if (json.success) {
          let data = json.data;
          this.setState({
            'id': id,
            'channel': data || {}
          });
        }
      }
      } onerror={() => {
        console.log('请求异常');
      }}></Http>
      <WxConfig title={name} link={link} imgUrl={poster} desc={subject}></WxConfig>
    </div>);
  }
}
