import 'weui/dist/style/weui.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, BrowserRouter } from 'react-router-dom';

import { subscribe, unSubscribe, publish } from './eventbus/eventBus.js';
import './component/Component.js'
import Main from './main.js'

class App extends React.Component {

	render() {
//		this.on("show", (word) => {
//			alert(word)
//		})
		return(
			<BrowserRouter>
			    <Route path="/" component={Main}></Route>
			</BrowserRouter>
		)
	}
}

ReactDOM.render(
	<App listeners={
					{
						'show' : function( component , word){
							debugger
							alert(word);
						}
					}
					}>
	</App>,
	document.getElementById('root')
);

//const comp = new React.Component();

//publish('show',{
//	data : [comp,"hello world",123,1231,123]
//})

//comp.trigger("show","hello world",123,123)

