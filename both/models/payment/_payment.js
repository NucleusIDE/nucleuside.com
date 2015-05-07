Ultimate('Payment').extends(UltimateModel, {
  collection: 'payments',
  order: function() {
    return Orders.findOne(this.order_id);
  },
  isSuccessful: function () {
    return this.status === 'SUCCESS';
  },
  status: function () {
    return this.isSuccessful() ? "Success" : "Failed";
  },

	assignProps: function(order, status) {
		_.extend(this, _.pick(order, 'units_used', 'cost_per_unit', 'github_url', 'subdomain', 'user_id', 'stripe_subscription_id', 'billing_method'));
		this.status = status;
    this.amount = order.costToCharge();
    this.order_id = order._id;
		this.save();
	},
	sendEmail: function() {
		var email = new PaymentEmail(this);
		if(this.status == 'SUCCESS') email.sendSuccess();
		else email.sendFail();
	}
});