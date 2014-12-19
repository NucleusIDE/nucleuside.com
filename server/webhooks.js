Router.route('stripe_subscription_hook', {
  path: '/stripe-subscription-hook',
  action: function() {
    var stripe_response = this.request.body.type;
    var stripe_subscription_id = this.request.body.data.object.id;

    var order = Orders.findOne({stripe_subscription_id: stripe_subscription_id});

    if (stripe_response === "invoice.payment_failed") {
      var payment = new PaymentModel();
      payment.status = 'FAIL';
      payment.order_billing_method = order.billing_method;
      payment.user_id = order.user_id;
      payment.amount = this.request.body.data.object.lines.data.amount;
      payment.date = moment().toDate();
      payment.next_attempt = moment(this.request.body.next_payment_attempt).toDate();
      payment.order_id = order._id;
      payment.stripe_subscription_id = this.request.body.data.object.id;
      payment.save();
      payment.handle_failed_payment();
    }
    if (stripe_response === "invoice.payment_succeeded") {
      var payment = new PaymentModel();
      payment.status = "SUCCESS";
      payment.order_billing_method = order.billing_method;
      payment.user_id = order.user_id;
      payment.order_id = order._id;
      payment.amount = this.request.body.data.object.lines.data.amount;
      payment.stripe_subscription_id = this.request.body.data.object.id;
      payment.date = moment().toDate();
      payment.save();
    }

    this.response.writeHead(200, {'Content-Type': 'text/html'});
    this.response.end('');
  },
  where: 'server'
});
