Meteor.methods({
  'create_order': function(options) {
    //security level: paranoid
    var billing_method = BILLING_METHODS[options.billing_method].method,
        units_used = BILLING_METHOD[options.billing_method].min_units_used,
        start_date = options.start_date,
        cost_per_unit = BILLING_METHOD[options.billing_method].cost_per_unit;

    var order = new Order();
    order.billing_method = billing_method;
    order.units_used = units_used;
    order.start_date = start_date;
    order.cost_per_unit = cost_per_unit;

    try {
      order.charge(function(err) {
        if (err)
          throw err;
        order.save();
      });
    } catch (e) {
      throw new Meteor.Error(e);
    }

    return order._id;
  }
});
