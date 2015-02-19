var Stripe = function Stripe() {};

Stripe.extends(Base, {
	_getStripe: function() {
		return this.___proto.__stripe = this.___proto.__stripe || StripeAPI(MasterConfig.stripe());
	}
});