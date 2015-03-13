BILLING_METHODS = {
  monthly: {
		name: 'monthly',
    billing_period: 30,
    min_units_used: 1,
    cost_per_unit: 160
  },
  hourly: {
		name: 'hourly',
    billing_period: 7,
    min_units_used: 1,
    cost_per_unit: 1
  }
};

Order.extendStatic({
  BILLING_METHODS: {
			monthly: {
		    billing_period: 30,
		    min_units_used: 1,
		    cost_per_unit: 160
		  },
		  hourly: {
		    billing_period: 7,
		    min_units_used: 1,
		    cost_per_unit: 1
		  }
  }
});