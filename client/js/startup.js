Ultimate('ClientStartup').extends(UltimateStartup, {
	setupStripe: function() {
		Stripe.setPublishableKey(ConfigClient.stripe());
	},
	
	subscribe: 'self'
});
