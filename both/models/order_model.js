/**
 * Attributes
 *
 * user_id                      Mongo ID
 * billing_method               String
 * units_used                   Integer
 * start_date                   Date - we bill in relation to start_date. Like 4 days after start date. This field is also used to determine if the order is active or not; to deactivate an order, set this field to null/false
 */

Orders = new Mongo.Collection('orders');

Order = Model(Orders);

BILLING_METHODS = {
  'monthly': {
    method: 'Monthly',
    billing_period: 30,
    min_units_used: 1,
    cost_per_unit: 160
  },
  'hourly': {
    method: 'Hourly',
    billing_period: 7,
    min_units_used: 1,
    cost_per_unit: 160
  }
};

Order.extend({
  get_user: function() {
    return Meteor.users.findOne(this.user_id);
  },
  get_billing_method: function() {
    return this.billing_method;
  },
  get_cost_per_unit: function() {
    return this.cost_per_unit;
  },
  reset_order: function(start_date) {
    start_date = start_date || moment().toDate();
    this.update({usage: 0, billing_start_date: start_date});
  },
  get_billing_period: function() {
    return this.billing_period;
  },
  get_cost_to_charge: function() {
    if (this.billing_method === BILLING_METHODS.weekly.method) {
      return this.cost_per_unit * this.units_used;
    }
  },
  is_active: function() {
    return !! this.start_date;
  },
  deactivate: function() {
    this.update({start_date: null});
  },
  //let's call this method 're_activate' instead of 'activate' to avoid confusion that this might be activating a new order. New orders are always active
  re_activate: function() {
    this.update({start_date: moment().toDate()});
  },
  charge_order: function(cb) {
    Meteor.call('charge_order', this._id, cb);
  }
});
