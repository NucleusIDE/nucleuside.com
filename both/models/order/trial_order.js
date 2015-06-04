Ultimate('TrialOrder').extends(Order, 'orders', {
	schema: function() {
		return _.extend({}, this.callParent('schema'), {
			  trial_started: {
			    	type: Date,
			  }
		});
	},

	defaults: function() {
	    return _.extend({}, this.callParent('defaults'), {
			billing_method: 'trial', 
			units_used: Order.BILLING_METHODS.trial.min_units_used,
			cost_per_unit: Order.BILLING_METHODS.trial.cost_per_unit
	    });
  	},


  	costToCharge: function() { 
  		return 0; 
  	},
	
	
	terminateTrial: function() {
		this.set('trial_started', new Date);
		this.setTimeout(function() {
			this.instance().terminate();
		}, 1000 * 60 * 10);
	}
});