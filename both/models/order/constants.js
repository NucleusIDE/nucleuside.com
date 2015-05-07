Order.extendStatic({
  BILLING_METHODS: {
		monthly: {
			name: 'monthly',
			class: function() { return MonthlyOrder; },
	    billing_period: 30,
	    min_units_used: 1,
	    cost_per_unit: 160
	  },
	  hourly: {
			name: 'hourly',
			class: function() { return HourlyOrder; },
	    billing_period: 1, //day
	    min_units_used: 1,
	    cost_per_unit: 1.5
	  },
	  trial: {
			name: 'trial',
			class: function() { return TrialOrder; }
	  }
  }
});