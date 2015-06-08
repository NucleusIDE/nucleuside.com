Ultimate('ClientStartup').extends(UltimateStartup, {
	setupStripe: function() {
		Stripe.setPublishableKey(ConfigClient.stripe);
	},
	sub: ['roles', 'self']
	//sub: ['roles', 'self', Instance.handle().subscribe('all')]
});