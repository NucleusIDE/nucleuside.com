Ultimate('OrderSubscription').extends(Order, 'orders', {
	construct: function(instanceId) {
		this.callParentConstructor(instanceId);
		StripeSubscription.subscribe(this);
	},
	billing_method: 'monthly',
	displayAmount: '$160/mo',
  costToCharge: function() {
    return this.cost_per_unit;
  },
	
	
	cancelSubscription: function() {
		StripeSubscription.cancel(this);
	}
});