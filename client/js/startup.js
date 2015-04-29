Ultimate('ClientStartup').extends(UltimateStartup, {
	setupStripe: function() {
		Stripe.setPublishableKey(ConfigClient.stripe);
	},
	
	subscribe: 'self',
	autorun: function() {
		if(Meteor.user()) Meteor.subscribe('my-instances');
	}
});