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
 * hide													Boolean
 *
 */

Orders = new Mongo.Collection('orders');

Orders.before.insert(function (userId, doc) {
  doc.created_at = moment().toDate();
});


Order = function Order(doc) {
	if(Meteor.isServer && doc && doc.ec2) this.ec2 = new EC2(doc.ec2);
};

Order.modelExtends(Orders, {
	schema: function() {
		return {
		  		billing_method: {
				    type: String,
						defaultValue: 'hourly'
				  },
		  		github_url: {
				    type: String,
				    label: "Github URL",
						autoform: {
							placeholder: 'Github URL of your Project'
						}
				  },
		  		subdomain: {
				    type: String,
				    label: "Subdomain",
						autoform: {
							placeholder: 'my-project'
						}
				  },
		  		password: {
				    type: String,
				    label: "Password",
						optional: true,
						autoform: {
							placeholder: '(optional)'
						}
				  }
				};
	},
	forms: function() {
		return {
			'billing_option': ['billing_method'],
			'order_details': ['github_url', 'subdomain', 'password']
		};
	},
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
	display_amount: function() {
		return this.billing_method === 'Monthly' ? '$160 / Month' : '$1 / hour used';
	},
  reset: function(last_charged) { //Reset order after a successful charge
    if (this.is_monthly()) return console.log("nothing to reset in monthly orders");

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
    if (this.is_monthly()) throw new Meteor.Error("What do you want here?");
    return this.cost_per_unit * this.units_used;
  },
  is_active: function() {
    return this.is_monthly() ? !!this.current_plan_start : !!this.last_charged;
  },
  get_last_charged: function() {
    return moment(this.last_charged).format('ddd MMMM DD, YYYY') || moment().format('ddd MMMM DD, YYYY');
  },
  set_last_charged: function(date) {
    if (!date) return;
    this.update({last_charged: date});
  },
  is_running: function() {
    return this.ec2.status === 'running';
  },
  is_monthly: function() {
    return this.billing_method === BILLING_METHODS.monthly.name;
  },
  is_hourly: function() {
    return this.billing_method === BILLING_METHODS.hourly.name;
  },
  get_aws_instance_id: function() {
    return this.aws.Instances[0].InstanceId || null;
  },
  check_instance_status: function(cb) {
    if (!this.instance_id) return cb(null, {status: "No instance"});
    Meteor.call("get_aws_instance_status", instance_id, cb);
  }
});




