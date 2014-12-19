Future = Npm.require('fibers/future');

Meteor.methods({
  'create_order': function(options) {

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

    order.github_url = options.github_url;
    order.subdomain = options.subdomain;
    order.password = options.password;
    order.start_date = moment().toDate();
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
