Meteor.startup(function() {
  Stripe.setPublishableKey(MasterConfig.keys.stripe());
	
	Tracker.autorun(function() {
	  Meteor.subscribe('self');
	});
});
