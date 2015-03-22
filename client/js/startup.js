Ultimate('ClientStartup').extends(UltimateStartup, {
	setupStripe: function() {
		Stripe.setPublishableKey(MasterConfig.stripe());
	},
	
	subscribe: 'self'
});
