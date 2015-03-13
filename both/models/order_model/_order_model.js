Ultimate('Order').extends(UltimateModel, 'orders', {
  user: function() {
    return Meteor.users.findOne(this.user_id);
  },
	displayAmount: function() {
		return this.billing_method === 'Monthly' ? '$160 / Month' : '$1 / hour used';
	},
  reset: function(last_charged) { //Reset order after a successful charge
    if (this.is_monthly()) return console.log("nothing to reset in monthly orders");

    last_charged = last_charged || moment().toDate();
    this.update({units_used: 0, last_charged: last_charged});
  },
  get_cost_to_charge: function() {
    if (this.is_monthly()) throw new Meteor.Error("What do you want here?");
    return this.cost_per_unit * this.units_used;
  },
  is_active: function() {
    return this.is_monthly() ? !!this.current_plan_start : !!this.last_charged;
  },
  lastCharged: function() {
    return moment(this.last_charged).format('ddd MMMM DD, YYYY') || moment().format('ddd MMMM DD, YYYY');
  },
  set_last_charged: function(date) {
    if (!date) return;
    this.update({last_charged: date});
  },
  isRunning: function() {
    return this.ec2().status === 'running';
  },
  isMonthly: function() {
    return this.billing_method === BILLING_METHODS.monthly.name;
  },
  isHourly: function() {
    return this.billing_method === BILLING_METHODS.hourly.name;
  }
});

Orders.before.insert(function (userId, doc) {
  doc.created_at = moment().toDate();
});