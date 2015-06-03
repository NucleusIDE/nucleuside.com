Ultimate('Instance').extends(UltimateModel, {
  collection: 'instances',
	behaviors: ['EC2', 'ec2', 'server'],

  aggregates: {
    totalCost: {
      field: 'cost',
      operator: 'sum'
    }
  },
  order: function() {
    return Orders.findOne(this.order_id);
  },


  orderIs: function(billingMethod) {
    return this.billing_method === billingMethod;
  },
  displayAmount: function() {
    return Order.BILLING_METHODS[this.billing_method].display_amount;
  },


  isRunning: function() {
    return this.getStatus() === 'running';
  },
  getStatus: function() {
    return this.ec2.status;
  }
});
