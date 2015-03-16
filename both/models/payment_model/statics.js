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
