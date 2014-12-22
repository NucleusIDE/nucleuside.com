/**
 * Attributes
 *
 * user_id                      Mongo ID
 * num                          Integer
 * billing_method               String
 * units_used                   Integer
 * last_charged                 Date - we bill in relation to this. Like 4 days after start date. For hourly orders, this field is also used to determine if the order is active or not
 * current_plan_start           Unix timestamp - set by stripe - for monthly orders, determine the active status of order
 * current_plan_end             Unix timestamp - set by stripe
 * github_url                   String
 * subdomain                    String
 * password                     String
 */

Orders = new Mongo.Collection('orders');

Orders.before.insert(function (userId, doc) {
  doc.created_at = moment().toDate();
});

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
  get_subdomain: function() {
    return this.subdomain;
  },
  get_github_url: function() {
    return this.github_url;
  },
  reset: function(last_charged) {
    /**
     * Reset order after a successful charge
     */
    if (this.is_monthly()) {
      console.log("nothing to reset in monthly orders");
      return;
    }
    last_charged = last_charged || moment().toDate();
    this.update({units_used: 0, last_charged: last_charged});
  },
  get_units_used: function() {
    return this.units_used;
  },
  get_billing_period: function() {
    return this.billing_period;
  },
  get_cost_to_charge: function() {
    if (this.is_monthly())
      throw new Meteor.Error("What do you want here?");

    return this.cost_per_unit * this.units_used;
  },
  is_active: function() {
    return this.is_monthly()
      ? !! this.current_plan_start
      : !! this.last_charged;
  },
  get_last_charged: function() {
    return moment(this.last_charged).format('ddd MMMM DD, YYYY') || moment().format('ddd MMMM DD, YYYY');
  },
  set_last_charged: function(date) {
    if (!date) return;
    this.update({last_charged: date});
  },
  deactivate: function() {
    this.is_monthly()
      ? this.update({'current_plan_start': null, current_plan_end: null, stripe_subscription_id: null})
    : this.update({last_charged: null});
  },
  //let's call this method 're_activate' instead of 'activate' to avoid confusion that this might be activating a new order. New orders are always active
  re_activate: function() {
    if (this.is_monthly()) {
      throw Meteor.Error("Not Implemented");
    }
    this.update({last_charged: moment().toDate()});
  },
  is_monthly: function() {
    return this.billing_method === BILLING_METHODS.monthly.method;
  },
  is_hourly: function() {
    return this.billing_method === BILLING_METHODS.hourly.method;
  }
});
