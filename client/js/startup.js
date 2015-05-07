Ultimate('ClientStartup').extends(UltimateStartup, {
	setupStripe: function() {
		Stripe.setPublishableKey(ConfigClient.stripe);
	},
	
	sub: 'self',
	ar: function() {
		if(Meteor.user()) Meteor.subscribe('my-instances');
	}
});