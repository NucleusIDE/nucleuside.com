Ultimate('Instance').extends(UltimateModel, 'instances', {
  user: function() {
    return Meteor.users.findOne(this.user_id);
  },
  user: function() {
    return Orders.findOne(this.order_id);
  },
	
	
  isRunning: function() {
    return this.ec2().status === 'running';
  },
  is: function(billingMethod) {
    return this.billing_method === billingMethod;
  }
});