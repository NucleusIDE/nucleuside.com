Future = Npm.require('fibers/future');


Meteor.makeSync = function(context, method) {
  return function (/* arguments */) {
  	var fn = context[method],
			newArgs = _.toArray(arguments),
			callback;

    for (var i = newArgs.length - 1; i >= 0; --i) {
      var arg = newArgs[i];
      var type = typeof arg;
      if (type !== "undefined") {
        if (type === "function") {
          callback = arg;
        }
        break;
      }
    }

    if(!callback) {
      var fut = new Future();
			callback = function(error, data) {
			  fut.return({error:  error, data: data});
			};
			
      ++i; 
    }

    newArgs[i] = Meteor.bindEnvironment(callback);
    var result = fn.apply(context, newArgs);
    return fut ? fut.wait() : result;
  };
};


Meteor.applySync = function(context, method, argsArray) {
  var syncFunc = Meteor.makeSync(context, method);
	return syncFunc.apply(context, argsArray);
};