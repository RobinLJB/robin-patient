import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, PanelBody } from 'react-weui';

import LOGO from '../image/LOGOxdy2.jpeg';
import Store from '../redux/redux';

export default class Screen extends React.Component {

	state = {
		STREAMURL: Store.getState().STREAMURL,
		POSTER : Store.getState().POSTER
	}

	componentDidMount() {

		this.unSubscript = Store.subscribe(() => {
			let state = Store.getState();
			this.setState(state);
		});
	}

	componentWillUnmount() {
    this.unSubscribe();
  }

	render() {

		return(
			<Panel >
				<PanelBody>
					<video ref="video"
						src={this.state.STREAMURL}
						poster={this.state.POSTER}
						style={{ 'width' : '100%' , 'height' : '35vh' , 'padding' : '0px'}}
						controls
						autoPlay
						preload="auto"
						x5-playsinline="true"
						playsInline
						webkit-playsinline="true">
					</video>
				</PanelBody>
			</Panel>
		)
	}

	componentDidUpdate(oldProps, oldState) {
		let oldUri = oldState.STREAMURL?oldState.STREAMURL.split('?')[0]:oldState.STREAMURL;
		let uri = this.state.STREAM?this.state.STREAM.split('?')[0]:this.state.STREAM;
		if(oldUri  != uri) {
			if(this.state.STREAM){
				const video = ReactDOM.findDOMNode(this.refs.video);
				video.load();
			}
		}
	}

	componentWillUnmount() {
		this.unSubscript();
	}
}
