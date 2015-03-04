Ultimate('StripeCharge').extends(Stripe, {
	construct: function(order) {
		this.order = order;
		this.cost = this.order.get_cost_to_charge(); //the cost is main thing we need in this block
		this.customer_token = this.order.get_user().stripe_customer_token; //the stripe customer token is the second thing we need
	},
	charge: function() {
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
    if (res.error) this.handleSuccess(res.data);
		else this.handleFailure(res.error);
	},
	handleSuccess: function(data) {
    var payment = new PaymentModel.create_payment('SUCCESS', this.order._id);
    payment.stripe_charge_id = data.id;

    Meteor.call("send_invoice_email", this.order._id);
    this.order.reset();
		payment.save();
	},
	handleFailure: function(error) {
    var payment = new PaymentModel.create_payment('FAIL', this.order._id);
    this.order.deactivate();

    Meteor.call("send_payment_failed_email", this.order._id);
		payment.save();
	}
});




/**  STATIC METHODS BIATCH! -- yes, that's where this this interval shit goes **/

StripeCharge.extendStatic({
	onStartup: function() {
		this.setWeeklyInterval();
	},
	setWeeklyInterval: function() {
		this.setTimeout(this.chargeOrder, 10 * 60 * 1000); //charge some orders on every startup
		this.setInterval(this.chargeOrder, 24 * 60 * 60 * 1000);
	},
	chargeOrder: function() {
		console.log("STARTING UP WEEKLY ORDER CHARGING");
		
		var orders = this.ordersToCharge();
	
		orders.forEach(function(order) {
			if(order.get_user().isAdmin()) return;
			
			var stripeCharge = new StripeCharge(order);
			stripeCharge.charge();
		});
	},
	ordersToCharge: function() { //after all we'll only collect orders that are old enough to be charged
		return Orders.find({last_charged: {$lt: moment().subtract({days: 7}).toDate()}});
	}
});