/** PaymentModel attributes:
 *
 * _id                            MongoId
 * user_id                        MongoId
 * status                         String (SUCCESS || FAIL)
 * amount                         Integer
 * date                           Date
 * order_id                       Mongo ID
 * order_billing_method           String
 * next_attempt                   Unix Timestamp - set by stripe
 * stripe_subscription_id         Stripe Subscription ID
 * order_units_used                     Integer
 * order_cost_per_unit            MongoId

 **/


Ultimate('Payment').extends(UltimateModel, 'payments', {
  user: function() {
    return Meteor.users.findOne(this.user_id);
  },
  order: function() {
    return Orders.findOne(this.order_id);
  },
  isSuccessful: function () {
    return this.status === 'SUCCESS';
  },
  status: function () {
    return this.isSuccessful() ? "Success" : "Failed";
  },
  dateFormatted: function () {
    return moment(this.date).format('ddd MMMM DD YYYY');
  },

	assignProps: function(order, status) {
		this.status = status;
    this.billing_method = order.billing_method;
		
    this.amount = order.costToCharge();
    this.units_used = order.units_used;
    this.cost_per_unit = order.cost_per_unit;
		
    this.github_url = order.github_url;
    this.subdomain = order.subdomain;
		
    this.order_id = order._id;
    this.user_id = order.user_id; 
    this.date = moment().toDate();
		this.invoice_num = Payments.find().count() + 1;
		
		if(order.stripe_subscription_id) this.stripe_subscription_id = order.stripe_subscription_id;
		
		this.save();
	},
	sendEmail: function() {
		var email = new PaymentEmail(this);
		if(this.status == 'SUCCESS') email.sendSuccess();
		else email.sendFail();
	}
});


PaymentModel.extendStatic({
  createSuccess: function(order, stripeChargeId) {
    var payment = new Payment;
		
		payment.stripe_charge_id = stripeChargeId; //undefined on subscriptions
		payment.assignProps(order, 'SUCCESS');
		payment.sendEmail();
		
    order.reset();
  },
  createFail: function(order, nextPaymentAttempt) {
    var payment = new Payment;
				
		payment.next_attempt = nextPaymentAttempt; //undefined on charges
		payment.assignProps(order, 'FAIL');
		payment.sendEmail();
		
		order.deactivate();
  }
});



Payments.before.insert(function (userId, doc) {
  doc.num = Payments.find().count() + 1;
});