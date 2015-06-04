Ultimate('MonthlyOrder').extends(Order, {
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

	defaults: function() {
    return _.extend({}, this.callParent('defaults'), {
      billing_method: 'monthly', 
      units_used: Order.BILLING_METHODS.monthly.min_units_used,
      cost_per_unit: Order.BILLING_METHODS.monthly.cost_per_unit
    });
  },


	construct: function() {
		StripeSubscription.subscribe(this);
	},

	
  costToCharge: function() {
    return this.cost_per_unit;
  }
});