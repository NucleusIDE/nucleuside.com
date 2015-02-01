Meteor.startup(function() {
  Stripe.setPublishableKey(MasterConfig.stripe());
	
	Tracker.autorun(function() {
	  Meteor.subscribe('self');
	});
});
