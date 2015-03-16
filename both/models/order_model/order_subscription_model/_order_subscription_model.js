Ultimate('OrderSubscription').extends(Order, 'orders', {
	displayAmount: function() {
		return '$160/mo';
	},
  costToCharge: function() {
    return this.cost_per_unit;
  }
});