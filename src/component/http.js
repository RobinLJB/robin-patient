import React from 'react';
import { xhrInitParams, eventToResponse, xhrSetMultiCallback, xhrOpen, xhrSendHeaders, xhrSendBody, xhrDestroy } from 'xhttp';
//content-type:application/json;charset=UTF-8
class Http extends React.Component {

	state = {
	  status: 'free'
	}

	//构造异步请求
	createXhr = function(option) {
	  console.log(`请求配置${JSON.stringify(option)}`);
	  const xhr = new XMLHttpRequest();
	  // ... custom code here?
	  xhrInitParams(xhr, option);
	  // ... custom code here?
	  xhrSetMultiCallback(xhr, (event) => {
	    const {
	      ok,
	      status,
	      reason,
	      headers,
	      body
	    } = eventToResponse(event);
	    if(ok) {
	      this.setState({
	        status: 'ok'
	      });
	      if(option.onload && typeof option.onload === 'function') {
	        console.log(`收到数据${JSON.stringify(body)}`);
	        option.onload.call(this, this, body, headers, status, reason, ok);
	      }
	      this.setState({
	        status: 'free'
	      });
	    } else {
	      this.setState({
	        status: 'error'
	      });
	      console.log('request error status :' + status + ' body :' +
					body);
	      if(option.onerror && typeof option.onerror === 'function') {
	        option.onerror.call(this, this, body, headers, status, reason, ok);
	      }
	      this.setState({
	        status: 'free'
	      });
	    }
	  });
	  // ... custom code here?
	  if(option.onloading && typeof option.onloading === 'function') {
	    option.onloading.call(this, this);
	    this.setState({
	      status: 'requesting'
	    });
	  }
	  xhrOpen(xhr);
	  // ... custom code here?
	  xhrSendHeaders(xhr);
	  // ... custom code here?
	  xhrSendBody(xhr);
	  // ... custom code here?
	  return xhr;
	}.bind(this)

	//发送请求
	request = function() {
	  let opt = {};
	  Object.assign(opt, this.option, {
	    param: this.state.param
	  });
	  this.xhr = this.createXhr.call(this, opt);
	}.bind(this)

	//发送get请求
	get = function() {
	  let opt = {};
	  Object.assign(opt, this.option, {
	    method: 'GET',
	    param: this.state.param
	  });
	  this.xhr = this.createXhr.call(this, opt);
	}.bind(this)

	//发送post请求
	post = function() {
	  let opt = {};
	  Object.assign(opt, this.option, {
	    method: 'POST',
	    param: this.state.param
	  });
	  this.xhr = this.createXhr.call(this, opt);
	}.bind(this)

	//发送put请求
	put = function() {
	  let opt = {};
	  Object.assign(opt, this.option, {
	    method: 'PUT',
	    param: this.state.param
	  });
	  this.xhr = this.createXhr.call(this, opt);
	}.bind(this)

	//发送delete请求
	delete = function() {
	  let opt = {};
	  Object.assign(opt, this.option, {
	    method: 'DELETE',
	    param: this.state.param
	  });
	  this.xhr = this.createXhr.call(this, opt);
	}.bind(this)

	//取消请求
	abort = function() {
	  if(this.xhr) {
	    xhrDestroy(this.xhr);
	    if(this.option.onabort && typeof this.option.onloading === 'function') {
	      this.option.onabort.call(this, this);
	    }
	    this.setState({
	      status: 'free'
	    });
	  }
	}.bind(this)

	/**
	 * 在组件回收前 撤销http请求
	 */
	componentWillUnmount() {
	  super.componentWillUnmount();
	  if('requesting' === this.state.status) {
	    this.abort();
	  }
	}

	/**
	 * 父组件改变将请求参数 存贮在state中
	 * 当父组件改变state中的参数 触发子组件重新渲染
	 * 此时执行子组件render函数 Http标签重新初始化一次
	 */
	render() {

	  const {
	    children,
	    method, // "GET" or "POST"
	    url, //地址
	    param, //参数
	    async, // 是否异步
	    headers, //请求头
	    onload,
	    onerror,
	    onloading,
	    onabort
	  } = this.props;

	  this.option = {
	    method,
	    url,
	    body: param,
	    async,
	    headers: headers,
	    onload,
	    onerror,
	    onloading,
	    onabort
	  };

	  return children ? (<div> {children}</div>) : null;

	}
}

export default Http;
