import postal from 'postal/lib/postal.lodash';

const channel = postal.channel();
//订阅事件
const subscribe = (eventName,fn)=>{
  const subscription = channel.subscribe(eventName,fn);
  return subscription;
};

//取消订阅
const unSubscribe = (subscription)=>{
  subscription.unsubscribe();
};

//发布事件
const publish = (eventName,param)=>{
  channel.publish(eventName,param);
};


const eventBus = {
  subscribe : subscribe,
  unSubscribe : unSubscribe,
  publish : publish
};


export {subscribe , unSubscribe , publish};
export default eventBus;
