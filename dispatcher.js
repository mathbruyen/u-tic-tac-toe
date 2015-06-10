/* jshint node: true, esnext: true */

module.exports = () => {

  var subscribers = [];

  function dispatch(action) {
    console.log('Action:', action);
    for (var subscriber of subscribers) {
      subscriber(action);
    }
  }

  function subscribe(subscriber) {
    subscribers.push(subscriber);
  }

  return { dispatch, subscribe };
};
