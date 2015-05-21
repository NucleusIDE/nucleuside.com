Order.extendStatic({
  BILLING_METHODS: {
		monthly: {
			name: 'monthly',
			class: function() { return MonthlyOrder; },
	    billing_period: 30,
	    min_units_used: 1,
	    cost_per_unit: 160,
      display_amount: '$160/month'
	  },
	  hourly: {
			name: 'hourly',
			class: function() { return HourlyOrder; },
	    billing_period: 1, //day
	    min_units_used: 2,
	    cost_per_unit: 1.5,
      display_amount: '$1.50/hour'
	  },
	  trial: {
			name: 'trial',
			class: function() { return TrialOrder; },
      display_amount: 'FREE'
	  }
  }
});
