Future = Npm.require('fibers/future');

Meteor.methods({
  'create_order': function(options) {
    if (!this.userId) {
      throw new Meteor.Error("Must be logged in to create an order");
    }

    var method = options.billing_method;

    //security level: paranoid
    var billing_method = BILLING_METHODS[method].method,
        units_used = BILLING_METHODS[method].min_units_used,
        cost_per_unit = BILLING_METHODS[method].cost_per_unit;

    var fut = new Future();

    var order = new Order();
    order.billing_method = billing_method;
    order.units_used = units_used;
    order.cost_per_unit = cost_per_unit;

    order.user_id = this.userId;

    order.github_url = options.github_url;
    order.subdomain = options.subdomain;
    order.password = options.password;
    order.last_charged = moment().toDate(); //used in hourly orders only
    order.created_at = moment().toDate();
    order.save();

    if (order.is_monthly()) {
      Meteor.call('update_stripe_plan', order._id, function(err, res) {
        if (err) {
          fut.throw(err);
        }
        fut.return(order._id);
      });
    } else {
      console.log("TODO: HOURLY ORDER");
      return;
    }

    return fut.wait();
  }
});


/**
 * Timeout for weekly charging users who are following hourly plan.
 * Ran every 24 hours
 */
Meteor.setTimeout(function() {
  Orders.find({
    last_charged: {$lt: moment().subtract({days: 7}).toDate({days: 7})}
  }).forEach(function(order) {
    Meteor.call("charge_order", order._id, function(err, res) {

      if (err) {
        var payment = new PaymentModel.create_payment('FAIL', order._id);
        order.deactivate();

        Meteor.call("send_payment_failed_email", order._id);
      } else {
        var payment = new PaymentModel.create_payment('SUCCESS', order._id);
        payment.stripe_charge_id = res.id;

        Meteor.call("send_invoice_email", order._id);
        order.reset();
      }

      payment.save();
    });
  });
}, 24 * 60 * 60 * 1000);
