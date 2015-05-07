Ultimate('MonthlyOrder').extends(Order, 'orders', {
  schema: function() {
    return _.extend({}, this.callParent('schema'), {
      units_used: {
        type: Number,
      },
      current_plan_start: {
        type: Number,		//we should converte these to/from Date objects
      },
      current_plan_end: {
        type: Number,
      },
      canceled: {
        type: Boolean
      }
    });
  },

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