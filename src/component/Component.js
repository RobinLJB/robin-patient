import React from 'react';
import { subscribe, unSubscribe, publish } from '../eventbus/eventBus.js';

/**
 * 主动执行事件绑定方法
 * @param {Object} eventName
 * @param {Object} fn
 */
React.Component.prototype.on = function(eventName, fn) {
	const subscription = subscribe(eventName, (data) => {
		let [...param] = data.data
		fn.call(this, ...param);
	});

	this.listeners = this.listeners || {};
	//先取消已订阅的事件
	const hasSubscription = this.listeners[eventName];
	if(hasSubscription) {
		unSubscribe(hasSubscription);
	}
	this.listeners[eventName] = subscription;
};
/**
 * 主动解绑事件绑定方法
 * @param {Object} eventName
 */
React.Component.prototype.off = function(eventName) {
	this.listeners = this.listeners || {};
	const subscription = this.listeners[eventName];
	if(subscription) {
		unsubscribe(subscription);
	}
	delete this.listeners[eventName];
};

/**
 * 触发事件
 * @param {Object} eventName
 * @param {...param} 事件参数
 */
React.Component.prototype.trigger = function(eventName, ...param) {
	//第一个参数是 事件名称  第二个参数 为事件对象 之后为事件参数
	debugger
	const data = [this].concat(...param);
	debugger
	publish(eventName, {
		data: data
	});
};

/**
 * 在组件渲染后 执行事件绑定 
 */
React.Component.prototype.componentDidMount = function() {
	const listeners = this.props.listeners || {};
	for(let eventName in listeners) {
		this.on(eventName, listeners[eventName]);
	}
}

/**
 * 在组件回收前 撤销事件绑定 
 */
React.Component.prototype.componentWillUnmount = function() {
	this.listeners = this.listeners || {};
	for(let eventName in this.listeners) {
		unSubscribe(this.listeners[eventName]);
	}
}