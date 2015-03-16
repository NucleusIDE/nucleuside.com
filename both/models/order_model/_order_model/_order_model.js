Ultimate('Order').extends(UltimateModel, 'orders', {
	instance: function() {
		return Instances.findOne(this.instance_id);
	},
  isRunning: function() {
    return this.instance().isRunning();
  }
});

Orders.before.insert(function (userId, doc) {
  doc.created_at = moment().toDate();
});