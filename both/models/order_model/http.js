Order.extendHTTP({
	subdomainUsedAlready: function(subdomain) {
		return !!Orders.find({subdomain: subdomain}).count();
	},
	_createOrder: function() {
    this.setInitialValues();
    this.save();

		if (this.is_monthly()) {
			var stripeSubscription = new StripeSubscription(this);
			stripeSubscription.subsribe();
		}
		
		this.activate();
		return this._id;
	}
});