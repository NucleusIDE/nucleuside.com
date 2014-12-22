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
      payment.order_cost_per_unit = order.get_cost_per_unit();
      payment.save();
      payment.handle_failed_payment();

      Meteor.call("send_payment_failed_email", order._id);
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
      payment.units_used = order.get_units_used();
      payment.order_cost_per_unit = order.get_cost_per_unit();
      payment.save();

      order.set_last_charged(moment().toDate());
      Meteor.call("send_invoice_email", order._id);
    }

    this.response.writeHead(200, {'Content-Type': 'text/html'});
    this.response.end('');
  },
  where: 'server'
});
