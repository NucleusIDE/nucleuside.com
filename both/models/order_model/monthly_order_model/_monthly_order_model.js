Ultimate('MonthlyOrder').extends(Order, 'orders', {
	billing_method: 'monthly',
	displayAmount: '$160/mo',
	
	construct: function() {
		StripeSubscription.subscribe(this);
	},

	
  costToCharge: function() {
    return this.cost_per_unit;
  },
	cancelSubscription: function() {
		StripeSubscription.cancel(this);
	}
});