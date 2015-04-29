Ultimate('Order').extends(UltimateModel, {
  schema: {
    instance_id: {
      type: String,
    },
    user_id: {
      type: String,
    },
  },

  collection: 'orders',
	instance: function() {
		return Instances.findOne(this.instance_id);
	},
  isRunning: function() {
    return this.instance().isRunning();
  },
  orderIs: function(billingMethod) {
    return this.billing_method === billingMethod;
  }
});

/**
Orders.before.insert(function (userId, doc) {
  doc.created_at = moment().toDate();
});
**/