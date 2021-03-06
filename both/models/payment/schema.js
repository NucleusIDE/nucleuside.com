Payment.extend({
  schema: {
		user_id: {
			type: String	
		},
		order_id: {
			type: String		
		},
		
		
		units_used: {
			type: Number	
		},
		cost_per_unit: {
			type: Number	
		},
		github_url: {
			type: String	
		},
		subdomain: {
			type: String	
		},
		billing_method: {
			type: String	
		},
		
		
		status: {
			type: String	
		},
		amount: {
			type: Number	
		},
		num: {
			type: Number	
		},
		date: {
			type: Date,		
		},
		
		
		stripe_subscription_id: {
			type: String,		
			optional: true
		},
		stripe_charge_id: {
			type: String,		
			optional: true
		},
		next_attempt: {
			type: String,		
			optional: true
		}
  	},
  	onBeforeInsert: function() {
  		this.num = Payments.find().count() + 1;
  	},
  	subscriptions: {
	    recentPayments: function() {
		      	return {};
	    }	
  	},
	relations: {
		/**
		instance: function() {
			return {
				relation: 'belongs_to',
				model: Instance,
				foreign_key: 'instance_id'
				//aggregates: ['totalCost'],
			}
		}
		**/
	},
	aggregates: {
		totalSpent: {
			field: 'num',
			operator: 'sum',
			allowClient: true
		}
	}
});

