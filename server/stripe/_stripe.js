Ultimate('Stripe').extends({
	_getStripe: function() {
		return this.___proto.__stripe = this.___proto.__stripe || StripeAPI(ConfigServer.stripe.secretKey);
	}
});