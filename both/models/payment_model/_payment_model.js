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
  doc.date = moment().toDate();
	doc.num = Payments.find().count() + 1;
});