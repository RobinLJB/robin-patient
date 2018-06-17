import React from 'react';
import {Article} from 'react-weui';
//import qrcode from '../image/qrcode.jpg';
import train from '../image/train.jpeg';

class Detail extends React.Component{
  render(){

    return(
      <Article>
	            <p className="hero is-size-5 text-center has-text-info">更多培训信息</p>
	            <figure className="image" style={
	            		{
	            		paddingLeft : '0vw',
	            		paddingRight : '0vw'
	            		}
	            	}>
  					<img src={train} />
        </figure>
      </Article>
    );
  }
}

export default Detail;
