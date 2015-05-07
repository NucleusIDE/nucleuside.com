Template.registerHelper("session", function(key) {
  return Session.get(key);
});


Template.registerHelper("global", function(variable, prop) {
	if(prop) return window[variable][prop];
	return window[variable];
});


Template.registerHelper("transform", function(dataObject, className) {
  return new window[className](dataObject);
});

Template.is_equal.helpers({
  yes: function(key, val) {
    return key === val;
  }
});


/** AUTOMATICALLY UNBLOCK UI AFTER FLASH MESSAGES ARE SHOWN
		i very rarely recommend syntatic sugar these days (unless it's deeply thought out 
		foundational stuff like Model.extendHttp, which we will use heavily like models themselves),
	  but come on this is baby stuff. I guess syntatic sugar in between, in complexity, is the problem. 
**/
var oldDanger = Flash.danger,
	oldSuccess = Flash.success;

Flash.danger = function() {
	oldDanger.apply(Flash, _.toArray(arguments));
	BlockUI.unblock();
};


Flash.success = function() {
	oldSuccess.apply(Flash, _.toArray(arguments));
	BlockUI.unblock();
};