import React from 'react';
import {Panel, PanelBody} from 'react-weui';

export default class MediaScreen extends React.Component {


  render() {
    const {url, poster} = this.props;
    return (<Panel >
      <PanelBody style={{
        width : '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <video ref="video" src={url} poster={poster} style={{
          'width' : 'auto',
          'minWidth' : '30vh',
          'height' : '35vh',
          'object-fit' : 'contain'
        }} controls="controls" autoplay={true} preload={true} x5-playsinline="true" playsInline="playsInline" webkit-playsinline="true"></video>
      </PanelBody>
    </Panel>);
  }
}
