Ultimate('Instance').extends(UltimateModel, 'instances', {
  order: function() {
    return Orders.findOne(this.order_id);
  },
	
	
  isRunning: function() {
    return this.ec2().status === 'running';
  },
  is: function(billingMethod) {
    return this.billing_method === billingMethod;
  },
	ec2: function() {
		return this.composeBehavior('_ec2', EC2, 'client');
	}
});