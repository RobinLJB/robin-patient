import postal from 'postal/lib/postal.lodash';

const Channel = postal.channel();
//订阅事件
const subscribe = (eventName,fn)=>{
	const subscription = Channel.subscribe(eventName,fn);
	return subscription;
}

//取消订阅
const unSubscribe = (subscription)=>{
	subscription.unsubscribe();
}

//发布事件
const publish = (eventName,param)=>{
	Channel.publish(eventName,param);
}


const EventBus = {
    subscribe : subscribe,
    unSubscribe : unSubscribe,
    publish : publish
}


export {subscribe , unSubscribe , publish};
export default EventBus;
