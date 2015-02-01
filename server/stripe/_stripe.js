var Stripe = function Stripe() {};

Stripe.extends(Base, {});

Stripe.extendStatic({
	onStartup: function() {
		this.prototype.__stripe = StripeAPI(MasterConfig.stripe());
	}
});