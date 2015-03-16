Router.route('stripe_subscription_hook', {
  path: '/stripe-subscription-hook',
  action: function() {
    var stripeResponse = this.request.body.type,
			stripeSubscriptionId = this.request.body.data.object.id,
			nextPaymentAttempt = this.request.body.next_payment_attempt,
			nextPaymentAttemptDate = moment(nextPaymentAttempt).toDate(),
			order = Orders.findOne({stripe_subscription_id: stripeSubscriptionId});

    if(stripeResponse == "invoice.payment_succeeded") Payment.createSuccess(order);
    else if(stripeResponse == "invoice.payment_failed") Payment.createFail(order, nextPaymentAttemptDate);

    this.response.writeHead(200, {'Content-Type': 'text/html'});
    this.response.end('');
  },
  where: 'server'
});