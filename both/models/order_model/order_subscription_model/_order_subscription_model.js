Ultimate('OrderSubscription').extends(Order, 'orders', {
	displayAmount: function() {
		return '$160 / Month';
	},
  costToCharge: function() {
    return this.cost_per_unit;
  }
});