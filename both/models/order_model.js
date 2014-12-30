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
 * aws_instance_stopped:        Boolean
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
  activate: function() {
    if (!Meteor.isServer) {
      return;
    }
    var self = this;
    EC2_Manager.launch_instance(function(err, data) {
      //data looks like : https://paste.ee/p/XM85W
      if (err) {
        console.log("ERROR WHILE LAUNCHING AWS INSTANCE FOR ORDER", this._id);
        return;
      }

      self.update({
        aws: data,
        aws_instance_stopped: false
      });
    });
  },
  deactivate: function() {
    if(!Meteor.isServer)
      return;

    if (this.user().is_admin()) {
      console.log("Not deactivating admin's order");
      return;
    }

    this.is_monthly()
      ? this.update({'current_plan_start': null, current_plan_end: null, stripe_subscription_id: null})
    : this.update({last_charged: null});

    var instance_id = this.aws ? this.aws.Instances[0].InstanceId : null;

    if(! instance_id) {
      console.log("NO INSTANCE FOR THIS ORDER", this._id);
      return;
    }

    EC2_Manager.stop_instance(instance_id, function(err, data) {
      // data = { StoppingInstances:
      //          [ { InstanceId: 'i-2eefd9e4',
      //              CurrentState: [Object],
      //              PreviousState: [Object] } ] }
      if (err) {
        console.log("ERROR WHILE STOPPING AWS INSTANCE for order", this._id, err);
        return;
      }
      this.update({
        aws_instance_stopped: true,
        aws_instance_stopped_res: data
      });
    });
  },
  is_running: function() {
    return ! this.aws_instance_stopped;
  },
  is_monthly: function() {
    return this.billing_method === BILLING_METHODS.monthly.method;
  },
  is_hourly: function() {
    return this.billing_method === BILLING_METHODS.hourly.method;
  },
  get_aws_instance_id: function() {
    return this.aws.Instances[0].InstanceId || null;
  },
  check_instance_status: function(cb) {
    /**
     * This method takes a callback to do stuff with the status since AWS calls are async and no futures on client
     */
    var instance_id = this.get_aws_instance_id();
    if (! instance_id) {
      return cb(null, {status: "No instance"});
    }

    Meteor.call("get_aws_instance_status", instance_id, cb);
  }
});
