Ultimate('StripeCharge').extends(Stripe, {
	construct: function(order) {
		this.order = order;
		this.cost = this.order.costToCharge(); //the cost is main thing we need in this block
		this.customer_token = this.order.user().stripe_customer_token; //the stripe customer token is the second thing we need
	},
	charge: function() {
		if(this.cost <= 0) return;
		
		var res = this._createSync({
      		amount: this.cost*100,
      		currency: "USD",
		    customer: this.customer_token,
		    description: "Charge for Nucleus IDE"
    	});
		
    	this.handleResponse(res);
	},
	
	
	_createSync: function() {
		return this.applySync(this._stripe(), 'create', _.toArray(arguments));
	},
	_stripe: function() {
		return this._getStripe().charges;
	},
	
	
	handleResponse: function(res) {
    	if (res.error) this.handleSuccess(res.data.id);
		else this.handleFailure(res.error);
	},
	
	handleSuccess: function(stripeChargeId) {
		this.order.set('last_charged', new Date);
    	Payment.createSuccess(this.order, stripeChargeId);
	},
	handleFailure: function(error) {
    	Payment.createFail(this.order);
	}
});