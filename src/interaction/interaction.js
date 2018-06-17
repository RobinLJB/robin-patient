import React from 'react';
import { Article, Panel, PanelBody, Cells, Cell, CellHeader, Button, CellBody, CellFooter } from 'react-weui';
import fa from 'font-awesome/css/font-awesome.min.css';
import OwO from 'owo';
import JumpBubble from '@/component/jumpBubble';
import Store from '../redux/redux.js';


class Interaction extends React.Component {

	state = {
	  //是否已点赞
	  HASTHUMBUP: Store.getState().HASTHUMBUP,
	  //
	  THUMBUP: Store.getState().THUMBUP,
	  //
	  AUDIENCE : Store.getState().AUDIENCE,

	  inputTxt: '',

	  showToast: false,

	  toastTimer: null,

	  CLICKNAV: Store.getState().CLICKNAV

	}

	bubble = null;

	componentDidMount() {
	  const demo = new OwO({
	    logo: '表情',
	    container: document.getElementsByClassName('OwO')[0],
	    target: document.getElementsByClassName('OwO-input')[0],
	    api: './OwO.json',
	    position: 'up',
	    width: '90vw',
	  });
	  this.bubble = new JumpBubble(this.refs.bubble,{
	    left : this.refs.bubble.width - 30
	  });
	  this.unSubscribe = Store.subscribe(() => {
	    this.setState(Store.getState());
	  });
	}

	componentWillUnmount() {
	  this.unSubscribe();
	}

	render() {

	  return(
	    <div className={this.state.CLICKNAV===0?'':'is-hidden'} style={{
	      zIndex : 600
	    }} >
	      <p
	        className="button is-info is-outlined icon "
	        style = {{
	          padding : '1em',
	          position : 'fixed',
	          bottom : '140px',
	          right : '18px',
	          opacity : 1
	        }}
	        disabled = {true}
	      >
	        <i className={fa.fa+' '+fa['fa-user-o']+' '+fa['fa-lg'] }/>
	      </p>
	      <p
	        className = "is-size-7 has-text-info has-text-centered"
	        style = {{
	          width : '32px',
	          position : 'fixed',
	          bottom : '120px',
	          right : '19px',
	        }}>
				 	{this.state.AUDIENCE}
	      </p>
	      <p
	        className="button is-danger is-outlined icon "
	        disabled={
	          //						this.state.HASTHUMBUP?true://TODO 暂时屏蔽不能按两次点赞操作
	          false
	        }
	        style = {{
	          padding : '1em',
	          position : 'fixed',
	          bottom : '80px',
	          right : '18px',
	        }}
	        onClick ={
	          e=>{
	            let ws = Store.getState().WS;
	            //							if(!this.state.HASTHUMBUP&&ws){
	            if(ws){
	              let json = JSON.stringify({
	                userid : Store.getState().USERID,
	                type: 'thumbUp',
	              });
	              console.log(`发送点赞信息${json}`);
	              ws.sendMessage(json);
	              Store.dispatch({
	                type: 'ALL',
	                HASTHUMBUP: true
	              });
	              this.bubble.create('http://p8.qhimg.com/t01053ab4d4d6510abd.png');
	            }
	          }
	        }
	      >
	        <i className={fa.fa+' '+fa['fa-thumbs-up']+' '+fa['fa-lg'] }/>
	      </p>
	      <p
	        className = "is-size-7 has-text-danger has-text-centered"
	        style = {{
	          width : '32px',
	          position : 'fixed',
	          bottom : '60px',
	          right : '19px',
	        }}>
				 	{this.state.THUMBUP}
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
	      <div
	        style={{
	          width : '100%',
	          position : 'fixed',
	          bottom : 0,
	          backgroundColor : '#FFFFFF',
	          zIndex : 600
	        }}>
		                <Cell className="is-paddingless" vcode="true" style={{
		                		    borderTop: '1px solid #E5E5E5'
		                }}>
		                    <CellHeader >
		                        <Button  type="vcode" className="OwO" >
		                        </Button>
		                    </CellHeader>
		                    <CellBody>
		                    		<form onSubmit={e=>{}}>
			                        <input
			                        		ref="input"
			                        		className="input OwO-input is-size-6 is-primary"
			                        		style={{'height' : '1.8em'}}
			                        		type="text"
			                        		placeholder="来说点什么吧..."
			                        		value ={
			                        			this.state.inputTxt
			                        		}
			                        		onChange={
			                        			e=>{
			                        				this.setState({inputTxt: e.target.value});
			                        			}
			                        		}
			                        		>
			                        </input>
		                        </form>
		                    </CellBody>
		                    <CellFooter>
		                        <Button className="is-size-6" type="vcode" onClick={e=>{
		                        		let val = this.refs.input.value;
		                        		if(val && val.trim()!='') {
		                        			let ws = Store.getState().WS;
		                        			if(Store.getState().USERID&&ws) {
		                        				let data = {
		                        					type: 'comment',
		                        					openid : Store.getState().OPENID,
		                        					userid : Store.getState().USERID,
		                        					name: Store.getState().NAME,
		                        					headPic: Store.getState().HEADPIC,
		                        					detail: val
		                        				};
		                        				let json = JSON.stringify(data);
		                        				console.log(`发送评论消息${json}`);
		                        				ws.sendMessage(json);
		                        				this.setState({
		                        					inputTxt: ''
		                        				});
		                        			} else {
		                        				Store.dispatch({
		                        					type : 'ALL',
		                        					SHOWTOAST : true,
		                        					TOASTTEXT : '用户未登陆',
		                        					TOASTTIMER : setTimeout(()=> {
									            		Store.dispatch({
									            			type : 'ALL',
									            			SHOWTOAST : false
									            		});
									        		}, 2000)
		                        				});
		                        			}
		                        		}
		                        }}>发送</Button>
		                    </CellFooter>
		                </Cell>
	      </div>
	    </div>
	  );
	}

}

export default Interaction;
