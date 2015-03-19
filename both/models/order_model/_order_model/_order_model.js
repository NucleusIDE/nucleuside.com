Ultimate('Order').extends(UltimateModel, 'orders', {
	construct: function(instanceId) {
		this.instance_id = instanceId;
		this.user_id = Meteor.userId();
	},
	instance: function() {
		return Instances.findOne(this.instance_id);
	},
  isRunning: function() {
    return this.instance().isRunning();
  },
  is: function(billingMethod) {
    return this.billing_method === billingMethod;
  }
});

Orders.before.insert(function (userId, doc) {
  doc.created_at = moment().toDate();
});