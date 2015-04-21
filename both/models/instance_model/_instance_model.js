Ultimate('EC2').extends(UltimateBehavior, {});
Ultimate('Instance').extends(UltimateModel, 'instances', {
	behaviors: [EC2, '_ec2', 'ec2', 'client'],
	
	
  order: function() {
    return Orders.findOne(this.order_id);
  },
	
	
  isRunning: function() {
    return this.ec2().status === 'running';
  },
  orderIs: function(billingMethod) {
    return this.billing_method === billingMethod;
  },
	status: function() {
		return this.ec2().status;
	}
});