Router.route('stripe_subscription_hook', {
  path: '/stripe-subscription-hook',
  action: function() {
    var stripe_response = this.request.body.type;
    var stripe_subscription_id = this.request.body.data.object.id;

    var order = Orders.findOne({stripe_subscription_id: stripe_subscription_id});

    if (stripe_response === "invoice.payment_failed") {
      var payment = new PaymentModel.create_payment('FAIL', order._id);

      payment.stripe_subscription_id = this.request.body.data.object.id;
      payment.next_attempt = moment(this.request.body.next_payment_attempt).toDate();
      payment.save();

      Meteor.call("send_payment_failed_email", order._id);
    }
    if (stripe_response === "invoice.payment_succeeded") {
      var payment = new PaymentModel.create_payment('SUCCESS', order._id);
      payment.stripe_subscription_id = this.request.body.data.object.id;
      payment.save();

      order.set_last_charged(moment().toDate());
      Meteor.call("send_invoice_email", order._id);
    }

    this.response.writeHead(200, {'Content-Type': 'text/html'});
    this.response.end('');
  },
  where: 'server'
});
